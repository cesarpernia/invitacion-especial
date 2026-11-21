# Invitación especial — aventura contigo

Una web estática en español: bienvenida, invitación con mapa, cuatro preguntas Sí/No y final con gatitos.

**Sin backend, sin base de datos, sin Node, sin instalaciones y sin dependencias de JavaScript.** Basta con servir estos archivos en GitHub Pages.

## Vista previa

Abre `index.html` con doble clic en Chrome. También funciona en GitHub Pages.

## Cambiar textos y fotos

Abre `config.js`: ahí se editan la bienvenida, las líneas de la invitación (`invitacionLineas`), las cuatro preguntas, los subtítulos, los mensajes del botón «No», las rutas de los GIF y el texto de celebración. `style.css` contiene todo el diseño visual.

- El mapa se encuentra en `assets/mapa.png` **exactamente como se adjuntó**, con su transparencia original.
- Los GIF se copiaron sin cambiar su animación. El único nombre normalizado es `1,1.gif` → `1.1.gif`.
- Q1: `1.gif` + `1.1.gif`
- Q2: `2.gif` + `2.1.gif`
- Q3: `3.gif` + `3.1.gif`
- Q4: `4.gif`
- Final: `5.gif` + `5.2.gif` + `5.1.gif`

## Publicar en GitHub Pages

1. Abre el repositorio de GitHub que uses para la invitación.
2. Ve a **Add file → Upload files**.
3. **Descomprime el ZIP** y arrastra los **archivos de su interior** a GitHub, junto con la carpeta `assets`. Los archivos `index.html`, `config.js`, `script.js` y `style.css` deben quedar directamente en la raíz (no dentro de otra carpeta).
4. Confirma con **Commit changes**. Si tu repositorio ya tiene Pages activado, la web se actualiza automáticamente.
5. Si no tienes Pages: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

No hace falta eliminar las carpetas de imágenes antiguas del repo; quedarán sin uso. Se recomienda eliminarlas después de comprobar que la nueva web funciona.

## Créditos

Adaptación visual y de flujo realizada para esta invitación, tomando como punto de partida la idea y la mecánica pública de la plantilla [aditisins/be-my-valentine](https://github.com/aditisins/be-my-valentine), publicada bajo MIT. Los GIF y el mapa fueron proporcionados por la persona usuaria. Ornamentación SVG original incluida para aproximar la referencia visual.
