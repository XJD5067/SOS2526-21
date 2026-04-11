import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Aidsdeathsstats from './Aidsdeathsstats.jsx'
import EditAidsDeath from './Editaidsdeath.jsx';
import CholeraStats from './CholeraStats.jsx'
import EditCholera from './EditCholera.jsx'

const path = window.location.pathname.split('/').filter(Boolean)

/*const App = path.length === 3
  ? <EditAidsDeath codecountry={path[1]} year={path[2]} />
  : <Aidsdeathsstats />
*/




let App;
if (path[1] === 'cholera') {
  if (path.length === 4) {
    App = <EditCholera country={path[2]} year={path[3]} />;
  } else {
    App = <CholeraStats />;
  }
} else if (path.length === 3) {
  App = <EditAidsDeath codecountry={path[1]} year={path[2]} />;
} else {
  App = <AidsDeathsStats />;
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {App}
  </StrictMode>,
)




