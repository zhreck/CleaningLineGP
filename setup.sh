#!/bin/bash

# 🚀 Shopping E-commerce - Script de Instalación Automatizada
# Este script configura todo el entorno de desarrollo automáticamente

set -e  # Salir si hay algún error

echo "🛒 Shopping E-commerce - Instalación Automatizada"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerequisitos
check_prerequisites() {
    print_status "Verificando prerequisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js v18+ desde https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js v18+ es requerido. Versión actual: $(node --version)"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado."
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker Desktop desde https://www.docker.com/products/docker-desktop/"
        exit 1
    fi
    
    # Verificar que Docker esté corriendo
    if ! docker info &> /dev/null; then
        print_error "Docker no está corriendo. Por favor inicia Docker Desktop."
        exit 1
    fi
    
    print_success "Todos los prerequisitos están instalados ✅"
}

# Configurar variables de entorno
setup_env_files() {
    print_status "Configurando variables de entorno..."
    
    # Backend
    if [ ! -f "app/api/.env" ]; then
        cp app/api/.env.example app/api/.env
        print_success "Archivo app/api/.env creado desde .env.example"
    else
        print_warning "app/api/.env ya existe, no se sobrescribirá"
    fi
    
    # Frontend
    if [ ! -f "web/.env.local" ]; then
        cp web/.env.example web/.env.local
        print_success "Archivo web/.env.local creado desde .env.example"
    else
        print_warning "web/.env.local ya existe, no se sobrescribirá"
    fi
}

# Levantar servicios de infraestructura
start_infrastructure() {
    print_status "Levantando servicios de infraestructura con Docker..."
    
    docker-compose up -d
    
    print_status "Esperando que los servicios estén listos..."
    sleep 10
    
    # Verificar que los servicios estén corriendo
    if docker ps | grep -q postgres && docker ps | grep -q redis && docker ps | grep -q meilisearch && docker ps | grep -q minio; then
        print_success "Servicios de infraestructura iniciados correctamente ✅"
    else
        print_error "Algunos servicios no se iniciaron correctamente"
        docker ps
        exit 1
    fi
}

# Instalar dependencias del backend
setup_backend() {
    print_status "Configurando backend..."
    
    cd app/api
    
    print_status "Instalando dependencias del backend..."
    npm install
    
    print_status "Compilando backend..."
    npm run build
    
    print_status "Poblando base de datos con datos de prueba..."
    npm run seed
    
    cd ../..
    
    print_success "Backend configurado correctamente ✅"
}

# Instalar dependencias del frontend
setup_frontend() {
    print_status "Configurando frontend..."
    
    cd web
    
    print_status "Instalando dependencias del frontend..."
    npm install
    
    cd ..
    
    print_success "Frontend configurado correctamente ✅"
}

# Configurar SigNoz (opcional)
setup_signoz() {
    read -p "¿Deseas instalar SigNoz para observabilidad? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Configurando SigNoz..."
        
        if [ ! -d "signoz-deploy" ]; then
            git clone https://github.com/SigNoz/signoz.git signoz-deploy
        fi
        
        cd signoz-deploy/deploy/docker
        docker compose up -d
        cd ../../..
        
        print_success "SigNoz configurado. Accede en http://localhost:8080"
    else
        print_warning "SigNoz no será instalado. Puedes instalarlo manualmente más tarde."
    fi
}

# Mostrar información final
show_final_info() {
    echo
    echo "🎉 ¡Instalación completada exitosamente!"
    echo "========================================"
    echo
    echo "Para iniciar la aplicación:"
    echo
    echo "1. Backend (Terminal 1):"
    echo "   cd app/api"
    echo "   npm run start:otel"
    echo
    echo "2. Frontend (Terminal 2):"
    echo "   cd web"
    echo "   npm run dev"
    echo
    echo "URLs de acceso:"
    echo "- Frontend:     http://localhost:3000"
    echo "- Backend API:  http://localhost:3002"
    echo "- Swagger Docs: http://localhost:3002/api/docs"
    echo "- SigNoz:       http://localhost:8080 (si fue instalado)"
    echo "- MinIO:        http://localhost:9001 (admin/adminadmin)"
    echo
    echo "Para más información, consulta DEPLOYMENT-GUIDE.md"
    echo
}

# Función principal
main() {
    check_prerequisites
    setup_env_files
    start_infrastructure
    setup_backend
    setup_frontend
    setup_signoz
    show_final_info
}

# Ejecutar función principal
main "$@"