import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AidsDeathsStats from './Aidsdeathsstats.jsx'
import EditAidsDeath from './Editaidsdeath.jsx';
import CholeraStats from './CholeraStats.jsx'
import EditCholera from './EditCholera.jsx'

const path = window.location.pathname.split('/').filter(Boolean)


let App;
if (path[1] === 'cholera') {
  if (path.length === 4) {
    App = <EditCholera country={path[2]} year={path[3]} />;
  } else {
    App = <CholeraStats />;
  }
} else if (path[1] === 'aidsDeath') {
  if (path.length === 4) {
    App = <EditAidsDeath codecountry={path[2]} year={path[3]} />;
  } else {
    App = <AidsDeathsStats />;
  }
} else {
  App = <AidsDeathsStats />; // por defecto en /react
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {App}
  </StrictMode>,
)




