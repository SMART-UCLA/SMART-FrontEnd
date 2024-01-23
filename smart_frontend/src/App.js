import logo from './logo.svg';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'; /*needed to change from Switch to Routes and change overall structure*/
import './App.css';

import Home  from './components/Home';
import GraphDay from './components/GraphDay';
import LiveData from './components/LiveData';
import LiveDataMQTT from './components/LiveDataMQTT'
import TestGraph from './components/TestGraph'
import TestHistoricalGraph from './components/TestHistoricalGraph';
import AuthProvider from './auth/authConfiguration';
import AuthGuard from './auth/authGuard';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes> 
            <Route exact path ="/" element={<Home />}/>
            <Route 
              exact path = "/TestGraph" 
              element ={<AuthGuard><TestGraph/></AuthGuard>}
            />
            <Route 
              exact path = "/TestHistoricalGraph" 
              element ={ <AuthGuard><TestHistoricalGraph/></AuthGuard>}
            />
            <Route
              exact path="/LiveDataMQTT/:topic/:granularity"
              /*element={<AuthGuard><LiveDataMQTT /></AuthGuard>}*/
              element={<LiveDataMQTT />} 
            />
            <Route 
              exact path = "/LiveDataMQTT/:topic" 
              element={<AuthGuard><LiveDataMQTT/></AuthGuard>}
            />
            <Route exact path = "/HistoricalData"
              element={
                <AuthGuard>
                  <GraphDay
                    table={"apollo15int"}
                    title={"Magnetic Data 1971-8-01 to 1972-09-20"}
                    startingDate={'1971-8-01 PST'}
                    maxDate={'1972-09-20 PST'}
                  />
                </AuthGuard>
              }
            />
            <Route exact path = "/LiveData"
              element={
                <AuthGuard>
                  <LiveData
                    table={"apollo15int"}
                    title={"Live Data"}
                    startingDate={'1971-8-01 11:00:00 PST'}
                    maxDate={'1972-09-20 PST'}
                  />
                </AuthGuard>
              }
            /> 
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
