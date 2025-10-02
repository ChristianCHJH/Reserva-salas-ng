# Reservas de Salas (Angular)

Proyecto Angular para gestionar reservas de salas. Incluye UI con PrimeNG/FullCalendar, pruebas unitarias con Jest y pipelines de CI listos para usar.

## Requisitos
- Node.js 20.x (recomendado LTS)
- npm 9+
- Angular CLI (opcional, ya hay scripts npm): `npm i -g @angular/cli`

## Instalación
```
npm ci
# o, si no tienes lock actualizado
npm install
```

## Ejecutar en desarrollo
```
npm start
```
- Servirá en `http://localhost:4200`.
- Las llamadas a API van a `/api/*` y se redirigen (proxy) al backend según `proxy.conf.json`.
  - Por defecto: `http://localhost:3006` (puedes cambiar `target`).
- Endpoints esperados por la app:
  - GET/POST `/reservas`
  - GET `/salas`

## Pruebas (Jest)
- Ejecutar todas:
```
npm test
```
- Modo watch:
```
npm run test:watch
```
- Para CI (genera junit.xml):
```
npm run test:ci
```

## Build de producción
```
npm run build
```
Los artefactos se generan en `dist/reservas-salas_ng`.

## CI/CD
- GitHub Actions (CI simple): `.github/workflows/ci.yml`
  - `npm ci` → `npm run test:ci` → `npm run build` → sube artefacto `dist/`.
- Jenkins (CD opcional): `Jenkinsfile`
  - Etapa Build & Test (Node 20): `npm ci`, `npm run test:ci`, `npm run build`.
  - Sin Docker: pipeline simple de build + tests y archivo `dist/` como artefacto.

## Variables de entorno (tests/CI)
- Pruebas unitarias (Jest): no requieren variables obligatorias.
  - Opcional (reportes JUnit): `JEST_JUNIT_OUTPUT=junit.xml` para cambiar la ruta del reporte.
- Desarrollo (sin variables):
  - Edita `proxy.conf.json` → `target` del backend.

## Configuración útil
- Aliases de imports (TypeScript):
  - `@core/*` → `src/app/core/*`
  - `@features/*` → `src/app/features/*`
- API base (desarrollo): `src/environments/environment.ts` → `apiBaseUrl: '/api'`.
- Proxy (desarrollo): `proxy.conf.json` → cambia `target` al host/puerto de tu backend.

## Notas
- El proyecto usa PrimeNG y FullCalendar. Los estilos base están en `src/styles.scss`.
- Si modificas el tamaño del bundle, los budgets de producción están configurados en `angular.json` para permitir la compilación.

---
Cualquier duda o mejora que quieras automatizar (lint, cobertura, deploy estático, etc.), la podemos agregar sobre esta base.
