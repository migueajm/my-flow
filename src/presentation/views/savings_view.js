import { AccountType } from "../../domain/entities/savings_account.js";
import { MovementType } from "../../domain/entities/movement.js";
import { formatCurrency } from "../../shared/utils/formatters.js";
import { metricCard, movementList, todayInputValue } from "../components/templates.js";

const accountLabels = {
  [AccountType.SAVINGS]: 'Ahorro',
  [AccountType.INVESTMENT]: 'Inversion'
};

const movementLabels = {
  [MovementType.DEPOSIT]: 'Deposito',
  [MovementType.WITHDRAWAL]: 'Retiro',
  [MovementType.RETURN]: 'Rendimiento'
};

export function renderSavings(state) {
  return `
    <section class="grid two">
      ${metricCard('Meta 20%', state.savingsBudget)}
      ${metricCard('Movimientos netos', state.savingsTotal, `Queda ${formatCurrency(state.savingsRemaining)}`)}
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>Crear cuenta</h2>
        <form id="account-form" class="form-grid">
          <label>
            Nombre
            <input name="name" type="text" placeholder="Fondo de emergencia" required />
          </label>
          <label>
            Tipo
            <select name="type">
              ${Object.values(AccountType).map(type => `<option value="${type}">${accountLabels[type]}</option>`).join('')}
            </select>
          </label>
          <div class="full">
            <button class="primary-button" type="submit">Crear cuenta</button>
          </div>
        </form>
      </article>

      <article class="panel">
        <h2>Registrar movimiento</h2>
        <form id="movement-form" class="form-grid">
          <label>
            Cuenta
            <select name="accountId" required>
              ${state.accounts.map(account => `<option value="${account.id}">${account.name} - ${accountLabels[account.type]}</option>`).join('')}
            </select>
          </label>
          <label>
            Tipo
            <select name="type">
              ${Object.values(MovementType).map(type => `<option value="${type}">${movementLabels[type]}</option>`).join('')}
            </select>
          </label>
          <label>
            Monto
            <input name="amount" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Fecha
            <input name="date" type="date" value="${todayInputValue()}" required />
          </label>
          <label class="full">
            Descripcion
            <input name="description" type="text" maxlength="90" placeholder="Deposito mensual" />
          </label>
          <div class="full">
            <button class="primary-button" type="submit" ${state.accounts.length ? '' : 'disabled'}>Guardar movimiento</button>
          </div>
        </form>
      </article>
    </section>

    <section class="table-card" style="margin-top:16px">
      <h2>Movimientos del mes</h2>
      ${movementList(state)}
    </section>
  `;
}
