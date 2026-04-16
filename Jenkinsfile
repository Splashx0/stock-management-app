pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        nodejs "nodejs"
    }

    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        SONARQUBE_URL      = credentials('sonarqube-url')
        SONARQUBE_TOKEN    = credentials('sonarqube-token')
        DATABASE_URL       = "postgresql://splash:splash@host.docker.internal:5432/stock_db" 

        BACKEND_IMAGE  = "${DOCKERHUB_USERNAME}/stock-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/stock-frontend:${BUILD_NUMBER}"
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
                sh 'echo "Repository cloned successfully"'
            }
        }

        stage('SonarQube Analysis - Backend') {
            steps {
                dir('backend') {
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=stock-management-backend \
                          -Dsonar.host.url=${SONARQUBE_URL} \
                          -Dsonar.login=${SONARQUBE_TOKEN} \
                          -Dsonar.sources=src
                    """
                }
            }
        }

        stage('SonarQube Analysis - Frontend') {
            steps {
                dir('frontend') {
                    sh """
                        sonar-scanner \
                          -Dsonar.projectKey=stock-management-frontend \
                          -Dsonar.host.url=${SONARQUBE_URL} \
                          -Dsonar.login=${SONARQUBE_TOKEN} \
                          -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t ${BACKEND_IMAGE} ./backend
                    docker build -t ${FRONTEND_IMAGE} ./frontend
                """
            }
        }

/*stage('Security Scan - Trivy') {
    steps {
        sh """
                        mkdir -p trivy-reports

                        echo "Scanning Backend image..."
                        docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:0.69.3 image \
                            --severity HIGH,CRITICAL \
                            --format json \
                            --output - \
                            --exit-code 0 \
                            ${BACKEND_IMAGE} > trivy-reports/backend-trivy.json

                        echo "Scanning Frontend image..."
                        docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:0.69.3 image \
                            --severity HIGH,CRITICAL \
                            --format json \
                            --output - \
                            --exit-code 0 \
                            ${FRONTEND_IMAGE} > trivy-reports/frontend-trivy.json

                        echo "--- Verifying reports were created ---"
                        ls -lh trivy-reports/
        """

                archiveArtifacts artifacts: 'trivy-reports/*.json', allowEmptyArchive: false
    }
}*/

        stage('Push to Registry') {
            steps {
                sh """
                    echo \$DOCKERHUB_PASSWORD | docker login -u \$DOCKERHUB_USERNAME --password-stdin
                    docker push ${BACKEND_IMAGE}
                    docker push ${FRONTEND_IMAGE}
                """
                // FIX 4: use --password-stdin instead of -p flag to avoid password in shell history/logs
            }
        }

        stage('Deploy to Production') {
            steps {
                sh """
                    docker-compose up -d --remove-orphans
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'   // FIX 11: always logout from registry
            cleanWs()
        }
        success {
            echo "Build ${BUILD_NUMBER} deployed successfully."
        }
        failure {
            sh """
                echo "Build failed — collecting logs..."
                docker-compose logs --tail=100 || true
            """
        }
    }
}