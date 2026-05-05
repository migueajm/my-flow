import { expenseList, todayInputValue } from "../components/templates.js";
import { formatCurrency } from "../../shared/utils/formatters.js";

export function renderExpenses(state) {
  return `
    <section class="grid two">
      <article class="panel">
        <h2>Registrar gasto</h2>
        <form id="expense-form" class="form-grid">
          <label>
            Fecha
            <input name="date" type="date" value="${todayInputValue()}" required />
          </label>
          <label>
            Categoria
            <select name="categoryId" required>
              ${state.categories.map(category => `<option value="${category.id}">${category.icon} ${category.name}</option>`).join('')}
            </select>
          </label>
          <label>
            Monto
            <input name="amount" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Descripcion
            <input name="description" type="text" maxlength="90" placeholder="Supermercado" />
          </label>
          <div class="full">
            <button class="primary-button" type="submit">Agregar gasto</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <h2>Disponible del 80%</h2>
        <p style="font-size:2rem;font-weight:800;margin-bottom:8px">${formatCurrency(state.expenseRemaining)}</p>
        <div class="progress"><span style="--value:${Math.round(state.usagePercent * 100)}%"></span></div>
      </article>
    </section>

    <section class="table-card" style="margin-top:16px">
      <h2>Gastos del mes</h2>
      ${expenseList(state)}
    </section>
  `;
}
