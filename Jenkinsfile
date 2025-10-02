pipeline {
  agent any
  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Build & Test') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
        sh 'npm run test:ci'
        sh 'npm run build'
        junit 'junit.xml'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
  }

  post {
    always { echo 'Pipeline finished.' }
    success { echo 'Build OK' }
    failure { echo 'Build failed' }
  }
}
