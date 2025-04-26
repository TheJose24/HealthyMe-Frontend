module.exports = {
   extends: ['@commitlint/config-conventional'],
   rules: {
     'scope-case': [2, 'always', 'lower-case'], // Asegura que el alcance esté en minúsculas
     'scope-empty': [2, 'never'], // No permite alcances vacíos
     'scope-enum': [
       2,
       'always',
       [
        'auth',            // Autenticación y gestión de usuarios
        'personal',        // Gestión de personal médico y administrativo
        'pacientes',       // Gestión de pacientes
        'citas',           // Programación y gestión de citas médicas
        'consultas',       // Control de consultas médicas
        'laboratorio',     // Gestión de exámenes y resultados
        'infraestructura', // Sedes, consultorios, áreas físicas
        'pagos',           // Pagos, facturación y gestión de seguros
        'notificaciones',  // Notificaciones a usuarios
        'core',            // Funcionalidades centrales del sistema
       ],
     ],
     'type-enum': [
       2,
       'always',
       [
         'feat', // Nueva funcionalidad
         'fix', // Corrección de errores
         'docs', // Cambios en la documentación
         'style', // Cambios en el estilo
         'refactor', // Cambios en el código que no corrigen errores ni añaden funcionalidades
         'test', // Añadir pruebas
         'chore', // Tareas de mantenimiento
       ],
     ],
     'type-case': [2, 'always', 'lower-case'], // Asegura que el tipo esté en minúsculas
     'type-empty': [2, 'never'], // No permite tipos vacíos
     'body-leading-blank': [2, 'always'], // Requiere una línea en blanco antes del cuerpo
     'body-max-line-length': [2, 'always', 120], // Limita el cuerpo a 100 caracteres
     'header-max-length': [2, 'always', 100], // Limita el encabezado a 100 caracteres
     'subject-empty': [2, 'never'], // No permite encabezados vacíos
     'subject-case': [2, 'always', 'lower-case'], // Asegura que el encabezado esté en minúsculas
     'subject-full-stop': [2, 'never', '.'], // No permite punto final en el asunto
     'body-empty': [2, 'never'], // No permite cuerpos vacíos
   },
 };