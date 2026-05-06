export function renderDataTools(state) {
  return `
    <section class="panel" style="margin-top:16px">
      <h2>${state.t('localData')}</h2>
      <p class="muted">${state.t('localDataHelp')}</p>
      <button id="clear-data" class="danger-button" type="button">${state.t('clearLocalData')}</button>
    </section>
  `;
}
