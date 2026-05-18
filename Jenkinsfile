pipeline {
  agent any

  environment {
    NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJS'
    PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    SONAR_TOKEN = credentials('sonarqube-token')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install API dependencies') {
      steps {
        dir('api-supabase') {
          sh 'npm install'
        }
      }
    }

    stage('Install Frontend dependencies') {
      steps {
        dir('ProjetoP5') {
          sh 'npm install'
        }
      }
    }

    stage('Lint frontend') {
      steps {
        dir('ProjetoP5') {
          sh 'npm run lint'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh 'sonar-scanner -Dsonar.login=$SONAR_TOKEN'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'api-supabase/**/npm-debug.log, ProjetoP5/**/npm-debug.log', allowEmptyArchive: true
      cleanWs()
    }
  }
}
