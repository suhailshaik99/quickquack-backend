pipeline {
    agent any

    environment {
        APP_VERSION = 'v1.2.0'
        GCP_REGION = 'us-central1'
        GCP_PROJECT_ID = 'glossy-odyssey-459713-n6'
        CLOUD_RUN_SERVICE_NAME = 'quickquack-backend'
        DOCKER_IMAGE_NAME = 'suhailshaik99/quickquack-backend'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the Docker image...'
                script {
                    docker.build("${DOCKER_IMAGE_NAME}:${APP_VERSION}")
                }
            }
        }

        stage('Tag and Push to Docker Hub') {
            steps {
                echo 'Tagging and pushing the image to Docker Hub...'
                script {
                    withDockerRegistry([ credentialsId: 'docker-credentials', url: '' ]) {
                        docker.image(DOCKER_IMAGE_NAME).push("${APP_VERSION}")
                        docker.image(DOCKER_IMAGE_NAME).push('latest')
                    }
                }
            }
        }
    }
}
