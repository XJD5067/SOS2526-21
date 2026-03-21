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
        resultStatus = await     res.status
        if (resultStatus == 201)
            getCholeraStats();
        
    }



onMount(async () =>  {getCholeraStats(); }); //que se carga al iniciar la pagina

</script>

<h1>cholera-stats</h1>  

{#if resultStatus != 0}
<h5>Status code: {resultStatus}</h5>
{/if}

<button onclick={deleteCholeraStats}>Borrar todo</button>
<table>
    <thead>
        <tr>
            <th>country</th>
            <th>year</th>
            <th>reportedCases</th>
            <th>reportedDeaths</th>
            <th>fatalityRate</th>
            <th>whoRegion</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value= {newCountry} /></td>
            <td><input  bind:value= {newYear} /></td>
            <td><input  bind:value= {newReportedCases} /></td>
            <td><input  bind:value= {newReportedDeaths} /></td>
            <td><input  bind:value= {newFatalityRates} /></td>
            <td><input  bind:value= {newWhoRegion} /></td>
            <td><button onclick={InsertCholeraStat}>Insertar</button></td>
        </tr>
        {#each cholera_stats as cholera_stat (`${cholera_stat.country}-${cholera_stat.year}`)}
            <tr>
                <td><a href="cholera-stats/{cholera_stat.country}/{cholera_stat.year}">{cholera_stat.country}</a></td>
                <td>{cholera_stat.year}</td>
                <td>{cholera_stat.reportedCases} </td>
                <td> {cholera_stat.reportedDeaths} </td>
                <td>{cholera_stat.fatalityRate} </td>
                <td>{cholera_stat.whoRegion}</td>
                <td><button onclick={() => deleteCholeraStat(cholera_stat.country, cholera_stat.year)}>Borrar</button></td>
             </tr>

        {/each}
    </tbody>

</table>

