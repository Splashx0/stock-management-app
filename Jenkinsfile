pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        sonarScanner 'sonar-scanner'
    }


    environment {
        // Load secrets from Jenkins credentials (Docker Hub)
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        SONARQUBE_URL = credentials('sonarqube-url')
        SONARQUBE_TOKEN = credentials('sonarqube-token')
        
        // Computed variables
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/stock-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/stock-frontend:${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
                script {
                    sh 'echo "Repository cloned successfully"'
                }
            }
        }

        stage('SonarQube Analysis - Backend') {
            steps {
                script {
                    dir('backend') {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=stock-management-backend \
                              -Dsonar.host.url=${SONARQUBE_URL} \
                              -Dsonar.login=${SONARQUBE_TOKEN} \
                              -Dsonar.sources=src
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis - Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=stock-management-frontend \
                              -Dsonar.host.url=${SONARQUBE_URL} \
                              -Dsonar.login=${SONARQUBE_TOKEN} \
                              -Dsonar.sources=src
                        '''
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm install && npm run build'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'npm install && npm run build'
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                        docker build -t ${BACKEND_IMAGE} ./backend
                        docker build -t ${FRONTEND_IMAGE} ./frontend
                    '''
                }
            }
        }

      /*  stage('Security Scan - Trivy') {
            steps {
                script {
                    sh '''
                        trivy image --severity HIGH,CRITICAL \
                          --format json \
                          --output backend-trivy-report.json \
                          ${BACKEND_IMAGE}

                        trivy image --severity HIGH,CRITICAL \
                          --format json \
                          --output frontend-trivy-report.json \
                          ${FRONTEND_IMAGE}
                    '''
                }
                archiveArtifacts artifacts: '*-trivy-report.json'
            }
        }*/

        stage('Push to Registry') {
            steps {
                script {
                    sh '''
                        docker push ${BACKEND_IMAGE}
                        docker push ${FRONTEND_IMAGE}
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    sh '''
                        docker pull ${BACKEND_IMAGE}
                        docker pull ${FRONTEND_IMAGE}
                        docker compose -f docker-compose.yml up -d
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh '''
                        echo "Checking backend API..."
                        curl -f http://localhost:3001/api/health || exit 1

                        echo "Checking frontend..."
                        curl -f http://localhost:5173 || exit 1

                        echo "Checking Prometheus..."
                        curl -f http://localhost:9090 || exit 1

                        echo "Checking Grafana..."
                        curl -f http://localhost:3000 || exit 1
                    '''
                }
            }
        }
    }

    /*post {
        always {
            cleanWs()
        }
        success {
            emailext(
                subject: "✅ Build Successful: ${BUILD_NUMBER}",
                body: "Build ${BUILD_NUMBER} completed successfully.\n\nCommit: ${GIT_COMMIT_SHORT}",
                to: "${ALERT_EMAIL}"
            )
        }
        failure {
            emailext(
                subject: "❌ Build Failed: ${BUILD_NUMBER}",
                body: "Build ${BUILD_NUMBER} failed.\n\nPlease check Jenkins logs.",
                to: "${ALERT_EMAIL}"
            )
        }
    }*/
}
