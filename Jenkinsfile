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

        stage('Security Scan - Trivy') {
            steps {
                sh """
                    mkdir -p ${WORKSPACE}/trivy-reports

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      -v ${WORKSPACE}/trivy-reports:/reports \
                      aquasec/trivy:0.69.3 image \
                      --severity HIGH,CRITICAL \
                      --format json \
                      --output /reports/backend-trivy.json \
                      ${BACKEND_IMAGE} || true    

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      -v ${WORKSPACE}/trivy-reports:/reports \
                      aquasec/trivy:0.69.3 image \
                      --severity HIGH,CRITICAL \
                      --format json \
                      --output /reports/frontend-trivy.json \
                      ${FRONTEND_IMAGE} || true
                """
                // FIX 3: removed dynamic date from filename — archiveArtifacts glob needs a stable pattern
                archiveArtifacts artifacts: 'trivy-reports/*.json', allowEmptyArchive: true
            }
        }

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
                    echo "--- Verifying prometheus.yml exists before deploy ---"
                    ls -lh ${WORKSPACE}/monitoring/prometheus.yml || { echo "ERROR: prometheus.yml not found!"; exit 1; }
                    # FIX 1: fail early with a clear message if the file is missing
                    # instead of letting Docker create it as a directory

                    file ${WORKSPACE}/monitoring/prometheus.yml
                    # FIX 2: confirm it's actually a file and not a directory

                    export BACKEND_IMAGE=${BACKEND_IMAGE}
                    export FRONTEND_IMAGE=${FRONTEND_IMAGE}
                    docker-compose pull
                    docker-compose up -d --remove-orphans
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for services to be ready..."
                    sleep 15                           

                    echo "Checking backend API..."
                    curl -f http://localhost:3001/api/health || exit 1

                    echo "Checking frontend..."
                    curl -f http://localhost:80 || exit 1    

                    echo "Checking Prometheus..."
                    curl -f http://localhost:9090/-/healthy || exit 1

                    echo "Checking Grafana..."
                    curl -f http://localhost:3000/api/health || exit 1
                """
                // FIX 8: frontend port changed from 5173 to 80 (production nginx)
                // FIX 9: added sleep to give containers time to start before health checks
                // FIX 10: use proper health endpoints for Prometheus and Grafana
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