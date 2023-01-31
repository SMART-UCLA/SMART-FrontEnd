import React, { useState, useEffect, useRef } from 'react';
import {Tabs, Tab} from '@mui/material'
import { render } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Boost from 'highcharts/modules/boost';
import Axios from 'axios';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

// import "./customDatePicker.css";
import noDataToDisplay from 'highcharts/modules/no-data-to-display';
// init the module
noDataToDisplay(Highcharts);
Boost(Highcharts);

var chart;
const TestGraph = () => {

//   const [startDate, setStartDate] = useState(new Date(props.startingDate));
  const [bx, setBx] = useState([]);
  const [by, setBy] = useState([]);
  const [bz, setBz] = useState([]);
  const [timestamps, setT] = useState([]);
  const [noDataMsg, setNoDataMsg] = useState("");
  const [currTabValue, setValue] = useState(null);
  const chartComponent = useRef(null);

    async function getData() {
      try {
          const response = await Axios.get("http://localhost:8081/getlivegclouddata");
          console.log(response.data);
          let timestampArr = response.data.map(entry => parseFloat(entry.timestamp) * 1000) //s to ms
                                                                                            //TODO: times are currently relative
          let bxArr = response.data.map((entry, i) => [timestampArr[i], parseFloat(entry.nT1)]); //convert from string to float
          let byArr = response.data.map((entry, i) => [timestampArr[i], parseFloat(entry.nT2)]);
          let bzArr = response.data.map((entry, i) => [timestampArr[i], parseFloat(entry.nT3)]);

          // console.log(bxArr);
          // console.log("by" + bxArr);
          // console.log("bz" + bxArr);

          let isNan = 0;
          for (let step = 0; step < bxArr.length; step++) {
            if (isNaN(bxArr[step])) {
              isNan += 1;
            }
          }
        //   console.log(isNan);

          //If more than half the values are NaN or all values missing
          if (bxArr.length === 0 || isNan >= 86400 / 2) {
            chart.hideLoading();
            chart.showNoData("No data collected on this data");
            return;
          }

          
          setBx(bxArr);
        //   console.log(bx);
          setBy(byArr);
        //   console.log(by);
          setBz(bzArr);
        //   console.log(bz);
          setT(timestampArr);


          chart.hideLoading();
      }
      catch (err) {
        console.log("ERROR");
        console.log(err.message);
      }
    }

    useEffect(() => {
      chart = chartComponent.current.chart;
      chart.showLoading();
      getData();
      chart.series[0].hide();
      chart.series[1].hide();
      chart.series[2].hide();
    }, []);

    // //Sets the appropiate starting date for the first load
    // useEffect(() => {
    //   setStartDate(new Date(props.startingDate));
    // }, [props.startingDate])

    //Getting the data if exist
    // useEffect(() => {
    //   chart.showLoading();
    //   // setNoDataMsg("Awaiting for data");
    //   console.log("STARTING DATE IS", startDate)
    //   getData(props.table, startDate.getFullYear(), (startDate.getMonth() + 1), startDate.getDate())
    // }, [props.table, startDate])
    
      //Check if data was collected on a certain day
//     useEffect(() => {
//       if (bx.length == 0) {
//           console.log("BX LENGTH", bx.length);
//           setNoDataMsg("No data collected on this day");
// \      }
//     }, [bx])
  

    const options = {
        // plotOptions: {
        //   series: {turboThreshold: 0}
        // },
        title: {
          text: "Test"
        },
        lang: {
          noData: noDataMsg
        },
        boost: {
          useGPUTranslations: true
        },
        xAxis: {
          type: 'datetime'
        },
        time: {
          timezoneOffset: 8*60
        },
        series: [
          {
            data: bx,
            // data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
            marker: {
              enabled: false,
              radius: 2
            },
            color: 'red',
            name: 'Bx',
            // pointStart: timestamps[0],
            
            //describes the interval or time between each point
            //set in milliseconds so 1000 => one second
            // pointInterval: 1000 //pointInterval set to days
          },
          {
            data: by,
            //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
            marker: {
              enabled: false,
              radius: 2
            },
            color: 'blue',
            name: 'By',
            
            //describes the interval or time between each point
            //set in milliseconds so 1000 => one second
            // pointInterval: 1000 //pointInterval set to days
          },
          {
            data: bz,
            //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
            marker: {
              enabled: false,
              radius: 2
            },
            color: 'green',
            name: 'Bz',
            
            //describes the interval or time between each point
            //set in milliseconds so 1000 => one second
            // pointInterval: 1000 //pointInterval set to sec onds
          } 
        ],
        rangeSelector: {
            enabled: false
        },
        // rangeSelector: {
        //     selected: 0,
        //     inputEnabled: true,
        //     buttons: [
        //       {
        //         type: 'all',
        //         text: '1d',
        //         title: 'View 1 day'
        //       },
        //       {
        //       type: 'minute',
        //       count: 10,
        //       text: '10m',
        //       title: 'View 10 minutes'
        //       },
        //       {
        //         type: 'minute',
        //         count: 1,
        //         text: '1m',
        //         title: 'View 1 minutes'
        //       },
        //       {
        //         type: 'second',
        //         count: 30,
        //         text: '30s',
        //         title: 'View 30 seconds'
        //       },
        //   ]
        //   },
        chart: {
          zoomType: 'x',
          height: '40%'
        },
        tooltip: {
            pointFormatter: function() { return `${this.y} nT` }
        }
      };

      // const isValidDate = (date) => {
      //   date.getTime();
      //   const origDate = new Date(props.startingDate);
      //   const finalDate = new Date(props.maxDate);
      //   const bool = origDate.getTime() <= date.getTime() && date.getTime() <= finalDate.getTime();
      //   return bool;
      // }
    
    const handleChange = (_, value) => {
        switch (value) {
            case '1':
                chart.series[0].show(); chart.series[0].update({showInNavigator: true});
                chart.series[1].hide(); chart.series[1].update({showInNavigator: false});
                chart.series[2].hide(); chart.series[2].update({showInNavigator: false});
                break;
            case '2':
                chart.series[0].hide(); chart.series[0].update({showInNavigator: false});
                chart.series[1].show(); chart.series[1].update({showInNavigator: true});
                chart.series[2].hide(); chart.series[2].update({showInNavigator: false});
                break;
            case '3': 
                chart.series[0].hide(); chart.series[0].update({showInNavigator: false});
                chart.series[1].hide(); chart.series[1].update({showInNavigator: false});
                chart.series[2].show(); chart.series[2].update({showInNavigator: true});
                break;
        }
        setValue(value);
    }

    return (
    <div style={{ position: "relative" }}>
      {/* <div style={{ position: "absolute", zIndex: 1, top: 10, right: 5 }}>
        <DatePicker 
          selected={startDate}
          // filterDate={isValidDate}
          onChange={(date) => setStartDate(new Date(date))}
          minDate={new Date(props.startingDate)}
          maxDate={new Date(props.maxDate)}
        />
      </div> */}
      <Tabs onChange={handleChange} value={currTabValue}>
        <Tab label='Bx' value='1'/>
        <Tab label='By' value='2'/>
        <Tab label='Bz' value='3'/>
      </Tabs>
      <HighchartsReact
        ref={chartComponent}
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        />
    </div>
    );

};

export default TestGraph;