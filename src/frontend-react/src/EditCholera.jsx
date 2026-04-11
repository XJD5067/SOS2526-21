import { useState, useEffect } from "react";

const BASE_API = "/api/v1/cholera-stats";

const ESTADOS = {
  200: "200 - OK: La operación fue un éxito",
  400: "400 - Bad Request: Campos incorrectos o incompletos",
  404: "404 - Not Found: El recurso no existe",
  500: "500 - Internal Server Error: Error interno en el servidor",
};

export default function EditCholera({ country, year }) {
  const [status, setStatus] = useState(null);
  const [dato, setDato] = useState({
    country: "", year: "",
    reportedCases: 0, reportedDeaths: 0,
    fatalityRate: 0, whoRegion: ""
  });

  useEffect(() => {
    fetch(`${BASE_API}/${country}/${year}`)
      .then((r) => r.json())
      .then(setDato);
  }, []);

  async function guardar() {
    const res = await fetch(`${BASE_API}/${country}/${year}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dato),
    });
    setStatus(res.status);
  }

  const set = (field) => (e) =>
    setDato((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <button onClick={() => window.location.href = '/react'}>← Volver</button>
      <h1>Editar registro — {country} / {year}</h1>

      <p>
        <label>País <input value={dato.country} readOnly /></label>{" "}
        <label>Año <input type="number" value={dato.year} readOnly /></label>
      </p>

      <p>
        <label>Casos <input data-testid="reportedCasesInput" type="number" min="0" value={dato.reportedCases} onChange={set("reportedCases")} /></label>{" "}
        <label>Muertes <input data-testid="reportedDeathsInput" type="number" min="0" value={dato.reportedDeaths} onChange={set("reportedDeaths")} /></label>{" "}
        <label>Fatalidad <input data-testid="fatalityRateInput" type="number" step="0.01" min="0" value={dato.fatalityRate} onChange={set("fatalityRate")} /></label>{" "}
        <label>Región <input data-testid="regionInput" value={dato.whoRegion} onChange={set("whoRegion")} /></label>
      </p>

      <button onClick={guardar}>Guardar cambios</button>{" "}
      <button onClick={() => window.location.href = '/react'}>Cancelar</button>

      <hr />
      <h2>Códigos de estado</h2>
      {status && <p><strong>Último resultado:</strong> {ESTADOS[status] ?? `${status} - Respuesta desconocida`}</p>}
    </div>
  );
}