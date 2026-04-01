<script>
// @ts-nocheck

    import { dev } from '$app/environment';
	import { onMount } from 'svelte';

    let BASE_API="/api/v1/religious-believes-stats";
    if(dev){
        BASE_API="http://localhost:3000" + BASE_API;
    }




    // @ts-ignore
    let creencias=$state([]);
    let codigo_status=$state(0);
    //INPUT para el POST
    let newPais=$state("pais");
    let newCodigo=$state("codigo");
    let newAno=$state("año");
    let newCristiano=$state("cristianos");
    let newJudio=$state("judios");
    let newMusulman=$state("musulmanes");
    let newIndu=$state("indues");
    let newBudista=$state("budistas");
    let newOtro=$state("otros");
    let newNoreligion=$state("sin religion");

    //INPUT FILTROS
    let filtroPais=$state("");
    let filtroCodigo=$state("");
    let filtroAno=$state("");
    let filtroCristiano=$state("");
    let filtroJudio=$state("");
    let filtroMusulman=$state("");
    let filtroIndu=$state("");
    let filtroBudista=$state("");
    let filtroOtro=$state("");
    let filtroNoreligion=$state("");
    //Explicación Códigos de Estado

    // @ts-ignore
    let estados_explicacion={
        "200": "La operación solicitada fue un éxito",
        "201": "Los datos fueron creados correctamente",
        "409": "Los datos introducidos, o la combinación de país y año, ya existen en la base de datos",
        "405": "No puedes realizar esa operación sobre el recrso solicitado",
        "500": "Hubo un error interno en el servidor",
        "404": "El recurso al que intentas ejercer esta operación no existe",
        "400": "Hay un problema con los datos enviados"
    }

    //Offset para paginación
    let offset=0;


//-------------FUNCIONES------------------------------------------------------------------------------------
    async function getCreencias(query=""){
        let res=await fetch(BASE_API+`?limit=10&&offset=${offset}`+query,{method:'GET'}); //Añado limit para que se muestren todos los datos cargados, creo es más intuitivo hasta que se implemente pegainacion en el frontend
        const data=await res.json();
        creencias=data;
        codigo_status=res.status;
        
        //console.log(creencias);
    }


    async function getCreenciasFiltro(){
        let url="";
        if (filtroPais) url+=`&entity=${filtroPais}`;
        if (filtroCodigo) url+=`&code=${filtroCodigo}`;
        if (filtroAno) url+=`&year=${filtroAno}`;
        if (filtroCristiano) url+=`&christian=${filtroCristiano}`;
        if (filtroJudio) url+=`&jew=${filtroJudio}`;
        if (filtroMusulman) url+=`&muslim=${filtroMusulman}`;
        if (filtroIndu) url+=`&hindu=${filtroIndu}`;
        if (filtroBudista) url+=`&budhist=${filtroBudista}`;
        if (filtroOtro) url+=`&other=${filtroOtro}`;
        if (filtroNoreligion) url+=`&no_religion=${filtroNoreligion}`;

        console.log(url);

        getCreencias(url);
    }






    async function annhilateData(){
        if(confirm("Eliminarás todo los datos de la Base de Datos, ¿Es esa tu voluntad?")){
            console.log("Así sea");

            let res= await fetch(BASE_API,{method: 'DELETE'});
            codigo_status=res.status;
            if(codigo_status===200) getCreencias();


        }
        
    }

    // @ts-ignore
    async function deleteRow(entity,year){
        let res=await fetch(BASE_API+`/${entity}/${year}`,{method:'DELETE'});
        codigo_status=res.status;
        if(codigo_status===200) getCreencias();
    }

    async function insertaCreencia(){
        let newCreencia={entity:newPais,code:newCodigo,year:newAno,christian:newCristiano,
            jew:newJudio,muslim:newMusulman,hindu:newIndu,budhist:newBudista,other:newOtro,no_religion:newNoreligion};

        let res=await fetch(BASE_API,{method:'POST',
        body:JSON.stringify(newCreencia),
        headers:{"Content-Type":"application/json"}});

        codigo_status=res.status;
        if (codigo_status===201) getCreencias();
    }

    onMount(()=>{
        getCreencias();
    })

    async function incrementaOffset(){
        if (offset<=20) offset+=10;
        getCreenciasFiltro();
    }

    async function decrementaOffset(){
        if(offset>=10) offset-=10;
        getCreenciasFiltro();
    }


