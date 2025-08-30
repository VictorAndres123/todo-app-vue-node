# To-Do List App

Esta es una aplicación de lista de tareas (To-Do List) simple pero completa, construida con un frontend moderno de Vue.js y un backend de Node.js con Express.

## Características

- **Frontend Reactivo:** Interfaz de usuario rápida y moderna construida con Vue.js 3.
- **Backend Robusto:** API RESTful construida con Node.js y Express para gestionar las tareas.
- **Funcionalidad CRUD Completa:** Crea, lee, actualiza y elimina tareas.
- **Diseño Limpio:** Interfaz de usuario limpia y fácil de usar.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)

## Instalación y Puesta en Marcha

Sigue estos pasos para tener el proyecto funcionando en tu máquina local.

### 1. Clona el Repositorio

```bash
git clone <URL-del-repositorio>
cd todo-app
```

### 2. Configuración del Backend

Navega a la carpeta del backend e instala las dependencias.

```bash
cd backend
npm install
```

Una vez instaladas las dependencias, puedes iniciar el servidor de desarrollo.

```bash
npm start
```

El backend se ejecutará en `http://localhost:3000`.

### 3. Configuración del Frontend

Abre una nueva terminal, navega a la carpeta del frontend e instala las dependencias.

```bash
cd ../frontend
npm install
```

Una vez instaladas las dependencias, puedes iniciar el cliente de desarrollo.

```bash
npm run dev
```

El frontend se ejecutará en `http://localhost:5173`.

## Scripts Disponibles

### Backend

- `npm start`: Inicia el servidor de Express.

### Frontend

- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Sirve la aplicación compilada localmente.
- `npm run lint`: Ejecuta el linter de ESLint.

## Estructura del Proyecto

```
todo-app/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── ...
└── frontend/
    ├── src/
    │   ├── App.vue
    │   ├── main.ts
    │   ├── components/
    │   ├── views/
    │   └── ...
    ├── package.json
    └── ...
```
