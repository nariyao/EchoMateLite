node {
    stage('Determine Nested Jenkinsfile') {
        def branchName = env.BRANCH_NAME

        def jenkinsfiles = [
            'services': 'EchoMateLite/Services/Jenkinsfile-services'
        ]

        // Select the Jenkinsfile based on the branch name
        //echo "Selected nested Jenkinsfile: ${jenkinsfiles[branchName]}"

        // Load and execute the selected Jenkinsfile
        //load jenkinsfiles[branchName]
        load "EchoMateLite/Services/Jenkinsfile-services" //temporary solution to load the services Jenkinsfile
        
    }
}