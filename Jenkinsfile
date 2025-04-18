node {
    stage('Determine Nested Jenkinsfile') {
        def branchName = env.BRANCH_NAME

        def jenkinsfiles = [
            'services': 'EchoMateLite/Services/Jenkinsfile-services'
        ]

        // Select the Jenkinsfile based on the branch name
        echo "Selected nested Jenkinsfile: ${jenkinsfiles['services']}"

        // clone the repository containing the nested Jenkinsfile
        git branch: branchName, url: 'https://github.com/nariyao/EchoMateLite.git'
        // Load and execute the selected Jenkinsfile
        load jenkinsfiles['services']
    }
}