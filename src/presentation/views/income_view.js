import { metricCard } from "../components/templates.js";

export function renderIncome(state) {
  return `
    <section class="grid two">
      <article class="panel">
        <h2>Gestion de ingresos</h2>
        <form id="income-form" class="form-grid">
          <label class="full">
            Salario mensual
            <input name="amount" type="number" min="0" step="0.01" placeholder="25000" required />
          </label>
          <div class="full">
            <button class="primary-button" type="submit">Guardar ingreso</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <h2>Regla automatica</h2>
        <p>Al guardar el ingreso, la aplicacion separa 80% para gastos y 20% para ahorro o inversion.</p>
      </article>
    </section>

    <section class="grid three" style="margin-top:16px">
      ${metricCard('Salario', state.salary)}
      ${metricCard('Gastos 80%', state.expenseBudget)}
      ${metricCard('Ahorro/Inversion 20%', state.savingsBudget)}
    </section>
  `;
}
