# Recomendaciones Agrónomas

Este proyecto tiene como objetivo desarrollar un sistema de recomendaciones basado en técnicas de Machine Learning para optimizar las decisiones agronómicas. Está pensado para mejorar la productividad agrícola mediante análisis de datos y la implementación de algoritmos predictivos.

## Estructura del Proyecto

El proyecto está dividido en las siguientes carpetas:

- **api/**: Contiene todo el backend del proyecto, el cual fue desarrollado utilizando Django para gestionar la API que interactúa con los datos agrícolas y las recomendaciones generadas.
- **datasets/**: Incluye los datasets con los que se entrena y evalúan los modelos de Machine Learning.
- **models/**: Almacena los modelos entrenados que generan las predicciones y recomendaciones agronómicas.

## Tecnologías Utilizadas

- **Backend**: Django (Framework de desarrollo web en Python).
- **Base de Datos**: MySQL.
- **Machine Learning**: Scikit-learn, Pandas, NumPy.
- **Servidor Local**: XAMPP (para la base de datos).

## Instalación y Configuración

### Requisitos Previos

1. Tener instalado Python 3.8 o superior.
2. Tener instalado MySQL y configurado un servidor local (por ejemplo, utilizando XAMPP).
3. Instalar los paquetes requeridos:

```bash
pip install -r requirements.txt
```

### Configuración del Entorno

1. Clonar el repositorio:

```bash
git clone https://github.com/tokien736/recomendaciones-agronomas.git
```

2. Navegar a la carpeta del proyecto:

```bash
cd recomendaciones-agronomas
```

3. Configurar la base de datos en el archivo `settings.py` en la sección de `DATABASES` para conectar el proyecto a tu base de datos MySQL local.

4. Realizar las migraciones de la base de datos:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Ejecutar el servidor local de desarrollo:

```bash
python manage.py runserver
```

### Uso

Este sistema permite hacer consultas y obtener recomendaciones basadas en datos agronómicos a través de la API proporcionada. Los endpoints principales incluyen:

- **/recommendations**: Genera recomendaciones basadas en los datos ingresados.
- **/datasets**: Proporciona acceso a los datasets para análisis manual.
- **/models**: Muestra los modelos de Machine Learning entrenados.

## Contribuir

Si deseas contribuir a este proyecto, sigue los siguientes pasos:

1. Realiza un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-característica`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva característica'`).
4. Envía tus cambios a tu repositorio (`git push origin feature/nueva-característica`).
5. Abre un Pull Request en GitHub.

## Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo LICENSE para más detalles.

## Contacto

Si tienes preguntas o sugerencias sobre el proyecto, no dudes en contactar al equipo a través del repositorio.

