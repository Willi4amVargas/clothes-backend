# Clothes Store ERP - Backend

Este es el núcleo del sistema ERP para la gestión de una tienda de ropa. Desarrollado con una arquitectura moderna y robusta utilizando **Node.js**, **Express** y **TypeScript**.

El sistema está diseñado para manejar la lógica de negocio, autenticación segura y persistencia de datos para el control de inventario y ventas.

## 🚀 Tecnologías Principales

* **Runtime:** [Node.js](https://nodejs.org/) (v22+)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Framework:** [Express](https://expressjs.com/)
* **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
* **Validación:** [Zod](https://zod.dev/)
* **Seguridad (JWT):** [jose](https://github.com/panva/jose)

---

## 🛠️ Configuración del Proyecto

Sigue estos pasos para configurar el entorno de desarrollo local:

### 1. Instalación de dependencias
Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes necesarios:

```bash
npm install
```

### 2. Configuración de la Base de Datos
Es necesario preparar la estructura de **PostgreSQL** antes de iniciar el servidor.

1.  Asegúrate de tener una instancia de PostgreSQL corriendo.
2.  Ubica el archivo `db_schema.sql` en la raíz del proyecto.
3.  Ejecuta el script en tu base de datos para crear las tablas y relaciones iniciales:

```bash
psql -U tu_usuario -d tu_nombre_db -f db_schema.sql
```
*(También puedes copiar el contenido del archivo y ejecutarlo en herramientas como pgAdmin o DBeaver).*

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y define las variables necesarias (Base de datos, Puerto, JWT Secret, etc.). El proyecto ya está configurado para leer este archivo automáticamente.
Ademas existe el .env.example para que lo puedas copiar y pegar

---

## 🏗️ Scripts Disponibles

El proyecto utiliza scripts optimizados para cada etapa del desarrollo:

* **Modo Desarrollo:** Levanta el servidor con recarga automática ante cambios.
    ```bash
    npm run dev
    ```
* **Compilación:** Transpila el código TypeScript a JavaScript en la carpeta `/dist`.
    ```bash
    npm run build
    ```
* **Producción:** Ejecuta el código compilado (requiere haber ejecutado `build` previamente).
    ```bash
    npm run start
    ```

---

## 📂 Estructura del Proyecto

* `/src`: Código fuente del servidor.
* `db_schema.sql`: Definición de la estructura de la base de datos SQL.
* `.env`: Configuración sensible (no incluido en el repositorio).
* `.env.example`: Ejemplo del archivo de configuracion.
* `tsconfig.json`: Configuración de reglas de TypeScript.

---

## 🛡️ Estándares de Código
El proyecto utiliza **ESLint** con plugins de ordenamiento para mantener un código limpio y legible. Asegúrate de tener activa la extensión en tu editor para ver las sugerencias en tiempo real.