import React from 'react';
import './css/App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Graphic from './Graphic';
import Light from './Light';
import TemporaryDrawer from './TemporaryDrawer';
import { CirclePicker } from 'react-color';
import { withStyles } from '@material-ui/styles';



const styles = theme =>({
  
  picker: {
    position: "fixed",
    bottom: 0,
    width:'100%',
    padding: '10px'
  }

});

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        lights: [],
        dragMode: false,
        showNames: false,
        showStatus: true,
        color: 'b80000',
        colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']
    };
    this.tick = this.tick.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setDragMode = this.setDragMode.bind(this);
    this.setShowNames = this.setShowNames.bind(this);
    this.setShowStatus = this.setShowStatus.bind(this);
    this.connect = this.connect.bind(this);
    this.interval = null;


  }
  
  tick() {
    const rotation = this.state.rotation + 0.04;
    this.setState({ rotation });
    requestAnimationFrame(this.tick);
  }

  updateDimensions() {
    let update_width  = window.innerWidth;
    let update_height = window.innerHeight;
    this.setState({ width: update_width, height: update_height });
  }

  connect(){
    if(this.interval){
      clearTimeout(this.interval);
    }
    this.client = new W3CWebSocket(`ws://${window.location.hostname}/lights`);

    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    this.client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      let lights = this.state.lights;
      switch(dataFromServer.instruction){
        case 'ALL_LIGHTS':
          let allLights = [];
          dataFromServer.data.lights.forEach((lightData)=>{
            let light = new Light(lightData.id, lightData.color, lightData.position);
            allLights.push(light);
          });
          this.setState({
            lights: allLights
          });
          break;
        case 'UPDATE_LIGHT':
            
            let updated = lights.map((item) => {
              if (item.id ===dataFromServer.data.id) {
                item.update(dataFromServer.data.color, dataFromServer.data.position, dataFromServer.data.time, dataFromServer.data.delay);
              }
              return item
             
            });
            this.setState({
              lights: updated
            });

            break;
          case 'ADD_LIGHT':
              let newLight = new Light(dataFromServer.data.id, dataFromServer.data.color, dataFromServer.data.position);
              lights.push(newLight);
              this.setState({
                lights: lights
              });
              break;
        default:
            break;
      }
    };
    
    this.client.onclose = (event) => {
      console.log('CLOSED');
      this.interval = setInterval(()=>{
        console.log("reconnecting");
        this.connect();
      }, 1000);
    }

    this.client.onerror = (event) => {
      console.log("ERROR");
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    this.connect();
    requestAnimationFrame(this.tick);
  }

  setDragMode(event) {
    this.setState({ 
      dragMode: !this.state.dragMode
    });
  }
  setColor(color){
    this.setState({ color: color.hex.replace('#','') });
  }

  setShowNames(){
    this.setState({
      showNames: !this.state.showNames
    });
  }

  setShowStatus(){
    this.setState({
      showStatus: !this.state.showStatus
    });
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render(){
    let classes = this.props.classes;
    let picker;
    if(!this.state.dragMode){
      picker = <div className={classes.picker} ><CirclePicker color={this.state.color} onChangeComplete={ this.setColor } width="100%" colors={this.state.colors}/></div>
    } 
    return (
      <div className="App">
          <Graphic dragMode={this.state.dragMode} showNames={this.state.showNames} showStatus={this.state.showStatus} color={this.state.color} lights={this.state.lights} width={this.state.width} height={this.state.height} />
          <TemporaryDrawer dragMode={this.state.dragMode} showNames={this.state.showNames} showStatus={this.state.showStatus} lights={this.state.lights} setShowNames={this.setShowNames}  setShowStatus={this.setShowStatus}  setDragMode={this.setDragMode} />
          {picker}
        </div>
    );
  }
}

export default withStyles(styles)(App);