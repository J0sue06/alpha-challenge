# API | Alpha Challenge

Esta API ha sido desarrollada en **Python** utilizando el framework **FastAPI**. Proporciona funcionalidades para la gestión de usuarios, productos financieros, inversiones, y días no operativos, con soporte para despliegue mediante Docker.

## Paquetes Utilizados

La API utiliza varios paquetes de Python para garantizar su funcionalidad y eficiencia. A continuación, se incluye una lista de los paquetes más relevantes:

- `alembic==1.14.0` - Manejo de migraciones de base de datos.
- `fastapi==0.115.5` - Framework principal para el desarrollo de la API.
- `uvicorn==0.32.1` - Servidor ASGI para ejecutar la aplicación.
- `SQLAlchemy==2.0.36` - ORM utilizado para interactuar con la base de datos MySQL.
- `python-dotenv==1.0.1` - Manejo de variables de entorno.
- `python-multipart==0.0.17` - Soporte para datos multipart/form.
- `bcrypt==4.2.1` - Hashing seguro de contraseñas.
- `python-jose==3.3.0` - Soporte para JSON Web Tokens (JWT).
- `pydantic==2.10.0` - Validación y manejo de datos basados en esquemas.

### Dependencias Adicionales

- `anyio==4.6.2.post1` - Soporte para entrada/salida asincrónica.
- `cryptography==43.0.3` - Funcionalidades de seguridad criptográfica.
- `PyMySQL==1.1.1` - Conector de base de datos MySQL.
- `rsa==4.9`, `ecdsa==0.19.0`, `cffi==1.17.1` - Herramientas para criptografía.
- `MarkupSafe==3.0.2`, `Mako==1.3.6` - Soporte para plantillas dinámicas.

### Requisitos de Instalación

Se debe tener **Docker** instalado para ejecutar la aplicación en contenedores. Si deseas ejecutar la API de forma local, asegúrate de tener **Python 3.13** y utilizar un entorno virtual para instalar las dependencias. 

Ejemplo de instalación local:  

```bash
# Crear un entorno virtual
python3 -m venv venv

# Activar el entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar las dependencias
pip install -r requirements.txt
