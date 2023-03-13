// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode> //For Dev, components render twice --> https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
//     <App />
//   // </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Data from "./pages/Data";
import SearchPage from "./pages/SearchPage";
import NoPage from "./pages/NoPage";
import reportWebVitals from './reportWebVitals';
import LiveData from "./pages/components/LiveData";
import GraphDay from "./pages/components/GraphDay";
import TestGraph from "./pages/TestGraph"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="SearchPage" element={<SearchPage />} />
          <Route path="TestGraph" element={<TestGraph />} />
          {/* <Route path="Data" element={<Data />} /> */}
          <Route path="*" element={<NoPage />} />
          {/* <Route exact path = "/HistoricalData" element={
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
            /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();