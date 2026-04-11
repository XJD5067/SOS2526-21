<script>
import { dev } from '$app/environment';
import { onMount } from 'svelte';
import { createAuth0Client } from '@auth0/auth0-spa-js';

// @ts-ignore
let cholera_stats = $state([]);
let resultStatus = $state(0);
let token = $state('');
let loggedIn = $state(false);
let loginUsername = $state('');
let loginPassword = $state('');

let auth0Client = null;
let auth0LoggedIn = $state(false);
let auth0User = $state(null);

const AUTH0_DOMAIN = 'dev-zpgeuxizciahryz4.us.auth0.com';
const AUTH0_CLIENT_ID = 'QAEuGHpnPiUYuj83H4lwY8gtVCZ55cjg';

let newCountry = $state('PaisEjemplo');
let newYear = $state('1000');
let newReportedCases = $state('0');
let newReportedDeaths = $state('0');
let newFatalityRates = $state('0.0');
let newWhoRegion = $state('RegionEjemplo');
let filterCountry = $state('');
let filterYear = $state('');
let filterRegion = $state('');
let filterReportedCases = $state('');
let filterReportedDeaths = $state('');
let filterFatalityRate = $state('');
let filterFrom = $state('');
let filterTo = $state('');
let filterOffset = $state(0);
let filterLimit = $state(10);

let API = "/api/v2/cholera-stats";
let AUTH_URL = "/api/v2/auth/login";

if (dev) {
    API = "http://localhost:3000" + API;
    AUTH_URL = "http://localhost:3000/api/v2/auth/login";
}

async function login() {
    resultStatus = 0;
    const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
    });
    if (res.ok) {
        const data = await res.json();
        token = data.token;
        localStorage.setItem('token', token);
        loggedIn = true;
        resultStatus = 200;
    } else {
        resultStatus = res.status;
    }
}

function logout() {
    token = '';
    loggedIn = false;
    resultStatus = 0;
    localStorage.removeItem('token');
}

async function loginAuth0() {
    await auth0Client.loginWithRedirect();
}

async function logoutAuth0() {
    auth0LoggedIn = false;
    auth0User = null;
    await auth0Client.logout({
        logoutParams: { returnTo: window.location.origin + '/cholera-stats-optional' }
    });
}

async function getCholeraStats() {
    let url = API + '?';
    if(filterCountry) url += `country=${filterCountry}&`;
    if(filterYear) url += `year=${filterYear}&`;
    if(filterRegion) url += `region=${filterRegion}&`;
    if(filterReportedCases !== '') url += `reportedCases=${filterReportedCases}&`;
    if(filterReportedDeaths !== '') url += `reportedDeaths=${filterReportedDeaths}&`;
    if(filterFatalityRate !== '') url += `fatalityRate=${filterFatalityRate}&`;
    if(filterFrom) url += `from=${filterFrom}&`;
    if(filterTo) url += `to=${filterTo}&`;
    url += `offset=${filterOffset}&`;
    url += `limit=${filterLimit}&`;
    const res = await fetch(url, {method: "GET"});
    const data = await res.json();
    cholera_stats = data;
}

async function getInitdata() {
    const res = await fetch(API + '/loadInitialData', {method: "GET"});
    resultStatus = await res.status;
    if(resultStatus == 201 || resultStatus == 409)
        getCholeraStats();
}

// @ts-ignore
async function deleteCholeraStat(country, year) {
    const res = await fetch(API+'/'+country+'/'+year, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    resultStatus = await res.status;
    if (resultStatus == 200) getCholeraStats();
}

async function deleteCholeraStats() {
    const res = await fetch(API, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    resultStatus = await res.status;
    if (resultStatus == 200) getCholeraStats();
}

async function InsertCholeraStat() {
    let newCholeraStat = {
        country: newCountry, year: newYear,
        reportedCases: newReportedCases, reportedDeaths: newReportedDeaths,
        fatalityRate: newFatalityRates, whoRegion: newWhoRegion
    };
    const res = await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCholeraStat)
    });
    resultStatus = await res.status;
    if (resultStatus == 201) getCholeraStats();
}

async function incrementaOffset() {
    filterOffset += filterLimit;
    getCholeraStats();
}

async function decrementaOffset() {
    if(filterOffset >= filterLimit) filterOffset -= filterLimit;
    getCholeraStats();
}

onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    if (oauthToken) {
        localStorage.setItem('token', oauthToken);
        window.history.replaceState({}, '', window.location.pathname);
    }
    token = localStorage.getItem('token') ?? '';
    loggedIn = token !== '';

    auth0Client = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: window.location.origin + '/cholera-stats-optional'
        }
    });

    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, '', window.location.pathname);
    }

    auth0LoggedIn = await auth0Client.isAuthenticated();
    if (auth0LoggedIn) {
        auth0User = await auth0Client.getUser();
    }

    await getCholeraStats();
});
</script>

<svelte:head>
  <title>Cholera Stats Opcional</title>
</svelte:head>

<h1>Estadísticas del cólera v2</h1>

