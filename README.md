# Gestión de Inversiones | Alpha Challenge

Gestión de Inversiones es una aplicación modular diseñada para gestionar productos financieros, inversiones, días no operativos y roles de usuarios. Este proyecto fue desarrollado como parte de un **challenge propuesto por la empresa Alpha**. Está construido utilizando Angular para el frontend, FastAPI para el backend, MySQL como base de datos y Docker para el despliegue.

**Autor:** *Ing. Martín Pérez*

## Requisitos

Para ejecutar este proyecto, necesitas tener **Docker** instalado en tu máquina. Consulta la documentación oficial de [Docker](https://www.docker.com/) para instalarlo.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto:

1. Clona el repositorio:

   ```bash
   git clone <https://github.com/J0sue06/alpha-challenge>

2. Construye las imágenes de Docker:

   ```bash
   docker-compose build

3. Inicia las aplicaciones:

    ```bash
    docker-compose up

4. Accede a las aplicaciones desde tu navegador:
    ```bash
    - Frontend: http://localhost:4201
    - Backend: Documentación de la API en http://localhost:8000/docs

## Datos de Acceso

- **Admin**:  
  Usuario: `admin1@admin1.com`  
  Clave: `1234567`

- **Usuario**:  
  Usuario: `user1@user1.com`  
  Clave: `1234567`

## Funcionalidades

- **Gestión de Usuarios**: Creación y administración de usuarios con contraseñas seguras.
- **Gestión de Roles**: Creación y administración de roles.
- **Productos Financieros**: Configuración de horarios operativos y reglas de reinversión.
- **Inversiones**: Seguimiento de plazos, fechas de inicio/fin y reinversiones.
- **Días No Operativos**: Administración de días en los que no se pueden realizar operaciones financieras.
- **Despliegue con Docker**: Configuración y ejecución rápida mediante contenedores.

## Detalles Técnicos

### Tecnologías Utilizadas

- **Frontend**: Angular 18
- **Backend**: Python 3.13 con FastAPI y SQLAlchemy
- **Base de Datos**: MySQL
- **Contenedores**: Docker