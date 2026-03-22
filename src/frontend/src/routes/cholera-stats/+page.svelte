<script>

import { dev } from '$app/environment';
import {onMount} from 'svelte';
// @ts-ignore
let cholera_stats=  $state([]);
let resultStatus = $state(0);
let newCountry = $state('PaisEjemplo');
let newYear = $state('1000');
let newReportedCases = $state('0');
let newReportedDeaths = $state('0');
let newFatalityRates = $state('0.0');
let newWhoRegion = $state('RegionEjemplo');



let API = "/api/v1/cholera-stats";

if (dev)
    API = "http://localhost:3000"+API;

    // @ts-ignore
    async function getCholeraStats()  {
        const res = await fetch(API, {method : "GET"});
        const data = await res.json();
        cholera_stats = data;


    }

    // @ts-ignore
    async function deleteCholeraStat(country, year){
        const res = await fetch(API+'/'+country+'/'+year, {method : "DELETE"});
        resultStatus = await res.status
        if (resultStatus == 200)
            getCholeraStats();
    }



    // @ts-ignore
    async function deleteCholeraStats(){
        const res = await fetch(API, {method : "DELETE"});
        resultStatus = await res.status
        if (resultStatus == 200)
            getCholeraStats();
    }


    // @ts-ignore
    async function InsertCholeraStat(){
        let newCholeraStat= {
            country: newCountry,
            year: newYear,
            reportedCases: newReportedCases,
            reportedDeaths: newReportedDeaths,
            fatalityRate: newFatalityRates,
            whoRegion: newWhoRegion
        }
        const res = await fetch(API, 
        {method : "POST", 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newCholeraStat)
        });
        resultStatus = await     res.status
        if (resultStatus == 201)
            getCholeraStats();
        
    }


    // @ts-ignore
    async function UpdateCholeraStat(country, year){
        let newCholeraStat= {
            country: newCountry,
            year: newYear,
            reportedCases: newReportedCases,
            reportedDeaths: newReportedDeaths,
            fatalityRate: newFatalityRates,
            whoRegion: newWhoRegion
        }
        const res = await fetch(API+'/'+country+'/'+year, 
        {method : "UPDATE", 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newCholeraStat)
        });
        resultStatus = await res.status
        if (resultStatus == 201)
            getCholeraStats();
        
    }



onMount(async () =>  {getCholeraStats(); }); //que se carga al iniciar la pagina

</script>

<h1>Estadísticas del cólera</h1>  


{#if resultStatus == 200 || resultStatus == 201}
<div class="alert success">
  <strong>Status {resultStatus}</strong> — Operación realizada con éxito
</div>
{/if}
{#if resultStatus == 400}
<div class="alert error">
  <strong>Status {resultStatus}</strong> — Campos sin rellenar
</div>
{/if}
{#if resultStatus == 409}
<div class="alert error">
  <strong>Status {resultStatus}</strong> — La estadística ya existe
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

<button onclick={deleteCholeraStats}>BORRAR TODO</button>

<br>
<br>
<br>


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
            <td><input type="number" bind:value= {newCountry} /></td>
            <td><input type="number" bind:value= {newYear} /></td>
            <td><input type="number" bind:value= {newReportedCases} /></td>
            <td><input type="number" bind:value= {newReportedDeaths} /></td>
            <td><input type="number" bind:value= {newFatalityRates} /></td>
            <td><input type="number" bind:value= {newWhoRegion} /></td>
            <td><button onclick={InsertCholeraStat}>INSERTAR</button></td>
        </tr>
        {#each cholera_stats as cholera_stat (`${cholera_stat.country}-${cholera_stat.year}`)}
            <tr>
                <td><a href="cholera-stats/{cholera_stat.country}/{cholera_stat.year}">{cholera_stat.country}</a></td>
                <td>{cholera_stat.year}</td>
                <td>{cholera_stat.reportedCases} </td>
                <td> {cholera_stat.reportedDeaths} </td>
                <td>{cholera_stat.fatalityRate} </td>
                <td>{cholera_stat.whoRegion}</td>
                <td><button onclick={() => deleteCholeraStat(cholera_stat.country, cholera_stat.year)}>BORRAR</button></td>
             </tr>

        {/each}
    </tbody>

</table>

