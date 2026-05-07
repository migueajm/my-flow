# Gastos Personales Web

Aplicacion web de gestion de gastos personales hecha con HTML, CSS y JavaScript vanilla. Usa Chart.js como unica libreria externa para graficar y LocalStorage para persistencia local mediante `SecureStorageManager`.

## Arquitectura

Se implementa Clean Architecture por capas:

- `domain/entities`: modelos de negocio.
- `domain/usecases`: acciones del dominio, como guardar ingreso, registrar gasto y registrar movimientos.
- `domain/repositories`: contrato del repositorio.
- `application/services`: orquestacion y calculos de reportes.
- `infrastructure/storage`: `SecureStorageManager`.
- `infrastructure/repositories`: implementacion LocalStorage.
- `presentation/views`: vistas HTML generadas por JS.
- `presentation/components`: charts y helpers de UI.

<img src="https://raw.githubusercontent.com/migueajm/my-flow-app/refs/heads/main/assets/marketing3.png">

## Funcionalidades

- Ingreso mensual con division automatica 80% gastos / 20% ahorro e inversion.
- Registro de gastos por fecha, categoria, monto y descripcion.
- Cuentas de ahorro e inversion.
- Movimientos de deposito, retiro y rendimiento.
- Persistencia por mes y anio en LocalStorage.
- Dashboard mensual con presupuesto disponible en tiempo real.
- Alertas por cercania o exceso del presupuesto.
- Reportes diarios, semanales, mensuales y comparacion entre meses.
- Graficos de pastel, barras y lineas con Chart.js.
- Tema claro, oscuro o sistema, persistido por usuario.
- Idioma Espanol/Ingles segun navegador, con selector manual.
- Pantalla de inicio de sesion maquetada y acceso como invitado.
- Loader global preparado para futuras llamadas a API.
- Menu hamburguesa en moviles.
- Swipe a la derecha para editar y a la izquierda para eliminar gastos y movimientos.
- Footer de autoria `@migueajm`.

## Ejecutar

Por seguridad de modulos ES, abre la app con un servidor local:

```bash
python3 -m http.server 8080
```

Luego abre:

```text
http://localhost:8080/my-flow/
```

Tambien puedes servir directamente esta carpeta desde cualquier servidor estatico.
