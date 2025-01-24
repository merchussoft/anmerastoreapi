pipeline {
    agent any
    tools {
        maven 'Maven'
    }
	
	environment {
        SCANNER_HOME = tool 'sonarqube'
        PORT = credentials('PORT_ANMERASTORE')
        DB_HOST = credentials('DB_HOST_ANMERASTORE')
        DB_USER = credentials('DB_USER_ANMERASTORE')
        DB_PASSWORD = credentials('DB_PASSWORD_ANMERASTORE')
        DB_NAME = credentials('DB_NAME_ANMERASTORE')
        DB_PORT = credentials('DB_PORT_ANMERASTORE')
        DB_NAME_BASEADMIN = credentials('DB_NAME_BASEADMIN')
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


    post {
        success {
            echo "Pipeline completed successfully! The application has been deployed."
        }
        failure {
            echo "Pipeline failed! The application has not been deployed."
        }
    }
}