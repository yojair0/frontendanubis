# Frontend Anubis - Sistema de Adopciones

Frontend React para gestión de adopciones de animales.

## Instalación

```bash
npm install
npm start
```

La aplicación se ejecuta en `http://localhost:3000`

## Configuración

- Backend: `http://localhost:8081/api`
- Asegúrate de que el backend esté ejecutándose

## Funcionalidades

- Registro de cuenta con verificación por email
- Login/Logout con JWT tokens
- Crear postulaciones de adopción
- Ver postulaciones y su estado

## Proceso de uso

1. Registro con nombre, email, contraseña, teléfono y rol
2. Verificación con código de 6 dígitos por email
3. Login con credenciales
4. Crear y gestionar postulaciones

## Estructura

```
src/
├── components/
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── VerificationForm.js
│   ├── ApplicationForm.js
│   ├── ApplicationsList.js
│   └── Navigation.js
├── contexts/
│   └── AuthContext.js
├── services/
│   ├── api.js
│   ├── authService.js
│   └── applicationService.js
└── App.js
```

## Estados de postulación

- PENDING: Pendiente
- ACCEPTED: Aceptada
- REJECTED: Rechazada

## Campos de postulación

- Nombre del animal
- Tipo (Perro, Gato, Otro)
- Motivación
- Experiencia
- Vivienda
- Disponibilidad
