import './App.css';
import plot from "../assets/plot.png";
// import './../styles/globals.css'

// function Data() {
//   return (
// 	  <div className = "bg-white left-0">
// 		<div className ="description-panel bg-white absolute z-50 inset-y-0 right-0 rounded-md flex flex-col m-4">
// 			<p>DATA PAGE</p>
// 			<img src = {plot} alt = "Sample Plot"/>
// 		</div>
		
// 	  </div>
//   );
// }

// export default Data;

// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; /*needed to change from Switch to Routes and change overall structure*/
import './App.css';

import Home  from './components/Home';
import GraphDay from './components/GraphDay';
import LiveData from './components/LiveData';


function Data() {
  return (
    <BrowserRouter>
        <Routes> 
            <Route exact path ="/" element={<Home />}/>
            <Route exact path = "/HistoricalData" element={
              <GraphDay
                table={"apollo15int"}
                title={"Magnetic Data 1971-8-01 to 1972-09-20"}
                startingDate={'1971-8-01 PST'}
                maxDate={'1972-09-20 PST'}
              />}
            />
            <Route exact path = "/LiveData" element={
              <LiveData
                table={"apollo15int"}
                title={"Live Data"}
                startingDate={'1971-8-01 11:00:00 PST'}
                maxDate={'1972-09-20 PST'}
              />}
            />
        </Routes>
    </BrowserRouter>
  );
}

export default Data;
