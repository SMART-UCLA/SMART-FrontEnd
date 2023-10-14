import React, { useState, useEffect, useRef } from 'react';
import {Tabs, Tab, TextField, Button, Grid} from '@mui/material'
import { render } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Boost from 'highcharts/modules/boost';
import Axios from 'axios';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import {useParams} from "react-router-dom"
import { useNavigate } from "react-router-dom";


// import "./customDatePicker.css";
import noDataToDisplay from 'highcharts/modules/no-data-to-display';
// init the module
noDataToDisplay(Highcharts);
Boost(Highcharts);
const MOVING_AVG_COUNT = 5;
const backend_endpoint = "https://smart-323315.uc.r.appspot.com"; //production endpoint
// const backend_endpoint = "http://localhost:8080"; //dev endpoint

const LiveDataMQTT = (props) => {
  const navigate = useNavigate();

  const currentDate = new Date();
  const [bx, setBx] = useState([]);
  const [by, setBy] = useState([]);
  const [bz, setBz] = useState([]);
  const [bxAvg, setBxAvg] = useState([]);
  const [byAvg, setByAvg] = useState([]);
  const [bzAvg, setBzAvg] = useState([]);
  // let bx;
  // let by;
  // let bz;
  // let bxAvg;
  // let byAvg;
  // let bzAvg;
  const [lastDate, setLastDate] = useState(new Date(props.startingDate));
  const [noDataMsg, setNoDataMsg] = useState("Awaiting data");
  const [currTabValue, setTabValue] = useState('0');
  // const [currTopic, setTopic] = useState(null);
  const [topicToSample, setSampleTopic] = useState(null);
  const topicToSampleRef = useRef(topicToSample);
  topicToSampleRef.current = topicToSample;
  const currTopic = useRef(null);
  // const topicChanged = useRef(false);

  const {topic} = useParams([]);
  const {granularity} = useParams([]);
  

  const chartComponent = useRef(null);

  let chart;

  useEffect(() => {
    chart = chartComponent.current.chart;
    if (chart) {
      getData();
    }
  }, [chartComponent])

  

  async function getData() {
    // while (!chart) {
    //   console.log("bruh")
    // }
    const response = await Axios.get(`${backend_endpoint}/getcurrentdata/${topic}/${granularity}`);
    for (const dp of response.data) {
      console.log(dp)
      // const currTime = dp.t ? dp.t * 1000 : undefined;
      // const xPoint = [currTime, dp.x];
      // const yPoint = [currTime, dp.y];
      // const zPoint = [currTime, dp.z];
      addPoint(dp, false);
    }
    chart.redraw();
    console.log("bruh")
    await requestData();
  }

  function addPoint(data, redraw) {
    console.log(data)
    // let chart = chartComponent?.current?.chart; 
    const currTime = data.t ? data.t * 1000 : undefined;
    const xPoint = [currTime, data.x];
    const yPoint = [currTime, data.y];
    const zPoint = [currTime, data.z];
    const shift = chart.series[0].data.length > 500;
    chart.series[0].addPoint(xPoint, redraw, shift);
    chart.series[1].addPoint(yPoint, redraw, shift);
    chart.series[2].addPoint(zPoint, redraw, shift);

    // if (chart.series[0].points.length >= MOVING_AVG_COUNT) {
    if (data.hasOwnProperty("xAvg")) {
      const xAvg = [currTime, data.xAvg]; // moving average
      const yAvg = [currTime, data.yAvg];
      const zAvg = [currTime, data.zAvg];
      chart.series[3].addPoint(xAvg, redraw, shift);
      chart.series[4].addPoint(yAvg, redraw, shift);
      chart.series[5].addPoint(zAvg, redraw, shift);
    }
        // console.log(chart.series[3].points);
        // console.log(chart.series[4].points);
        // console.log(chart.series[5].points);
    // }
  }

  async function requestData() {
    // let chart = chartComponent?.current?.chart; 

    // console.log("requesting data");
    // console.log(topicToSampleRef.current);
      try {
          // if (topicChanged.current) {
          //   topicChanged.current = false;
          //   console.log("resetting")
          //   chart.series[0].setData([]);
          //   chart.series[1].setData([]);
          //   chart.series[2].setData([]);
          // }
          // if (topicToSampleRef.current) {
            // console.log(topicToSampleRef.current)
        //   const callData = { table, year, month, day, hour, minute, second }; //need to add minute
            const response = await Axios.get(`${backend_endpoint}/getlivedata/${topic}/${granularity}`);
            const currTime = response.data.t ? response.data.t * 1000 : undefined;
            // console.log(currTime);
            // const xPoint = [currTime, response.data.x];
            // const yPoint = [currTime, response.data.y];
            // const zPoint = [currTime, response.data.z];
            // console.log("response: " + JSON.stringify(response));
  
            // const shift = chart.series[0].data.length > 100;
            // console.log(chart.series[0].points);
            if (currTime !== undefined && (chart.series[0].points.length === 0 || !(currTime === chart.series[0].points.slice(-1)[0].x))) {

              addPoint(response.data, true);
            }
            // console.log(xAvg, yAvg, zAvg);

            // console.log(chart.series[0].points)


        }
        catch (err) {
          console.log("ERROR");
          console.log(err.message);
        }
        setTimeout(requestData, 1000);
  }

  

  const options = {
    // plotOptions: {
    //   series: {turboThreshold: 0}
    // },
    title: {
      text: props.title
    },
    legend: {
      enabled: true
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
      },
      {
        data: bxAvg,
        //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
        marker: {
          enabled: true,
          radius: 2
        },
        color: '#ffcccb',
        name: 'BxAvg',
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to sec onds
      },
      {
        data: byAvg,
        //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
        marker: {
          enabled: true,
          radius: 2
        },
        color: '#add8e6',
        name: 'ByAvg',
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to sec onds
      },
      {
        data: bzAvg,
        //data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9, 4, 5, 10, 5, 1, 2, 3, 6, 2, 9, 5, 7, 2],
        marker: {
          enabled: true,
          radius: 2
        },
        color: '#90ee90',
        name: 'BzAvg',
        // pointStart: startDate.getTime(),
        
        //describes the interval or time between each point
        //set in milliseconds so 1000 => one second
        // pointInterval: 1000 //pointInterval set to sec onds
      },
    ],
    rangeSelector: {
        inputEnabled: true,
        selected: granularity === "s" ? 6 : 4,
        buttons: [
          {
            type: 'all',
            text: 'all',
            title: 'View all'
          },
          {
            type: 'day',
            count: 3,
            text: '3d',
            title: 'View 3 days'
          },
          {
            type: 'day',
            count: 1,
            text: '1d',
            title: 'View 1 day'
          },
          {
            type: 'hour',
            count: 1,
            text: '1h',
            title: 'View 1 hour'
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
      // events: {
      //   load: getData
      // }
    },
    tooltip: {
        pointFormatter: function() { return `${this.y} nT` }
    }
  };

  const handleChange = (_, value) => {
    let chart = chartComponent.current.chart; 
    switch (value) {
        case '0':
            chart.series[0].show(); chart.series[0].update({showInNavigator: true, showInLegend: true});
            chart.series[1].show(); chart.series[1].update({showInNavigator: true, showInLegend: true});
            chart.series[2].show(); chart.series[2].update({showInNavigator: true, showInLegend: true});
            chart.series[3].show(); chart.series[3].update({showInNavigator: true, showInLegend: true});
            chart.series[4].show(); chart.series[4].update({showInNavigator: true, showInLegend: true});
            chart.series[5].show(); chart.series[5].update({showInNavigator: true, showInLegend: true});
            break;
        case '1':
            chart.series[0].show(); chart.series[0].update({showInNavigator: true, showInLegend: true});
            chart.series[1].hide(); chart.series[1].update({showInNavigator: false, showInLegend: false});
            chart.series[2].hide(); chart.series[2].update({showInNavigator: false, showInLegend: false});
            chart.series[3].show(); chart.series[3].update({showInNavigator: true, showInLegend: true});
            chart.series[4].hide(); chart.series[4].update({showInNavigator: false, showInLegend: false});
            chart.series[5].hide(); chart.series[5].update({showInNavigator: false, showInLegend: false});
            break;
        case '2':
            chart.series[0].hide(); chart.series[0].update({showInNavigator: false, showInLegend: false});
            chart.series[1].show(); chart.series[1].update({showInNavigator: true, showInLegend: true});
            chart.series[2].hide(); chart.series[2].update({showInNavigator: false, showInLegend: false});
            chart.series[3].hide(); chart.series[3].update({showInNavigator: false, showInLegend: false});
            chart.series[4].show(); chart.series[4].update({showInNavigator: true, showInLegend: true});
            chart.series[5].hide(); chart.series[5].update({showInNavigator: false, showInLegend: false});
            break;
        case '3': 
            chart.series[0].hide(); chart.series[0].update({showInNavigator: false, showInLegend: false});
            chart.series[1].hide(); chart.series[1].update({showInNavigator: false, showInLegend: false});
            chart.series[2].show(); chart.series[2].update({showInNavigator: true, showInLegend: true});
            chart.series[3].hide(); chart.series[3].update({showInNavigator: false, showInLegend: false});
            chart.series[4].hide(); chart.series[4].update({showInNavigator: false, showInLegend: false});
            chart.series[5].show(); chart.series[5].update({showInNavigator: true, showInLegend: true});
            break;
    }
    setTabValue(value);
}

const handleSubmit = (event) => {
  setTabValue('0');
  event.preventDefault();
  let chart = chartComponent.current.chart; 
  // while(chart.series.length > 0){
  //   chart.series[0].remove(true);
  //   chart.series[1].remove(true);
  //   chart.series[2].remove(true);
  // }
  chart.destroy();
  chart.redraw();
  // topicChanged.current = true;
  console.log("submitted")
  // setTopic(topic.current.value);
  setSampleTopic(currTopic.current.value.slice());
  // console.log(topicToSample);

}

    return (
    <div style={{position: 'relative'}}>
        <Grid container>
          <Grid container xs={6}>
            <Grid item xs={12}  style={{textAlign: "center"}}>
              <text>Data to show:</text>
            </Grid>
            <Grid item xs={12}  style={{alignContent: "center"}}>
              <Tabs onChange={handleChange} value={currTabValue} centered>
                <Tab label='All' value='0'/>
                <Tab label='Bx' value='1'/>
                <Tab label='By' value='2'/>
                <Tab label='Bz' value='3'/>
              </Tabs>
            </Grid>
           </Grid> 
          <Grid container xs={6}>
            <Grid item xs={12}  style={{textAlign: "center"}}>
              <text>Granularity (currently {granularity == "s" ? "1 second" : granularity == "m" ? "1 minute" : granularity == "10m" ? "10 minutes" : "1 hour"}):</text>
            </Grid>
            <Grid item xs={12}  style={{textAlign: "center"}}>
              <Button title="1 second" onClick={() => {navigate(`/LiveDataMQTT/${topic}/s`); window.location.reload();}}>1 second</Button>
              <Button title="1 minute" onClick={() => {navigate(`/LiveDataMQTT/${topic}/m`); window.location.reload();}}>1 minute</Button>
              <Button title="10 minutes" onClick={() => {navigate(`/LiveDataMQTT/${topic}/10m`); window.location.reload();}}>10 minutes</Button>
              <Button title="1 hour" onClick={() => {navigate(`/LiveDataMQTT/${topic}/h`); window.location.reload();}}>1 hour</Button>
            </Grid>

          </Grid>
        </Grid>
        {/* <form onSubmit={handleSubmit}>
          <TextField inputRef={currTopic}/>
        </form> */}
        {/* <text>Current Topic: {topic}</text> */}
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