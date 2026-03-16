pipeline {
    agent any

    environment {-
        
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/Muezza863/bulletin-board-backend.git', branch: 'main'
            }
        }

        stage('Inject ENV') {
            steps {
                // withCredentials menggunakan syntax list of map: [file(credentialsId: '...', variable: '...')]
                withCredentials([file(credentialsId: 'bulletin-env-file', variable: 'ENV_FILE')]) {
                    // Karena menggunakan Windows environment (bat), panggil variabel dengan %NAMA_VARIABEL%
                    bat 'copy "%ENV_FILE%" .env'
                }
            }
        }

        stage('Build Docker') {
            steps {
                // Secara opsional jika sudah ada '--build' di stage deploy, stage ini bisa dihilangkan.
                // Tapi ini tidak masalah untuk memastikan build berhasil sebelum down container lama.
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                    docker compose down || true
                    docker compose up -d --build
                    docker ps
                '''
            }
        }
    }
}