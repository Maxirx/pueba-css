# Constancia Libre de Deuda - Auth0 + Netlify

Aplicación para generar constancias de libre de deuda con autenticación Auth0.

## 🔧 Configuración de Auth0 en Netlify

### Paso 1: Preparar Auth0

1. Ve a tu dashboard de [Auth0](https://auth0.com)
2. En **Applications** → **Settings**, añade los Allowed Callback URLs:
   - `http://localhost:8000` (desarrollo)
   - `https://tu-sitio.netlify.app` (producción)
   - `https://tu-sitio.netlify.app/` (con slash)

3. Copia tus credenciales:
   - Domain: `dev-pjzj6vk78rt6brrh.us.auth0.com`
   - Client ID: `zjWCYwyGS2c5aXg7VNZxQp8AIb8hhOFo`

### Paso 2: Desplegar en Netlify

#### Opción A: Usando Netlify UI (Recomendado)

1. **Conectar repositorio:**
   - Ve a [Netlify](https://app.netlify.com)
   - "Add new site" → "Import an existing project"
   - Conecta tu repo de GitHub

2. **Configurar variables de entorno:**
   - En "Site settings" → "Build & deploy" → "Environment"
   - Añade las variables:
     ```
     VITE_AUTH0_DOMAIN = dev-pjzj6vk78rt6brrh.us.auth0.com
     VITE_AUTH0_CLIENT_ID = zjWCYwyGS2c5aXg7VNZxQp8AIb8hhOFo
     ```

3. **Deploy automático:**
   - El sitio se desplegará automáticamente desde main

#### Opción B: Usando Netlify CLI

```bash
# Instalar CLI
npm install -g netlify-cli

# Autenticar
netlify login

# Desplegar
netlify deploy --prod

# Ver variables de sitio
netlify env:list
```

### Paso 3: Actualizar Auth0 con URL de Netlify

1. Después del primer deploy, obtén tu URL de Netlify (ej: `https://mi-app-123.netlify.app`)
2. Ve a Auth0 → Applications → Settings
3. Actualiza "Allowed Callback URLs":
   ```
   https://mi-app-123.netlify.app
   https://mi-app-123.netlify.app/
   ```

### Paso 4: Testing

1. Visita `https://tu-sitio.netlify.app`
2. Haz clic en "Ingresar"
3. Deberías ser redirigido a Auth0
4. Después de loguearte, vuelves a tu app

## 📝 Variables de Entorno

Copia `.env.example` a `.env` para desarrollo local:

```bash
cp .env.example .env
```

El archivo `.env` es ignorado por git.

## 🚀 Desarrollo Local

```bash
# Instalar dependencias (si las hay)
npm install

# Iniciar servidor local
python -m http.server 8000
# O con Node.js:
npx http-server
```

Luego abre `http://localhost:8000`

## 🔒 Seguridad

- ✅ Credenciales Auth0 seguras en variables de entorno
- ✅ Redirect URI dinámico según el ambiente
- ✅ Cliente SPA (sin backend expuesto)
- ✅ Tokens almacenados en localStorage con Auth0 SDK

## 📚 Recursos

- [Auth0 SPA SDK](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-native-apps)
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## 🐛 Troubleshooting

### Error: "Callback URL not configured"
→ Verifica que el URL actual esté en Auth0 Settings → Allowed Callback URLs

### Error: "Invalid client"
→ Comprueba que VITE_AUTH0_CLIENT_ID sea correcto

### No aparece login después del deploy
→ Borra caché del navegador y vuelve a intentar
