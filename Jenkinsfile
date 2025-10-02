pipeline {
  agent none
  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Build & Test') {
      agent { docker { image 'node:20' } }
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
        sh 'npm run test:ci'
        sh 'npm run build'
        junit 'junit.xml'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Docker Build & Push') {
      when {
        expression { return env.DOCKER_REGISTRY && env.DOCKER_IMAGE && env.DOCKER_CREDENTIALS_ID }
      }
      agent any
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'REG_USER', passwordVariable: 'REG_PWD')]) {
          sh '''
          echo "$REG_PWD" | docker login ${DOCKER_REGISTRY} -u "$REG_USER" --password-stdin
          docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${GIT_COMMIT} -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest .
          docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${GIT_COMMIT}
          docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
          docker logout ${DOCKER_REGISTRY}
          '''
        }
      }
    }
  }

  post {
    always { echo 'Pipeline finished.' }
    success { echo 'Build OK' }
    failure { echo 'Build failed' }
  }
}

