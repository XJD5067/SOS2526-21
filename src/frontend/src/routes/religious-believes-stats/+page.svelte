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



    async function getCreencias(){
        let res=await fetch(BASE_API+"?limit=30",{method:'GET'}); //Añado limit para que se muestren todos los datos cargados, creo es más intuitivo hasta que se implemente pegainacion en el frontend
        const data=await res.json();
        creencias=data;
        codigo_status=res.status;
        
        //console.log(creencias);
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
</script>





<h1>Creencias Religiosas</h1>

<div>
    <button onclick={getCreencias}>Actualizar Lista de Datos</button>
</div>

<div>
    <h2>Estadísticas de creencias disponibles</h2>
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
        <p>El código de estado es {codigo_status}</p>
        <p>{estados_explicacion[codigo_status.toString()]}</p>
        
    </div>
    

{/if}