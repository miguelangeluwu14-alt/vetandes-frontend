# VetAndes Web — Angular 22

Proyecto frontend de **VetAndes**, adaptado de la arquitectura de la SPA de ejemplo `pharma-frontend` proporcionada por la estudiante. El dominio, los permisos y los endpoints están adaptados al **Examen Parcial II, versión B**.

## Requisitos

- Node.js **22.22.3 o posterior**, o 24.15 o posterior, compatible con Angular 22.2.
- Visual Studio Code y conexión a Internet para instalar las dependencias por primera vez.
- Backend `vetandes-backend` ejecutándose en `http://localhost:8080`, con Oracle y Flyway ya preparados.
- Cuenta de prueba configurada en el backend.

## Ejecutar en Visual Studio Code

1. Descomprime este ZIP. En VS Code selecciona **Archivo → Abrir carpeta** y abre la carpeta **vetandes-frontend** que contiene `package.json`.
2. Abre **Terminal → Nueva terminal**.
3. Ejecuta:

```bash
npm install
npm start
```

4. Abre **http://localhost:4200**. El servidor Java debe estar en ejecución.
5. Inicia sesión con las credenciales de desarrollo indicadas en el examen, si están configuradas en el backend: `admin`, `recepcion` o `veterinario`; la contraseña es la asignada en la semilla del backend. No utilices cuentas de prueba en producción.

## URL del backend

Editar `src/environments/environment.ts` y `src/environments/environment.development.ts` si cambian host/puerto:

```ts
export const environment = { apiUrl: 'http://localhost:8080/api/v1' };
```

**Nota:** el puerto Oracle `1522` y el esquema `VETANDES` corresponden a la configuración del **backend**. En el frontend no se escribe ninguna contraseña de Oracle, ni la clave JWT del servidor.

## Organización de carpetas

- `core/auth`: AuthService, sesión en signal + sessionStorage, expiración y login.
- `core/guards`: autenticación, invitado y protección por permiso de ruta.
- `core/interceptors`: Bearer para la API y manejo de 401 sin cerrar sesión ante 403.
- `core/config/menu.ts`: menú filtrado por permisos.
- `layout`: header, sidebar, contenido con `router-outlet`.
- `features/prestaciones`: CRUD, búsqueda, cambio de estado y confirmación.
- `features/mascotas`: CRUD dependiente de propietarios, filtro, edad calculada y validación.
- `features/atenciones`: registro cabecera-detalle con `FormArray`, buscadores, validaciones, estimaciones reactivas, confirmación, consulta por filtros, detalle y anulación.
- `features/reportes`: resumen por especie con fechas, datos de un endpoint JPQL agregado del backend.
- `shared`: directiva `appSiPermiso` y páginas 403/404.

## Cómo respeta el contrato REST

| Recurso | Acciones del frontend | Permisos |
|---|---|---|
| `/prestaciones` | GET, POST, PUT, PATCH estado, DELETE | `PRESTACION_LEER` / `PRESTACION_ESCRIBIR` |
| `/mascotas` | GET, POST, PUT, DELETE; propietarios por GET | `MASCOTA_LEER` / `MASCOTA_ESCRIBIR` |
| `/atenciones` | GET con filtros, GET por id, POST, PATCH anular | `ATENCION_LEER` / `ATENCION_REGISTRAR` / `ATENCION_ANULAR` |
| `/reportes/atenciones-por-especie` | GET con `desde` y `hasta` | `REPORTE_VER` |
| `/auth/login` | POST, entrega JWT con permisos | Público |

Los datos de las listas provienen **exclusivamente del backend**. No hay servicios simulados ni información inventada en el frontend.

### Seguridad

- El login está fuera del layout.
- El token se guarda en sessionStorage junto con `expiraEn` para tolerar F5 y cerrarse al vencer.
- Las peticiones a VetAndes API incluyen `Authorization: Bearer` desde un único interceptor.
- Respuesta 401 (excepto login): cerrar sesión y volver a login con returnUrl.
- Respuesta 403: mantener la sesión, mostrar mensaje; rutas no autorizadas muestran «Acceso denegado».
- Los controles de pantalla no son una garantía de seguridad: el backend debe responder 403 si el permiso falta.
- La clave JWT **nunca** debe incluirse en este proyecto.

### Cálculos de la atención

- La SPA muestra subtotal y total **estimados**, con 10 % de descuento si hay tres o más prestaciones distintas.
- La SPA envía únicamente `mascotaId`, `peso`, `diagnostico` y `detalles: [{prestacionId, cantidad}]`.
- Precios, subtotal, descuento y total definitivos son calculados y guardados **por el backend**.

## Pruebas manuales según la rúbrica

1. Como ADMIN, crear/editar prestaciones y mascotas, y probar errores 400, 404 y 409.
2. Crear una mascota con nombre duplicado para el mismo propietario: verificar que el mensaje de error 409 aparezca sin bloquear la lista.
3. Registrar una atención con 3 prestaciones distintas; comprobar descuento del 10 % y que el detalle guarde correctamente.
4. Intentar usar una prestación incompatible o inactiva: el backend debe rechazarla. La SPA conserva las líneas si recibe 409.
5. Registrar una atención con RECEPCIONISTA o ADMIN. Luego ingresar con VETERINARIO para comprobar que puede anularla si cumple las condiciones de la regla RN-05, pero no puede registrar nuevas atenciones.
6. Como VETERINARIO comprobar que «Nueva atención» no aparece y la ruta directa `/atenciones/nueva` muestra acceso denegado.
7. Como RECEPCIONISTA verificar que no hay reporte ni acción Anular, y que el backend responde 403 a intentos prohibidos.
8. Modificar `expiraEn` en sessionStorage a un instante pasado y pulsar F5: debe volver al login.
9. Comprobar el reporte por especie, con exclusión de atenciones anuladas.

## Verificaciones técnicas

- El proyecto se validó con el compilador Angular AOT (`ngc`, modo estricto) y el compilador TypeScript.
- La integración completa navegador ↔ API ↔ Oracle debe comprobarse en el entorno local de la estudiante.
- Este ZIP entrega **solo el código fuente**, sin `node_modules`, `.angular`, `dist` ni historial `.git`. Instala las dependencias con `npm install` y crea el repositorio Git propio exigido en el examen.
