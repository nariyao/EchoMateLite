def call(templatePath, templateName) {
    echo "Validating CloudFormation template: ${templateName}"
    dir(templatePath) {
        // Check if the template file exists
        if (!fileExists(templateName)) {
            error("CloudFormation template ${templateName} does not exist in path ${templatePath}")
            return false
        }
        def result = sh(script: "aws cloudformation validate-template --template-body file://${templateName}", returnStatus: true)
        if (result != 0) {
            error("CloudFormation template validation failed for ${templateName}")
            return false
        }
    }
    return true
}