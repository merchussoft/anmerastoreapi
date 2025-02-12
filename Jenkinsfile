pipeline {
    agent any
    tools {
        maven 'Maven'
    }
	
	environment {
        SCANNER_HOME = tool 'sonarqube'
        DB_HOST = credentials('DB_HOST_ANMERASTORE')
        DB_USER = credentials('DB_USER_ANMERASTORE')
        DB_PASSWORD = credentials('DB_PASSWORD_ANMERASTORE')
        DB_NAME = credentials('DB_NAME_ANMERASTORE')
        DB_PORT = credentials('DB_PORT_ANMERASTORE')
        DB_NAME_BASEADMIN = credentials('DB_NAME_BASEADMIN_ANMERASTORE')
        PORT = credentials('PORT_ANMERASTORE')
        SONAR_URL = "http://192.168.1.50:9000"
    }

    stages {

        stage('stop and down and eraser volumes Docker Compose') {
            steps {

                    sh '''
                        echo "tumbando los contenedores y sus volumes anteriores"
                        docker compose down -v
                    '''

            }
        }

        stage('Cleanup Previous Build'){
            steps {
                script {
                    echo 'Limpiando archivos de compilación anteriores...'
                    sh """
                        echo 'Eliminando archivos de compilación anteriores para este proyecto...'
                        rm -rf ./* # Elimina solo los archivos en el workspace actual
                        docker system prune -f
                    """
                }
            }
        }


        stage('Git Checkout') {
            steps {
                git branch: 'desarrollo', url: 'https://github.com/merchussoft/anmerastoreapi.git'
                echo '✅ Git Checkout Completado'
            }
        }

        

        stage('Install Dependencies yarn ') {
            steps {
                script {
                    sh '''
                        echo "instalando las depenciar de yarn fuera del contendor"
                        yarn install --frozen-lockfile
                    '''
                }
            }
        }

        stage('deploy with Docker Compose') {
            steps {
                script {
                    sh '''
                        echo "desplegando la aplicaion con docker"
                        docker compose build --no-cache
                        docker compose up -d --force-recreate
                    '''
                }
            }
        }

        
    }


    post {
        always {
            script {
                def color = (currentBuild.result == 'SUCCESS') ? 'good' : 'danger'
                def status = (currentBuild.result == 'SUCCESS') ? '✅ ÉXITO' : '❌ FALLÓ'
                def summary = """*${status}*
                    📌 *Job:* ${env.JOB_NAME}
                    🔢 *Build Number:* ${env.BUILD_NUMBER}
                    🌿 *Branch:* ${env.GIT_BRANCH}
                    🔗 *Commit:* ${env.GIT_COMMIT}
                    👤 *Ejecutado por:* ${env.BUILD_USER}
                    🔗 *Ver detalles:* <${env.BUILD_URL}|Click aqui>
                """

                slackSend(color: color, message: summary)
            }
        }
    }
}