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
                git branch: 'desarrollo', url: 'https://github.com/merchussoft/anmerastoreapi.git'
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

        stage('Check Quality Gate') {
            steps {
                script {
                    // Consultamos el estado de la Quality Gate de Sonarqube
                    def sonarStatus = sh(
                        script: '''curl -s "http:192.168.1.50:9000/api/qualitygates/project_status?projectKey=anmerastoreapi" | jq -r .projectStatus.status''',
                        returnStdout: true
                    ).trim()

                    // verificamos si el estado de la Quality Gate es OK o ERROR
                    if(sonarStatus!= 'OK') {
                        error "SonarQube Quality Gate failed. Status: ${sonarStatus}"
                    } else {
                        echo "SonarQube Quality Gate passed!"
                    }
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