</script>





<h1>Creencias Religiosas</h1>

<div>
    <button onclick={getCreencias}>Actualizar Lista de Datos</button>
</div>

<div>
    <h2>Estadísticas de creencias disponibles</h2>
    <div>
        <h3>Filtros de Búsqueda</h3>
        <div>
            <input placeholder="país" bind:value={filtroPais}>
            <input placeholder="código" bind:value={filtroCodigo}>
            <input placeholder="año" bind:value={filtroAno}>
            <input placeholder="%Cristianos" bind:value={filtroCristiano}>
            <input placeholder="%Judíos" bind:value={filtroJudio}>
            <input placeholder="%Musulmanes" bind:value={filtroMusulman}>
            <input placeholder="%Indúes" bind:value={filtroIndu}>
            <input placeholder="%Budistas" bind:value={filtroBudista}>
            <input placeholder="%Otra Religión" bind:value={filtroOtro}>
            <input placeholder="%Sin religión" bind:value={filtroNoreligion}>
            <button onclick={getCreenciasFiltro}>Buscar</button>
        </div>
    </div>
    <div>
        <button onclick={decrementaOffset}>Anterior</button>
        <button onclick={incrementaOffset}>Siguiente</button>
    </div>
    <div>
        <table>
           
                <thead>
                    <tr>
                        <th> País</th>
                        <th> Código</th>
                        <th> Año</th>
                        <th> Cristianos(%)</th>
                        <th> Judíos(%)</th>
                        <th> Musulmanes(%)</th>
                        <th> Indúes(%)</th>
                        <th> Budistas(%)</th>
                        <th> Otros(%)</th>
                        <th> Sin Religión(%)</th>

                    </tr>

                     
                </thead>
                <tbody>

                    <tr>
                        <td><input bind:value={newPais}></td>
                        <td><input bind:value={newCodigo}></td>
                        <td><input bind:value={newAno}></td>
                        <td><input bind:value={newCristiano}></td>
                        <td><input bind:value={newJudio}></td>
                        <td><input bind:value={newMusulman}></td>
                        <td><input bind:value={newIndu}></td>
                        <td><input bind:value={newBudista}></td>
                        <td><input bind:value={newOtro}></td>
                        <td><input bind:value={newNoreligion}></td>
                        <td><button onclick={insertaCreencia}>Publicar</button></td>
                    </tr>

                     {#each creencias as dato}
                    <tr>
                        <td>{dato.entity}</td>
                        <td>{dato.code}</td>
                        <td>{dato.year}</td> 
                        <td>{dato.christian}</td>
                        <td>{dato.jew}</td>
                        <td>{dato.muslim}</td> 
                        <td>{dato.hindu}</td> 
                        <td>{dato.budhist}</td>
                        <td>{dato.other}</td>
                        <td>{dato.no_religion}</td>
                        <td><button onclick={deleteRow(dato.entity,dato.year)}>Eliminar</button></td>
                        <td><a href="./religious-believes-stats/{dato.entity}/{dato.year}"><button>Actualizar</button></a></td>
                    </tr>
                    {/each}
                </tbody>
                
        </table>
    </div>
</div>

<div>
    <h2> Zona de Peligro : Eliminar Todos los Datos</h2>
    <div>
        <button onclick={annhilateData}>BORRAR TODO</button>
    </div>

</div>

{#if codigo_status!=0}
    <div>
        <h2>Estado de la operación</h2>
        <p>{estados_explicacion[codigo_status.toString()]}</p>
        
    </div>
    

{/if}

<style>

:global(body) {
  margin: 0;
  padding: 2rem;
  font-family: Georgia, "Times New Roman", serif;
  background:
    linear-gradient(rgba(248, 244, 236, 0.96), rgba(248, 244, 236, 0.96)),
    radial-gradient(circle at top, rgba(176, 141, 87, 0.12), transparent 40%);
  color: #35261c;
}

:global(h1) {
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-size: 2.4rem;
  color: #5b3418;
  text-shadow: 0 1px 0 rgba(255,255,255,0.75);
}

:global(h1::after) {
  content: " ✝";
  color: #b08d57;
}

:global(h2) {
  margin: 0 0 1rem 0;
  color: #6a3e1b;
  font-size: 1.4rem;
}

:global(h3) {
  margin: 0 0 0.75rem 0;
  color: #7a5a2c;
  font-size: 1rem;
}

:global(button) {
  border: 1px solid #8f6c35;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, #7d5b22, #5d4318);
  color: #fff8ea;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}

:global(button:hover) {
  transform: translateY(-1px);
  background: linear-gradient(180deg, #8f6a28, #6a4d1a);
  box-shadow: 0 8px 18px rgba(93, 67, 24, 0.18);
}

:global(input) {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.85rem;
  border: 1px solid #cfbc99;
  border-radius: 10px;
  background: #fffdf8;
  color: #35261c;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

:global(input::placeholder) {
  color: #9a866a;
  font-style: italic;
}

:global(input:focus) {
  border-color: #8f6c35;
  box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.18);
  background: #fffefa;
}

:global(table) {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  background: #fffdf9;
}

:global(thead) {
  background: linear-gradient(180deg, #efe2c8, #e5d2ad);
}

:global(th) {
  padding: 0.9rem;
  text-align: left;
  color: #5f3918;
  border-bottom: 1px solid #d4c09b;
  white-space: nowrap;
}

:global(td) {
  padding: 0.85rem;
  border-bottom: 1px solid #eee3d2;
  vertical-align: middle;
}

:global(tbody tr:nth-child(even)) {
  background: rgba(176, 141, 87, 0.05);
}

:global(tbody tr:hover) {
  background: rgba(106, 62, 27, 0.06);
}

:global(a) {
  text-decoration: none;
}

/* Botón superior */
:global(body > div:first-of-type) {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

/* Bloque principal */
:global(body > div:nth-of-type(2)) {
  background: linear-gradient(180deg, #fffdf8, #f7f0e3);
  border: 1px solid #dcc9a6;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 12px 28px rgba(70, 41, 12, 0.08);
  margin-bottom: 1.5rem;
}

/* Caja de filtros */
:global(body > div:nth-of-type(2) > div:first-of-type) {
  background: rgba(255, 250, 241, 0.95);
  border: 1px solid #e6d7bb;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Grid de inputs de filtros */
:global(body > div:nth-of-type(2) > div:first-of-type > div) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

/* Paginación */
:global(body > div:nth-of-type(2) > div:nth-of-type(2)) {
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0 1.25rem;
  flex-wrap: wrap;
}

/* Contenedor tabla */
:global(body > div:nth-of-type(2) > div:nth-of-type(3)) {
  overflow-x: auto;
  border: 1px solid #dccdb4;
  border-radius: 14px;
  background: #fffdf9;
}

/* Fila de inserción */
:global(tbody > tr:first-child) {
  background: #fcf7ed;
}

:global(tbody > tr:first-child button) {
  background: linear-gradient(180deg, #3f6b3f, #2f4f2f);
  border-color: #355a35;
}

:global(tbody > tr:first-child button:hover) {
  background: linear-gradient(180deg, #4b7c4b, #386038);
}

/* Botones de acciones por texto visual */
:global(tbody button) {
  white-space: nowrap;
}

:global(tbody td button) {
  font-size: 0.88rem;
  padding: 0.6rem 0.85rem;
}

/* Zona de peligro */
:global(body > div:nth-of-type(3)) {
  background: linear-gradient(180deg, #fff4f4, #fdeaea);
  border: 1px solid #e3b6b6;
  border-radius: 18px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

:global(body > div:nth-of-type(3) h2) {
  color: #7f1d1d;
}

:global(body > div:nth-of-type(3) button) {
  background: linear-gradient(180deg, #922222, #711919);
  border-color: #651515;
}

:global(body > div:nth-of-type(3) button:hover) {
  background: linear-gradient(180deg, #a72626, #7f1d1d);
}

/* Estado de operación */
:global(body > div:nth-of-type(4)) {
  background: #fff8eb;
  border-left: 5px solid #a07a35;
  border-radius: 12px;
  padding: 1rem 1.2rem;
}

:global(body > div:nth-of-type(4) p) {
  margin: 0.4rem 0 0 0;
  color: #4e3927;
}

@media (max-width: 768px) {
  :global(body) {
    padding: 1rem;
  }

  :global(h1) {
    font-size: 1.8rem;
  }

  :global(body > div:nth-of-type(2)) {
    padding: 1rem;
  }

  :global(body > div:nth-of-type(2) > div:nth-of-type(2)) {
    flex-direction: column;
  }

  :global(button) {
    width: 100%;
  }
}
</style>