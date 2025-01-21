pipeline {
    agent any

    environment {
        APP_DIR = '/var/jenkins_home/workspace/nodejs-app' // Cambia esta ruta según sea necesario
        REPO_URL = 'https://github.com/merchussoft/anmerastoreapi.git' // Repositorio Git
        BRANCH = 'desarrollo'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing dependencies... con yarn "
                yarn install
                '''
            }
        }

        stage('Build App') {
            steps {
                sh '''
                echo "Building the application..."
                yarn build
                '''
            }
        }

        stage('Deploy App') {
            steps {
                sh '''
                echo "Starting the application..."
                yarn start
                '''
            }
        }
    }

    post {
        success {
            echo "Application deployed successfully!"
        }
        failure {
            echo "Deployment failed. Check the logs for details."
        }
    }
}