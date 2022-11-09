import React, { useState, useEffect } from 'react';
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


const LiveData2 = (props) => {

  const currentDate = new Date();
  const [bx, setBx] = useState([]);
  const [by, setBy] = useState([]);
  const [bz, setBz] = useState([]);
  const [lastDate, setLastDate] = useState(new Date(props.startingDate));
  const [noDataMsg, setNoDataMsg] = useState("Awaiting for data");

  async function getData(table, year, month, day) {
    try {
    const callData = { table, year, month, day };
    await Axios.get("http://localhost:8080/getMagDataDay", {params: {table, year, month, day}}).then((response) => {
      console.log(response);

      let bxArr = response.data.map(entry => parseInt(entry.b_x)); //convert from string to int
      let byArr = response.data.map(entry => parseInt(entry.b_y));
      let bzArr = response.data.map(entry => parseInt(entry.b_z));

      console.log(bxArr.slice(0, 100));
      console.log([1,2,3,4,5]);
      // console.log("by" + bxArr);
      // console.log("bz" + bxArr);

      setBx(bxArr);
      setBy(byArr);
      setBz(bzArr);
      })
    }
    catch (err) {
      console.log("ERROR");
      console.log(err.message);
    }
  }

  //Getting the data if exist
  useEffect(() => {
    setNoDataMsg("Awaiting for data")
    setBx([])
    setBy([])
    setBz([])
    console.log("STARTING DATE IS", startDate)
    getData(props.table, startDate.getFullYear(), (startDate.getMonth() + 1), startDate.getDate())
  }, [props.table, startDate])
  
    //Check if data was collected on a certain day
  useEffect(() => {
    if (bx.length !== 0) {
        console.log("BX LENGTH", bx.length)
        setNoDataMsg("No data collected on this day")
    }
  }, [bx])

  //Idea: send 
  async function requestData() {
      try {
          const callData = { table, year, month, day, hour, minute, second }; //need to add minute
          await Axios.get("http://localhost:8080/getMagDataMinute", {params: {table, year, month, day, minute, second}}).then((response) => {

          
            let bxArr = response.data.map(entry => parseInt(entry.b_x)); //convert from string to int
            let byArr = response.data.map(entry => parseInt(entry.b_y));
            let bzArr = response.data.map(entry => parseInt(entry.b_z));

            let chart = this.refs.chart.getChart();  
            
            for (let i = 0; i < bxArr.length; i++) {
              chart.series[0].addPoint(bxArr[i], true, true);
            }
            setTimeout(requestData, 1000 * 5);

          })
          }
        catch (err) {
          console.log("ERROR");
          console.log(err.message);
        }
  }

  

  const options = {
    // plotOptions: {
    //   series: {turboThreshold: 0}
    // },
    title: {
      text: props.title
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
          enabled: true,
          radius: 2
        },
        color: 'red',
        name: 'Bx',
        pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        pointInterval: 1000 //pointInterval set to days
      },
      {
        data: by,
        //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
        marker: {
          enabled: true,
          radius: 2
        },
        color: 'blue',
        name: 'By',
        pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        pointInterval: 1000 //pointInterval set to days
      },
      {
        data: bz,
        //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
        marker: {
          enabled: true,
          radius: 2
        },
        color: 'green',
        name: 'Bz',
        pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        pointInterval: 1000 //pointInterval set to sec onds
      }
    ],
    rangeSelector: {
        inputEnabled: true,
        buttons: [
          {
            type: 'all',
            text: '1d',
            title: 'View 1 day'
          },
          {
          type: 'minute',
          count: 10,
          text: '10m',
          title: 'View 10 minutes'
          },
          {
            type: 'minute',
            count: 1,
            text: '1m',
            title: 'View 1 minutes'
          },
          {
            type: 'second',
            count: 30,
            text: '30s',
            title: 'View 30 seconds'
          },
      ]
      },
    chart: {
      zoomType: 'x',
      height: '40%',
      events: {
        load: requestData()
      }
    } 
  };

    return (
    <div style={{position: 'relative'}}>
        <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        />
    </div>
    );

};

export default LiveData2;