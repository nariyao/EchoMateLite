pipeline {
    agent any
    stages {
        stage('Determine Nested Jenkinsfile') {
            steps {
                script {
                    // Get the branch name
                    def branchName = env.BRANCH_NAME
                    
                    def jenkinsfiles = [
                        'services': 'EchoMateLite/Services/Jenkinsfile-services'
                    ]
                    // Select the Jenkinsfile based on the branch name or default to 'Jenkinsfile-default'
                    echo "Selected nested Jenkinsfile: ${jenkinsfiles[branchName]}"                    
                    // Execute the selected Jenkinsfile
                    //load jenkinsfiles[branchName]
                }
            }
        }
    }
}