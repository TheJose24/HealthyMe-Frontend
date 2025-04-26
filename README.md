# HealthyMe - Frontend

## Descripción General
**HealthyMe Frontend** es la aplicación web desarrollada en Angular 17 para la gestión integral de clínicas médicas. Este proyecto ofrece una interfaz moderna, rápida y adaptable, que permite a pacientes, médicos y administradores interactuar de manera eficiente con los servicios ofrecidos por **HealthyMe Backend**.

Esta plataforma está diseñada como parte del curso de "Desarrollo Web Integrado" de la Universidad Tecnológica del Perú, enfocándose en una arquitectura escalable y una experiencia de usuario optimizada.

## Arquitectura del Frontend
HealthyMe Frontend está diseñado para consumir los microservicios del backend de forma modular, organizando la estructura en función de cada dominio funcional:

```plaintext
src/
├── app/
│   ├── core/           # Módulos y servicios centrales (auth, interceptores, guards)
│   ├── shared/         # Componentes, pipes, y servicios reutilizables
│   ├── features/       # Módulos de funcionalidades específicas
│   │   ├── auth/               # Autenticación y gestión de usuarios
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   ├── services/
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── personal/            # Gestión de personal médico y administrativo
│   │   │   ├── doctors/
│   │   │   ├── nurses/
│   │   │   ├── technicians/
│   │   │   ├── services/
│   │   │   └── personal.routes.ts
│   │   │
│   │   ├── pacientes/           # Gestión de pacientes
│   │   │   ├── create/
│   │   │   ├── edit/
│   │   │   ├── list/
│   │   │   ├── services/
│   │   │   └── pacientes.routes.ts
│   │   │
│   │   ├── citas/               # Programación y gestión de citas médicas
│   │   │   ├── schedule/
│   │   │   ├── reschedule/
│   │   │   ├── cancel/
│   │   │   ├── services/
│   │   │   └── citas.routes.ts
│   │   │
│   │   ├── consultas/           # Control de consultas médicas
│   │   │   ├── diagnostics/
│   │   │   ├── prescriptions/
│   │   │   ├── services/
│   │   │   └── consultas.routes.ts
│   │   │
│   │   ├── laboratorio/         # Gestión de exámenes y resultados
│   │   │   ├── tests/
│   │   │   ├── results/
│   │   │   ├── services/
│   │   │   └── laboratorio.routes.ts
│   │   │
│   │   ├── infraestructura/     # Sedes, consultorios, áreas físicas
│   │   │   ├── clinics/
│   │   │   ├── rooms/
│   │   │   ├── services/
│   │   │   └── infraestructura.routes.ts
│   │   │
│   │   ├── pagos/               # Pagos, facturación y gestión de seguros
│   │   │   ├── invoices/
│   │   │   ├── payments/
│   │   │   ├── services/
│   │   │   └── pagos.routes.ts
│   │   │
│   │   └── notificaciones/      # Notificaciones a usuarios
│   │       ├── alerts/
│   │       ├── messages/
│   │       ├── services/
│   │       └── notificaciones.routes.ts
│   ├── layout/         # Componentes de estructura (navbar, sidebar, footer)
│   └── app.routes.ts   # Definición de rutas principales
├── assets/             # Recursos estáticos (imágenes, íconos, fuentes)
└── environments/       # Configuración de entornos (development, production)
```
📌 Cada módulo funcional dentro de `features/` contara con: 
- Componentes
- Servicios
- Interfaces
- Rutas internas (Lazy loading)

📌 Cada carpeta `services/` contara con:
- Servicios para la comunicación con el backend (HttpClient)
- Modelos e interfaces para los datos (`models/`)
- Interceptores (`interceptors/`) para manejar peticiones y respuestas HTTP
- Pipes (`pipes/`) para transformar datos en las vistas

📌 Cada `*.routes.ts` define:
- Las rutas de Angular propias de ese módulo
- Lazy loading para cargar módulos solo cuando son necesarios
- Guards para proteger rutas específicas (ej. autenticación, roles)

Por ejemplo, para `pacientes/`:
```plaintext
pacientes/
├── create/
│   └── create-paciente.component.ts
├── edit/
│   └── edit-paciente.component.ts
├── list/
│   └── list-pacientes.component.ts
├── services/
│   ├── pacientes.service.ts
│   └── pacientes.model.ts
└── pacientes.routes.ts
```

## Tecnologías Utilizadas
- Angular 17: Framework principal de frontend
- TailwindCSS 3: Framework de utilidades para estilos
- RxJS: Programación reactiva
- Husky: Control de calidad en los commits
- Lint-Staged: Lint automático de archivos staged
- Commitlint: Validación de mensajes de commit
- Prettier: Formateo de código
- ESLint: Linter de código
- Webpack Bundle Analyzer: Análisis del tamaño del bundle
- TypeScript 5: Lenguaje principal de desarrollo

