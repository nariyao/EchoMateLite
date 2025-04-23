@Library ('EchoMateLite') _
def call(stackName, statusType = 'CU') {
    echo "Waiting for stack ${stackName} operation to complete..."
    def status = ''
    def count = 0
    def maxAttempts = 60 // 30 minutes timeout (60 * 30 seconds)
    
    while (count < maxAttempts) {
        try {
            // Check the stack status
            def result = sh(script: "aws cloudformation describe-stacks --stack-name ${stackName} --query 'Stacks[0].StackStatus' --output text", returnStdout: true).trim()
            status = result
            echo "Current stack status: ${status}"
        } catch (Exception e) {
            if (statusType == 'DEL') {
                echo "Stack ${stackName} does not exist. It may have been deleted or never created."
                return true
            } else {
                error("Failed to describe stack ${stackName}: ${e.message}")
                return false
            }
            sleep 30 // Wait 30 seconds before next check
            count++
            continue
        }
        if (status.endsWith('COMPLETE')) {
            if (status == 'CREATE_COMPLETE' || status == 'UPDATE_COMPLETE') {
                echo "Stack ${stackName} operation completed successfully"
                return true
            } else if (status == 'ROLLBACK_COMPLETE' || status == 'UPDATE_ROLLBACK_COMPLETE') {
                error("Stack ${stackName} operation failed and rolled back")
                return false
            }
        } else if (status.endsWith('FAILED')) {
            error("Stack ${stackName} operation failed with status: ${status}")
            return false
        }
        
        sleep 30 // Wait 30 seconds before next check
        count++
    }
    
    error("Timeout waiting for stack ${stackName} operation to complete")
    return false
}