<!-- LOGIN -->
{#if !loggedIn}
<div>
    <h3>INICIAR SESIÓN</h3>
    <input placeholder="Usuario" bind:value={loginUsername} />
    <input type="password" placeholder="Contraseña" bind:value={loginPassword} />
    <button onclick={login}>INICIAR SESIÓN</button>
    <a href="/api/v2/auth/github-mtc"><button>INICIAR SESIÓN CON GITHUB</button></a>
    <button onclick={loginAuth0}>INICIAR SESIÓN CON AUTH0</button>
</div>
{:else}
<div>
    <strong>✔ Sesión iniciada</strong>
    <button onclick={logout}>CERRAR SESIÓN</button>
</div>
{/if}

{#if auth0LoggedIn}
<div>
    <strong>Auth0: {auth0User?.name ?? auth0User?.email}</strong>
    <button onclick={logoutAuth0}>CERRAR SESIÓN AUTH0</button>
</div>
{/if}

{#if resultStatus == 200 || resultStatus == 201}
<div class="alert success">
  <strong>EXITO</strong> — Operación realizada con éxito
</div>
{/if}
{#if resultStatus == 400}
<div class="alert error">
  <strong>ERROR</strong> — Campos sin rellenar
</div>
{/if}
{#if resultStatus == 401}
<div class="alert error">
  <strong>ERROR</strong> — No autorizado, inicia sesión
</div>
{/if}
{#if resultStatus == 409}
<div class="alert error">
  <strong>ERROR</strong> — La estadística ya existe
</div>
{/if}

<style>
  .alert {
    padding: 10px 16px;
    border-radius: 6px;
    margin: 10px 0;
  }
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>

<h5>Haga click en el país para actualizar datos de la estadística</h5>

<br>

<button onclick={getInitdata}> CARGAR DATOS </button>
<button onclick={deleteCholeraStats}>BORRAR TODO</button>

<br><br><br>
<h3>FILTROS DE BÚSQUEDA</h3>
<input placeholder="País" bind:value={filterCountry} />
<input placeholder="Año" type="number" bind:value={filterYear} />
<input placeholder="Casos reportados" type="number" bind:value={filterReportedCases} />
<input placeholder="Muertes reportadas" type="number" bind:value={filterReportedDeaths} />
<input placeholder="Ratio de fatalidad" type="number" step="0.01" bind:value={filterFatalityRate} />
<input placeholder="Región" bind:value={filterRegion} />
<input placeholder="Desde" type="number" bind:value={filterFrom} />
<input placeholder="Hasta" type="number" bind:value={filterTo} />
<button onclick={getCholeraStats}>BUSCAR</button>
<button onclick={() => {
    filterCountry=''; filterYear=''; filterRegion=''; filterReportedCases=''; filterReportedDeaths='';
    filterFatalityRate=''; filterFrom=''; filterTo='';
    getCholeraStats();
}}>LIMPIAR FILTROS</button>

<br><br>
<h3>CREACIÓN DE ESTADISTICA</h3>

<br>
<div>
    <p>INTRODUZCA EL LIMITE DE FILAS QUE SE MOSTRARAN EN CADA PAGINA:</p>
    <input type="number" bind:value={filterLimit} />
    <button onclick={getCholeraStats}>APLICAR LÍMITE</button>
    <br><br>
    <button onclick={decrementaOffset}>ANTERIOR</button>
    <button onclick={incrementaOffset}>SIGUIENTE</button>
</div>

<table>
    <thead>
        <tr>
            <th>Pais</th>
            <th>Año</th>
            <th>Casos reportados</th>
            <th>Muertes reportadas</th>
            <th>Ratio de fatalidad</th>
            <th>Región</th>
            <th>Acción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input data-testid="countryInput" bind:value={newCountry} /></td>
            <td><input data-testid="yearInput" type="number" bind:value={newYear} /></td>
            <td><input data-testid="reportedCasesInput" type="number" bind:value={newReportedCases} /></td>
            <td><input data-testid="reportedDeathsInput" type="number" bind:value={newReportedDeaths} /></td>
            <td><input data-testid="fatalityRateInput" type="number" step="0.01" bind:value={newFatalityRates} /></td>
            <td><input data-testid="regionInput" bind:value={newWhoRegion} /></td>
            <td><button onclick={InsertCholeraStat}>INSERTAR</button></td>
        </tr>
        {#each cholera_stats as cholera_stat (`${cholera_stat.country}-${cholera_stat.year}`)}
            <tr data-testid="choleraRow">
                <td><a href="cholera-stats-optional/{cholera_stat.country}/{cholera_stat.year}">{cholera_stat.country}</a></td>
                <td>{cholera_stat.year}</td>
                <td>{cholera_stat.reportedCases}</td>
                <td>{cholera_stat.reportedDeaths}</td>
                <td>{cholera_stat.fatalityRate}</td>
                <td>{cholera_stat.whoRegion}</td>
                <td><button data-testid={`${cholera_stat.country}-${cholera_stat.year}`} onclick={() => deleteCholeraStat(cholera_stat.country, cholera_stat.year)}>BORRAR</button></td>
            </tr>
        {/each}
    </tbody>
</table>