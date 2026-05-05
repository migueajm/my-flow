export function renderDataTools() {
  return `
    <section class="panel" style="margin-top:16px">
      <h2>Datos locales</h2>
      <p class="muted">La informacion se guarda en LocalStorage con el namespace de la aplicacion.</p>
      <button id="clear-data" class="danger-button" type="button">Borrar datos locales</button>
    </section>
  `;
}
