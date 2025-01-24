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

        stage('deploy with Docker Compose') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'PORT_ANMERASTORE', 'variable': 'PORT'),
                        string(credentialsId: 'DB_HOST_ANMERASTORE', 'variable': 'DB_HOST'),
                        string(credentialsId: 'DB_USER_ANMERASTORE', 'variable': 'DB_USER'),
                        string(credentialsId: 'DB_PASSWORD_ANMERASTORE', 'variable': 'DB_PASSWORD'),
                        string(credentialsId: 'DB_NAME_ANMERASTORE', 'variable': 'DB_NAME'),
                        string(credentialsId: 'DB_PORT_ANMERASTORE', 'variable': 'DB_PORT'),
                        string(credentialsId: 'DB_NAME_BASEADMIN_ANMERASTORE', 'variable': 'DB_NAME_BASEADMIN'),
                    ]) {
                        sh '''
                            echo "INiciando despliegue con docker Compose"
                            PORT=$PORT \
                            DB_HOST=$DB_HOST \
                            DB_USER=$DB_USER \
                            DB_PASSWORD=$DB_PASSWORD \
                            DB_NAME=$DB_NAME \
                            DB_PORT=$DB_PORT \
                            DB_NAME_BASEADMIN=$DB_NAME_BASEADMIN \
                            docker compose down -v \
                            docker compose up --build -d
                        '''
                        
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
    }
}