import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {handler} from './src/frontend/build/handler.js'
import {loadBackendApiDDLRF} from './src/backend/backApiDDLRF.js'

import {loadBackendApiMTC} from './src/backend/backApiMTC.js'

import { loadBackendApiIAD } from './src/backend/backApiIAD.js'

const app = express();
app.use(cors());
app.use(bodyParser.json())

let PORT = process.env.PORT || 3000;

//AQUI SE PUEDE PONER LAS TAREAS PERSONALES 
//--------------------------------------------------------------------------------------------

//-------
//DANIEL
//-------


loadBackendApiDDLRF(app)

//--------------------------------------------------------------------------------------------
//-------
//MARIA
//-------

loadBackendApiMTC(app)

//--------------------------------------------------------------------------------------------------
//IVÁN
//--------------------------------------------------------------------------------------------------

loadBackendApiIAD(app);

// FIN TAREAS PERSONAL
//--------------------------------------------------------------------------------------------

app.use(handler)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});