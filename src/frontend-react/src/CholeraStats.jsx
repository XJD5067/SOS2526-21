import { useState, useEffect } from "react";

const BASE_API = "/api/v1/cholera-stats";

const ESTADOS = {
  200: " - OK: La operación fue un éxito",
  201: " - Created: Creado correctamente",
  400: " - Bad Request: Campos incorrectos o incompletos",
  404: " - Not Found: El recurso no existe",
  405: " - Method Not Allowed: No puedes realizar esa operación",
  409: " - Conflict: Ya existe en la base de datos",
  500: " - Internal Server Error: Error interno en el servidor",
};

const EMPTY = {
  country: "", year: "",
  reportedCases: 0, reportedDeaths: 0,
  fatalityRate: 0, whoRegion: ""
};

const LIMIT = 10;

export default function CholeraStats() {
  const [datos, setDatos] = useState([]);
  const [status, setStatus] = useState(null);
  const [newRow, setNewRow] = useState(EMPTY);
  const [page, setPage] = useState(0);

  async function getDatos(p = page) {
    const res = await fetch(`${BASE_API}?limit=${LIMIT}&offset=${LIMIT * p}`);
    setDatos(await res.json());
  }

  useEffect(() => { getDatos(); }, [page]);

  async function loadInitial() {
    const res = await fetch(BASE_API + "/loadInitialData");
    setStatus(res.status);
    if (res.ok) getDatos();
  }

  async function add() {
    if (!newRow.country || !newRow.year || !newRow.whoRegion) {
      setStatus(400); return;
    }
    const res = await fetch(BASE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });
    setStatus(res.status);
    if (res.status === 201) { setNewRow(EMPTY); getDatos(); }
  }

  async function del(country, year) {
    if (!confirm("¿Borrar este registro?")) return;
    const res = await fetch(`${BASE_API}/${country}/${year}`, { method: "DELETE" });
    setStatus(res.status);
    if (res.ok) getDatos();
  }

  async function delAll() {
    if (!confirm("¿Borrar TODOS los registros?")) return;
    const res = await fetch(BASE_API, { method: "DELETE" });
    setStatus(res.status);
    if (res.ok) { setPage(0); getDatos(0); }
  }

  const set = (field) => (e) =>
    setNewRow((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Estadísticas del Cólera</h1>
      <button onClick={loadInitial}>Cargar datos iniciales</button>{" "}
      <button onClick={delAll}>Borrar todo</button>

      <hr />

      <table border="1" cellPadding="4" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>País</th><th>Año</th><th>Casos</th>
            <th>Muertes</th><th>Fatalidad</th><th>Región WHO</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.country + d.year} data-testid="choleraRow">
              <td>{d.country}</td>
              <td>{d.year}</td>
              <td>{d.reportedCases}</td>
              <td>{d.reportedDeaths}</td>
              <td>{d.fatalityRate}</td>
              <td>{d.whoRegion}</td>
              <td>
                <button onClick={() => del(d.country, d.year)}>Borrar</button>{" "}
                <button onClick={() => window.location.href = `/react/${d.country}/${d.year}`}>Editar</button>
              </td>
            </tr>
          ))}

          <tr>
            <td><input data-testid="countryInput" value={newRow.country} onChange={set("country")} placeholder="País" /></td>
            <td><input data-testid="yearInput" type="number" value={newRow.year} onChange={set("year")} placeholder="Año" /></td>
            <td><input data-testid="reportedCasesInput" type="number" value={newRow.reportedCases} onChange={set("reportedCases")} /></td>
            <td><input data-testid="reportedDeathsInput" type="number" value={newRow.reportedDeaths} onChange={set("reportedDeaths")} /></td>
            <td><input data-testid="fatalityRateInput" type="number" step="0.01" value={newRow.fatalityRate} onChange={set("fatalityRate")} /></td>
            <td><input data-testid="regionInput" value={newRow.whoRegion} onChange={set("whoRegion")} placeholder="Región" /></td>
            <td><button onClick={add}>+ Añadir</button></td>
          </tr>
        </tbody>
      </table>

      <p>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>← Anterior</button>{" "}
        Página {page + 1}{" "}
        <button onClick={() => setPage((p) => p + 1)} disabled={datos.length < LIMIT}>Siguiente →</button>
      </p>

      <hr />
      <h2>Códigos de estado</h2>
      {status && <p><strong>Último resultado:</strong> {ESTADOS[status] ?? `${status} - Respuesta desconocida`}</p>}
    </div>
  );
}