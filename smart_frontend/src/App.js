// import logo from './logo.svg';
// import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'; /*needed to change from Switch to Routes and change overall structure*/
// import './App.css';

// import Home  from './pages/components/Home';
// import GraphDay from './pages/components/GraphDay';
// import LiveData from './pages/components/LiveData';
// import TestGraph from './pages/TestGraph'


// function App() {
//   return (
//     <HashRouter>
//         <Routes> 
//             <Route exact path ="/" element={<Home />}/>
//             <Route exact path = "/TestGraph" element ={
//               <TestGraph/>
//             }
//             />
//             <Route exact path = "/HistoricalData" element={
//               <GraphDay
//                 table={"apollo15int"}
//                 title={"Magnetic Data 1971-8-01 to 1972-09-20"}
//                 startingDate={'1971-8-01 PST'}
//                 maxDate={'1972-09-20 PST'}
//               />}
//             />
//             <Route exact path = "/LiveData" element={
//               <LiveData
//                 table={"apollo15int"}
//                 title={"Live Data"}
//                 startingDate={'1971-8-01 11:00:00 PST'}
//                 maxDate={'1972-09-20 PST'}
//               />}
//             />
//         </Routes>
//     </HashRouter>
//   );
// }

// export default App;
