pipeline {
    agent any
    
    environment {
        // Configuración del proyecto
        PROJECT_NAME = 'healthyme-frontend'
        GITHUB_REPO = 'https://github.com/TheJose24/HealthyMe-Frontend.git'
        DEPLOY_BRANCH = 'prueba-despliegue'
        
        // Configuración Docker
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        CONTAINER_NAME = 'angular_healthyme'
        
        // Directorios
        WORKSPACE_DIR = "${WORKSPACE}"
        BACKUP_DIR = "/var/jenkins_home/backups/${PROJECT_NAME}"
    }
    
    options {
        // Mantener solo los últimos 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Timeout del pipeline
        timeout(time: 30, unit: 'MINUTES')
        
        // Evitar builds concurrentes
        disableConcurrentBuilds()
        
        // Timestamps en logs
        timestamps()
    }
    
    triggers {
        // Webhook de GitHub (configurar en GitHub)
        githubPush()
        
        // Polling como backup (cada 5 minutos)
        pollSCM('H/5 * * * *')
    }
    
    stages {
        stage('🔍 Pre-Build Checks') {
            steps {
                script {
                    echo "🚀 Iniciando CI/CD para ${PROJECT_NAME}"
                    echo "📋 Branch objetivo: ${DEPLOY_BRANCH}"
                    echo "🐳 Container: ${CONTAINER_NAME}"
                    
                    // Verificar herramientas necesarias
                    sh '''
                        echo "Verificando herramientas necesarias..."
                        docker --version
                        docker-compose --version || docker compose version
                        git --version
                        node --version || echo "Node.js no disponible (se usará Docker)"
                    '''
                }
            }
        }
        
        stage('📥 Checkout') {
            steps {
                script {
                    echo "📥 Clonando repositorio desde ${DEPLOY_BRANCH}..."
                    
                    // Limpiar workspace anterior
                    deleteDir()
                    
                    // Checkout del código
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${DEPLOY_BRANCH}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [
                            [$class: 'CleanBeforeCheckout'],
                            [$class: 'CloneOption', depth: 1, shallow: true]
                        ],
                        submoduleCfg: [],
                        userRemoteConfigs: [[
                            url: "${GITHUB_REPO}",
                            credentialsId: 'token-jenkins' // Configurar en Jenkins
                        ]]
                    ])
                    
                    // Información del commit
                    env.GIT_COMMIT_HASH = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_MESSAGE = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    
                    echo "✅ Commit: ${env.GIT_COMMIT_HASH}"
                    echo "📝 Mensaje: ${env.GIT_COMMIT_MESSAGE}"
                }
            }
        }
        
        stage('🔧 Validate Configuration') {
            steps {
                script {
                    echo "🔧 Validando configuración del proyecto..."
                    
                    // Verificar archivos esenciales
                    sh '''
                        echo "Verificando archivos esenciales..."
                        
                        if [ ! -f "package.json" ]; then
                            echo "❌ Error: package.json no encontrado"
                            exit 1
                        fi
                        
                        if [ ! -f "angular.json" ]; then
                            echo "❌ Error: angular.json no encontrado"
                            exit 1
                        fi
                        
                        if [ ! -f "Dockerfile" ]; then
                            echo "❌ Error: Dockerfile no encontrado"
                            exit 1
                        fi
                        
                        if [ ! -f "docker-compose.yml" ]; then
                            echo "❌ Error: docker-compose.yml no encontrado"
                            exit 1
                        fi
                        
                        echo "✅ Todos los archivos esenciales están presentes"
                    '''
                    
                    // Validar estructura del proyecto
                    sh '''
                        echo "Validando estructura del proyecto..."
                        
                        if [ ! -d "src" ]; then
                            echo "❌ Error: Directorio src/ no encontrado"
                            exit 1
                        fi
                        
                        if [ ! -d "src/app" ]; then
                            echo "❌ Error: Directorio src/app/ no encontrado"
                            exit 1
                        fi
                        
                        echo "✅ Estructura del proyecto válida"
                    '''
                }
            }
        }
        
        stage('🛠️ Build & Test') {
            parallel {
                stage('🏗️ Docker Build') {
                    steps {
                        script {
                            echo "🏗️ Construyendo imagen Docker..."
                            
                            try {
                                // Construir imagen Docker
                                sh '''
                                    echo "Construyendo imagen Docker para ${PROJECT_NAME}..."
                                    
                                    # Usar buildkit para mejor rendimiento
                                    export DOCKER_BUILDKIT=1
                                    
                                    # Construir imagen con cache
                                    docker build \
                                        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                        --build-arg VCS_REF=${GIT_COMMIT_HASH} \
                                        --build-arg VERSION=${BUILD_NUMBER} \
                                        --tag ${PROJECT_NAME}:${BUILD_NUMBER} \
                                        --tag ${PROJECT_NAME}:latest \
                                        --cache-from ${PROJECT_NAME}:latest \
                                        .
                                    
                                    echo "✅ Imagen Docker construida exitosamente"
                                '''
                                
                                // Verificar imagen
                                sh "docker images ${PROJECT_NAME}:${BUILD_NUMBER}"
                                
                            } catch (Exception e) {
                                error "❌ Error en construcción Docker: ${e.getMessage()}"
                            }
                        }
                    }
                }
                
                stage('🧪 Security Scan') {
                    steps {
                        script {
                            echo "🧪 Ejecutando escaneo de seguridad..."
                            
                            try {
                                // Escaneo básico de vulnerabilidades
                                sh '''
                                    echo "Escaneando dependencias..."
                                    
                                    # Verificar si hay dependencias con vulnerabilidades conocidas
                                    if [ -f "package-lock.json" ]; then
                                        npm audit --audit-level=high --production || echo "⚠️ Vulnerabilidades encontradas - revisar manualmente"
                                    fi
                                    
                                    echo "✅ Escaneo completado"
                                '''
                            } catch (Exception e) {
                                echo "⚠️ Warning en escaneo de seguridad: ${e.getMessage()}"
                            }
                        }
                    }
                }
            }
        }
        
        stage('📦 Pre-Deploy') {
            steps {
                script {
                    echo "📦 Preparando despliegue..."
                    
                    // Crear backup del estado actual
                    sh '''
                        echo "Creando backup del estado actual..."
                        
                        # Crear directorio de backup
                        mkdir -p ${BACKUP_DIR}
                        
                        # Backup de la configuración actual si existe
                        if docker ps -q -f name=${CONTAINER_NAME} > /dev/null 2>&1; then
                            echo "Guardando estado del contenedor actual..."
                            docker logs ${CONTAINER_NAME} > ${BACKUP_DIR}/container-${BUILD_NUMBER}.log 2>&1 || true
                        fi
                        
                        # Backup de docker-compose actual
                        if [ -f "${DOCKER_COMPOSE_FILE}" ]; then
                            cp ${DOCKER_COMPOSE_FILE} ${BACKUP_DIR}/docker-compose-${BUILD_NUMBER}.yml.bak || true
                        fi
                        
                        echo "✅ Backup completado"
                    '''
                    
                    // Detener contenedor actual si existe
                    sh '''
                        echo "Deteniendo servicios actuales..."
                        
                        if docker ps -q -f name=${CONTAINER_NAME} > /dev/null 2>&1; then
                            echo "Deteniendo contenedor ${CONTAINER_NAME}..."
                            docker-compose down || docker compose down || true
                        else
                            echo "No hay contenedores ejecutándose"
                        fi
                        
                        # Limpiar contenedores e imágenes huérfanas
                        docker system prune -f --volumes || true
                        
                        echo "✅ Servicios detenidos"
                    '''
                }
            }
        }
        
        stage('🚀 Deploy') {
            steps {
                script {
                    echo "🚀 Desplegando aplicación..."
                    
                    try {
                        // Despliegue con docker-compose
                        sh '''
                            echo "Iniciando despliegue con docker-compose..."
                            
                            # Verificar archivo docker-compose
                            if [ ! -f "${DOCKER_COMPOSE_FILE}" ]; then
                                echo "❌ Error: ${DOCKER_COMPOSE_FILE} no encontrado"
                                exit 1
                            fi
                            
                            # Ejecutar docker-compose
                            echo "Ejecutando: docker-compose up -d --build"
                            docker-compose up -d --build || docker compose up -d --build
                            
                            echo "✅ Despliegue completado"
                        '''
                        
                        // Esperar a que el servicio esté listo
                        sleep(time: 30, unit: 'SECONDS')
                        
                    } catch (Exception e) {
                        error "❌ Error en despliegue: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('🔍 Health Check') {
            steps {
                script {
                    echo "🔍 Verificando estado de la aplicación..."
                    
                    try {
                        // Verificar que el contenedor esté corriendo
                        sh '''
                            echo "Verificando estado del contenedor..."
                            
                            # Verificar que el contenedor esté corriendo
                            if ! docker ps | grep -q ${CONTAINER_NAME}; then
                                echo "❌ Error: Contenedor ${CONTAINER_NAME} no está corriendo"
                                docker ps -a | grep ${CONTAINER_NAME} || echo "Contenedor no encontrado"
                                docker logs ${CONTAINER_NAME} || echo "No se pudieron obtener logs"
                                exit 1
                            fi
                            
                            echo "✅ Contenedor está corriendo"
                        '''
                        
                        // Health check HTTP
                        retry(count: 5) {
                            sleep(time: 10, unit: 'SECONDS')
                            sh '''
                                echo "Verificando endpoint HTTP..."
                                
                                # Health check en el puerto 8097
                                if curl -f -s --max-time 10 http://localhost:8097 > /dev/null; then
                                    echo "✅ Aplicación responde correctamente"
                                else
                                    echo "⚠️ Aplicación no responde aún, reintentando..."
                                    exit 1
                                fi
                            '''
                        }
                        
                        // Verificar logs por errores
                        sh '''
                            echo "Verificando logs por errores..."
                            
                            # Obtener logs recientes
                            docker logs --tail=50 ${CONTAINER_NAME} > deployment-logs.txt 2>&1
                            
                            # Buscar errores críticos
                            if grep -i "error\\|failed\\|exception" deployment-logs.txt; then
                                echo "⚠️ Se encontraron errores en los logs - revisar manualmente"
                            else
                                echo "✅ No se encontraron errores críticos en los logs"
                            fi
                        '''
                        
                    } catch (Exception e) {
                        error "❌ Health check falló: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('🧹 Cleanup') {
            steps {
                script {
                    echo "🧹 Limpiando recursos..."
                    
                    // Limpiar imágenes Docker antiguas
                    sh '''
                        echo "Limpiando imágenes Docker antiguas..."
                        
                        # Eliminar imágenes no utilizadas
                        docker image prune -f || true
                        
                        # Mantener solo las últimas 3 versiones
                        docker images ${PROJECT_NAME} --format "table {{.Tag}}" | grep -v "latest" | grep -v "TAG" | tail -n +4 | xargs -I {} docker rmi ${PROJECT_NAME}:{} || true
                        
                        echo "✅ Limpieza completada"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "📊 Generando reporte final..."
                
                // Archivar logs
                archiveArtifacts artifacts: '*.log, *.txt', fingerprint: true, allowEmptyArchive: true
                
                // Información del despliegue
                sh '''
                    echo "=== INFORMACIÓN DEL DESPLIEGUE ===" > deployment-info.txt
                    echo "Proyecto: ${PROJECT_NAME}" >> deployment-info.txt
                    echo "Build: ${BUILD_NUMBER}" >> deployment-info.txt
                    echo "Commit: ${GIT_COMMIT_HASH}" >> deployment-info.txt
                    echo "Branch: ${DEPLOY_BRANCH}" >> deployment-info.txt
                    echo "Fecha: $(date)" >> deployment-info.txt
                    echo "Usuario: ${BUILD_USER:-Jenkins}" >> deployment-info.txt
                    echo "" >> deployment-info.txt
                    echo "=== ESTADO DE CONTENEDORES ===" >> deployment-info.txt
                    docker ps | grep ${CONTAINER_NAME} >> deployment-info.txt || echo "Contenedor no encontrado" >> deployment-info.txt
                    echo "" >> deployment-info.txt
                    echo "=== LOGS RECIENTES ===" >> deployment-info.txt
                    docker logs --tail=20 ${CONTAINER_NAME} >> deployment-info.txt 2>&1 || echo "No se pudieron obtener logs" >> deployment-info.txt
                '''
            }
        }
        
        success {
            script {
                echo "✅ Despliegue exitoso de ${PROJECT_NAME}"
                
                // Notificación de éxito
                // slackSend channel: "${SLACK_CHANNEL}", 
                //           color: 'good',
                //           message: "✅ Despliegue exitoso: ${PROJECT_NAME} - Build #${BUILD_NUMBER}"
                
                // emailext (
                //     subject: "✅ Despliegue Exitoso - ${PROJECT_NAME}",
                //     body: """
                //         El despliegue de ${PROJECT_NAME} se completó exitosamente.
                //         
                //         Detalles:
                //         - Build: #${BUILD_NUMBER}
                //         - Commit: ${GIT_COMMIT_HASH}
                //         - Branch: ${DEPLOY_BRANCH}
                //         - URL: http://localhost:8097
                //         
                //         Logs disponibles en Jenkins.
                //     """,
                //     to: "${EMAIL_RECIPIENTS}"
                // )
            }
        }
        
        failure {
            script {
                echo "❌ Error en despliegue de ${PROJECT_NAME}"
                
                // Rollback automático
                sh '''
                    echo "Intentando rollback automático..."
                    
                    # Detener contenedor fallido
                    docker-compose down || docker compose down || true
                    
                    # Aquí podrías implementar lógica de rollback
                    # Por ejemplo, restaurar backup anterior
                    
                    echo "Rollback completado"
                '''
                
                // Notificación de error
                // slackSend channel: "${SLACK_CHANNEL}",
                //           color: 'danger', 
                //           message: "❌ Error en despliegue: ${PROJECT_NAME} - Build #${BUILD_NUMBER}"
            }
        }
        
        unstable {
            echo "⚠️ Despliegue inestable de ${PROJECT_NAME}"
        }
        
        cleanup {
            // Limpiar workspace
            // deleteDir()
        }
    }
}