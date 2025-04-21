node {
    stage('Determine Nested Jenkinsfile') {
        def branchName = env.BRANCH_NAME

        def jenkinsfiles = [
            'auth': 'EchoMateLite/Services/Auth/Jenkinsfile-auth',
        ]

        // Select the Jenkinsfile based on the branch name
        echo "Selected nested Jenkinsfile: ${jenkinsfiles[branchName]}"

        // clone the repository containing the nested Jenkinsfile
        git branch: branchName, url: 'https://github.com/nariyao/EchoMateLite.git'
        // Load and execute the selected Jenkinsfile
        load jenkinsfiles[branchName]
    }
}