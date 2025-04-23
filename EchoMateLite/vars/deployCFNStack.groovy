def call(templatePath, stackName, templateName, parametersFile='Parameters.yml', iamCapabilities = '') {
    dir(templatePath) {
        // Validate input parameters
        if (!fileExists(parametersFile)) {
            error("Parameters file ${parametersFile} does not exist in path ${templatePath}")
            return false
        }

        def newStackName = "${env.PROJECT_PREFIX}-${stackName}"
        def capabilities = iamCapabilities ? "--capabilities ${iamCapabilities}" : ''
        
        echo "Deploying CloudFormation stack: ${newStackName}"
        def stackExists = false
        try {
            // Check if stack exists
            stackExists = sh(
                script: "aws cloudformation describe-stacks --stack-name ${newStackName}",
                returnStatus: true
            ) == 0

            if (stackExists) {
                echo "Stack ${newStackName} exists. Attempting update..."
                try {
                    sh """
                        aws cloudformation update-stack \
                        --stack-name ${newStackName} \
                        --template-body file://${templateName} \
                        --parameters file://${parametersFile} \
                        ${capabilities}
                    """
                } catch (Exception e) {
                    // Check if the error is "No updates are to be performed"
                    echo "Error during stack update: ${e.getMessage()}"
                    if (e.getMessage().contains("exit code 254")) {
                        echo "No updates needed for stack ${newStackName}"
                        return true
                    }
                    throw e
                }
            } else {
                echo "Creating new stack ${newStackName}..."
                sh """
                    aws cloudformation create-stack \
                    --stack-name ${newStackName} \
                    --template-body file://${templateName} \
                    --parameters file://${parametersFile} \
                    ${capabilities}
                """
            }

            // Wait for stack operation to complete
            return waitForStackOperation(newStackName)

        } catch (Exception e) {
            echo "Error during stack deployment: ${e.getMessage()}"
            // Only attempt deletion if stack creation failed
            if (!stackExists) {
                deleteCFNStack(newStackName, 'DEL')
            }
            error("CloudFormation stack deployment failed for ${newStackName}")
            return false
        }
    }
}