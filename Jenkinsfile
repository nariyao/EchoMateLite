node {
    stage('Determine Nested Jenkinsfile') {
        def branchName = env.BRANCH_NAME

        def jenkinsfiles = [
            'image': 'EchoMateLite/Services/Image/Jenkinsfile-image',
        ]

        // Select the Jenkinsfile based on the branch name
        echo "Selected nested Jenkinsfile: ${jenkinsfiles[branchName]}"

        // clone the repository containing the nested Jenkiansfile
        git branch: branchName, url: 'https://github.com/nariyao/EchoMateLite.git'
        // Load and execute the selected Jenkinsfile
        load jenkinsfiles[branchName]
    }
}