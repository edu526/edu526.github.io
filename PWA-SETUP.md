# 📱 Cómo hacer tu web instalable (PWA)

## ✅ Archivos creados

He configurado tu sitio web como Progressive Web App (PWA). Se crearon:

### Archivos de configuración
- ✅ `manifest.json` - Para cada aplicación
- ✅ `sw.js` - Service Worker para cada aplicación
- ✅ Carpetas de iconos (`/icons/`, `/calculadora-sublimacion/icons/`, `/piano/icons/`)
- ✅ Script generador de iconos (`generate_icons.py`)

### Archivos modificados
- ✅ Todos los `index.html` actualizados con meta tags PWA

## 📋 Pasos siguientes

### 1. Generar los iconos

Ejecuta en la terminal:
```bash
python generate_icons.py
```

Esto creará iconos simples para cada aplicación. Si quieres iconos personalizados, consulta `/icons/README.md`.

### 2. Probar en local

Sirve la aplicación con HTTPS o desde GitHub Pages:

**Opción A: GitHub Pages (recomendado)**
- Sube los cambios a GitHub
- Activa GitHub Pages en la configuración del repositorio
- Visita tu sitio: `https://tu-usuario.github.io/`

**Opción B: Servidor local con HTTPS**
```bash
# Instalar http-server si no lo tienes
npm install -g http-server

# Servir con SSL
http-server -S -C cert.pem -K key.pem
```

### 3. Instalar en el celular

1. **Android (Chrome/Edge/Samsung Internet)**
   - Abre tu sitio web
   - En el menú ⋮, selecciona "Agregar a pantalla de inicio" o "Instalar app"
   - Confirma la instalación

2. **iPhone/iPad (Safari)**
   - Abre tu sitio web
   - Toca el botón de compartir 📤
   - Selecciona "Agregar a inicio"
   - Confirma

3. **Desktop (Chrome/Edge)**
   - Abre tu sitio
   - Verás un ícono de instalación (+) en la barra de direcciones
   - Haz clic e instala

## 🔍 Verificar que funciona

### Herramientas de desarrollo
En Chrome/Edge:
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Revisa:
   - **Manifest**: Debe aparecer sin errores
   - **Service Workers**: Debe estar registrado y activo

### Lighthouse
1. DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Genera el reporte
4. Debe obtener puntuación alta (90+)

## 📝 Características PWA implementadas

✅ **Instalable**: Se puede agregar a la pantalla de inicio
✅ **Funciona offline**: Gracias al Service Worker
✅ **Modo standalone**: Se abre sin la barra del navegador
✅ **Iconos**: Para todas las plataformas
✅ **Meta tags**: Theme color y descripción

## 🎯 Estrategias de caché

- **Sitio principal**: Network First (siempre contenido fresco)
- **Calculadora**: Cache First (funciona offline completamente)
- **Piano**: Network First para archivos locales, Cache para CDN

## 🚀 Mejoras futuras (opcionales)

- [ ] Notificaciones push
- [ ] Sincronización en segundo plano
- [ ] Compartir contenido nativo
- [ ] Reconocimiento de gestos de instalación
- [ ] Pantalla de bienvenida personalizada

## 🐛 Solución de problemas

**No aparece el prompt de instalación:**
- Verifica que estés usando HTTPS
- Revisa la consola del navegador por errores
- Asegúrate de tener todos los iconos

**Service Worker no se registra:**
- Revisa las rutas en los archivos HTML
- Verifica que `sw.js` esté accesible
- Limpia la caché del navegador

**Los cambios no se ven:**
- El Service Worker cachea los archivos
- Desregistra el SW en DevTools o incrementa el CACHE_NAME en sw.js
