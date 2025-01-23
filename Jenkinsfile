pipeline {
    agent any
    tools {
        maven 'Maven'
    }
	
	environment {
        SCANNER_HOME = tool 'sonarqube'
    }

    stages {

        stage('check Docker info'){
            steps {
                sh 'docker compose --version'
            }
        }


        stage('Git Checkout') {
            steps {
                git branch: 'desarrollo', url: 'https://github.com/merchussoft/anmerastoreapi'
                echo 'Git Checkout Completed'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(credentialsId: 'sonarqube', installationName: 'sonarqube') {
                    sh '''
					$SCANNER_HOME/bin/sonar-scanner \
						-Dsonar.projectKey=anmerastoreapi \
						-Dsonar.projectName=anmerastoreapi \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=/var/jenkins_home/workspace/anmerastoreapi \
                        -Dsonar.sourceEncoding=UTF-8
					'''
                    echo 'SonarQube Analysis Completed'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! The application has been deployed."
        }
        failure {
            echo "Pipeline failed! The application has not been deployed."
        }
        always{
            sh 'rm -rf *' // Elimina todo en el directorio actual
        }
    }
}