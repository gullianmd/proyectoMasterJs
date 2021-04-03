import { useState } from 'react';

import PokeDex from './components/pokedex/Pokedex';
import { AppBar, Tab} from '@material-ui/core';
import { TabContext, TabList, TabPanel} from '@material-ui/lab';
import AppHeader from './components/appHeader/AppHeader'
import PokeFav from './components/pokefav/PokeFav';
import './App.css';




function App() {

  const [tabIndex, updateTabIndex] = useState('1')

  const changeTabIndex = (event, value) => updateTabIndex(value)

  return (
    <>

      <div>
        <AppHeader/>
      </div>

      <div>
        <TabContext value={tabIndex}>
          <AppBar position="static">
              <TabList className="menu" onChange={changeTabIndex}>
                  <Tab className="tabs" label="pokedex" value="1"/>
                  <Tab className="tabs" label="Pokemon Favorito" value="2"/>
              </TabList>
          </AppBar>

          <TabPanel value="1">
            <PokeDex/>
          </TabPanel>

          <TabPanel value="2">
            <PokeFav/>
          </TabPanel>

        </TabContext>
      </div>
    </>
  );
}

export default App;
