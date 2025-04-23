def call(stackName) {
    echo "Deleting CloudFormation stack: ${stackName}"
    def result = sh(script: "aws cloudformation delete-stack --stack-name ${stackName}", returnStatus: true)
    if (result != 0) {
        error("CloudFormation stack deletion failed for ${stackName}")
        return false
    }
    
    // Wait for stack deletion to complete
    return waitForStackOperation(stackName, 'DEL')
}
