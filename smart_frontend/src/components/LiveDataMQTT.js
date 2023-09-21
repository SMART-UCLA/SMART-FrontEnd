import React, { useState, useEffect, useRef } from 'react';
import {Tabs, Tab, TextField} from '@mui/material'
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

const LiveDataMQTT = (props) => {

  const currentDate = new Date();
  const [bx, setBx] = useState([]);
  const [by, setBy] = useState([]);
  const [bz, setBz] = useState([]);
  const [lastDate, setLastDate] = useState(new Date(props.startingDate));
  const [noDataMsg, setNoDataMsg] = useState("Awaiting data");
  const [currTabValue, setTabValue] = useState(null);
  // const [currTopic, setTopic] = useState(null);
  const [topicToSample, setSampleTopic] = useState(null);
  const topicToSampleRef = useRef(topicToSample);
  topicToSampleRef.current = topicToSample;
  const currTopic = useRef(null);


  const chartComponent = useRef(null);

  async function requestData() {
    console.log("requesting data");
    // console.log(topicToSampleRef.current);
      try {
          if (topicToSampleRef.current) {
            console.log(topicToSampleRef.current)
        //   const callData = { table, year, month, day, hour, minute, second }; //need to add minute
            const response = await Axios.get(`http://localhost:8080/getlivedata/${topicToSampleRef.current}`);
            const currTime = response.data.t ? response.data.t * 1000 : undefined;
            console.log(currTime);
            const xPoint = [currTime, response.data.x];
            const yPoint = [currTime, response.data.y];
            const zPoint = [currTime, response.data.z];
            console.log("response: " + JSON.stringify(response));
  
            let chart = chartComponent.current.chart; 
            const shift = chart.series[0].data.length > 100;
  
            if (currTime !== undefined && (chart.series[0].data.length === 0 || !(currTime === chart.series[0].points.slice(-1)[0].x))) {
                chart.series[0].addPoint(xPoint, true, shift);
                chart.series[1].addPoint(yPoint, true, shift);
                chart.series[2].addPoint(zPoint, true, shift);
            }
          }

          setTimeout(requestData, 1000);

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
      type: 'datetime',
    },
    time: {
      timezoneOffset: 7*60
      
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
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to days
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
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to days
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
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to sec onds
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
        load: requestData
      }
    },
    tooltip: {
        pointFormatter: function() { return `${this.y} nT` }
    }
  };

  const handleChange = (_, value) => {
    let chart = chartComponent.current.chart; 
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
    setTabValue(value);
}

const handleSubmit = (event) => {
  event.preventDefault();
  console.log("submitted")
  // setTopic(topic.current.value);
  setSampleTopic(currTopic.current.value.slice());
  console.log(topicToSample);
}

    return (
    <div style={{position: 'relative'}}>
        <Tabs onChange={handleChange} value={currTabValue}>
            <Tab label='Bx' value='1'/>
            <Tab label='By' value='2'/>
            <Tab label='Bz' value='3'/>
        </Tabs>
        <form onSubmit={handleSubmit}>
          {/* <TextField onChange={e => setTopic(e.target.value)} value={currTopic}/> */}
          <TextField inputRef={currTopic}/>
        </form>
        <text>Current Topic: {topicToSample}</text>
        <HighchartsReact
        ref={chartComponent}
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        />
    </div>
    );

};

export default LiveDataMQTT;