## Requisitos Previos
- Node.js v20+
- npm v10+
- Angular CLI v17.3.0+
- Git

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/TheJose24/HealthyMe-Frontend.git
cd HealthyMe-Frontend
```
### 2. Instalar Dependencias

```bash
npm install
```
### 3. Configurar Variables de Entorno
El proyecto utilizará archivos de entorno en src/environments/ para definir las URLs de los microservicios.
Ejemplo `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // API Gateway Backend
};
```
### 4. Levantar el Proyecto

```bash
ng serve -o
```
Esto iniciará el servidor de desarrollo y abrirá la aplicación en tu navegador predeterminado.

## Herramientas de Calidad de Código y Convenciones

Este proyecto utiliza varias herramientas de calidad de código que se ejecutan automáticamente durante el desarrollo.

### Husky

**Husky** asegura que todo el código subido pase verificaciones:

- **pre-commit:** ejecuta Lint-Staged.
- **commit-msg:** valida mensajes de commit con Commitlint.

### Lint-Staged

Lint-Staged verifica los archivos en staging:
```typescript
{
  "*.ts": ["prettier --write", "eslint"],
  "*.html": ["eslint", "prettier --write"],
  "*.css": "prettier --write"
}
```

### ESLint y Prettier

**ESLint** y **Prettier** ayudan a mantener un estilo y estructura de código consistentes.

- **ESLint** se configura para forzar buenas prácticas de desarrollo en TypeScript y Angular.
- **Prettier** se encarga de formatear el código automáticamente, siguiendo las reglas definidas en `.prettierrc`.


### Commitlint

**Commitlint** asegura que todos los mensajes de commit sigan el formato establecido.

#### Ejemplo de Mensaje de Commit
Los mensajes de commit deben seguir el siguiente formato

```plaintext
tipo(<módulo>): título descriptivo en minúsculas y sin punto final

- Cuerpo del commit con detalles del cambio.
- Detalle 1
- Detalle 2
- Etc.
```
feat(auth): implementar sistema de registro con verificación de email

- Añadido formulario de registro con validación
- Integración con servicio de envío de emails
- Creada página de confirmación de registro
```plaintext

```plaintext
fix(citas): corregir conflicto en la programación simultánea de horarios

- Añadida validación en tiempo real para evitar solapamientos
- Implementado bloqueo temporal durante la confirmación
```

```plaintext
refactor(pacientes): reorganizar estructura de componentes del perfil

- Separados componentes en archivos individuales
- Implementado patrón presentación/container
- Mejorado rendimiento con carga perezosa
```

#### Tipos de Commits:

- **feat:** Añadir una nueva funcionalidad.
- **fix:** Corregir un error.
- **docs:** Documentación relacionada.
- **style:** Cambios que no afectan la lógica (espacios, formato, punto y coma, etc.)
- **refactor:** Cambios en el código que no corrigen errores ni añaden funcionalidades.
- **test:** Añadir pruebas faltantes o corregir pruebas existentes.
- **chore:** Cambios menores que no afectan el código de la aplicación.

### Estructura de Ramas
- **`master`**: Código en producción estable
- **`develop`**: Rama de integración continua
- **`feature/*`**: Nuevas funcionalidades o mejoras
- **`fix/*`**: Corrección de errores

### Convención para Nombrar Ramas
```plaintext
feature/[módulo]-[descripción-breve]
```

Ejemplos:
- `feature/auth-login`
- `feature/pacientes-registro`
- `feature/citas-validacion`

## Flujo de Trabajo

1. **Crear una Rama para el Cambio:** Crea una nueva rama para cada tarea o cambio a parti de `develop`:

```bash
git checkout -b nombre-de-la-rama
```

2. **Desarrollar Funcionalidad:** Realiza los cambios en el código siguiendo las convenciones y ejecutando comandos de linting y pruebas localmente.

3. **Validar Código:** Antes de hacer commit, asegúrate de que el código pase las verificaciones de ESLint y Prettier:

```bash
npm run format
npm run lint
```

4. **Hacer Commit:** Escribe un mensaje de commit claro y conciso, siguiendo las convenciones establecidas. Al hacer commit, `Husky` y `Lint-Staged` ejecutarán automáticamente los linters configurados.

```bash
git add .
git commit -m "feat(ui): agregar formulario de contacto

- Se agregó un nuevo formulario de contacto en la página principal.
- Se mejoró la validación de campos."
```

5. **Enviar los Cambios:** Cuando todo esté en orden, sube la rama y abre un Pull Request (PR) para revisión.

```bash
git push -u origin nombre-de-la-rama
```

>[!IMPORTANT]
>Cuando abras un Pull Request, recuerda asignarme a mí para la revisión.

## Scripts Útiles

- **Iniciar Servidor:** npm start
- **Compilar en modo desarrollo:** npm run build
- **Compilar en modo producción:** npm run build:prod
- **Ejecutar ESLint:** npm run lint
- **Formatea el código usando Prettier:** npm run format
- **Ejecutar pruebas unitarias:** npm run test
- **Análisis de Bundle:** npm run analyze