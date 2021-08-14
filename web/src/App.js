import React from 'react';
import './css/App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Graphic from './Graphic';
import Light from './Light';
import TemporaryDrawer from './TemporaryDrawer';
import { CirclePicker } from 'react-color';
import { withStyles } from '@material-ui/styles';

const client = new W3CWebSocket(`ws://${window.location.hostname}/lights`);

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
        rotation: 0,
        dragMode: false,
        showNames: false,
        color: 'b80000',
        optionsScreen: false,
        colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB']
    };
    this.tick = this.tick.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setDragMode = this.setDragMode.bind(this);
    this.setShowNames = this.setShowNames.bind(this);
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


  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      let lights = this.state.lights;
      switch(dataFromServer.instruction){
        case 'ALL_LIGHTS':
          let allLights = [];
          dataFromServer.data.lights.forEach((light)=>{
            let newLight = new Light(light.id, light.color, light.position);
            allLights.push(newLight);
          });
          this.setState({
            lights: allLights
          });
          break;
        case 'UPDATE_LIGHT':
            
            let updated = lights.map((item, index) => {
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
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  handleSettings(optionsScreen){
    this.setState({optionsScreen});
  }

  render(){
    let classes = this.props.classes;
    let picker;
    if(!this.state.dragMode){
      picker = <div className={classes.picker} ><CirclePicker color={this.state.color} onChangeComplete={ this.setColor } width="100%" colors={this.state.colors}/></div>
    } 
    return (
      <div className="App">
          <Graphic dragMode={this.state.dragMode} showNames={this.state.showNames} color={this.state.color} lights={this.state.lights} width={this.state.width} height={this.state.height} />
          <TemporaryDrawer dragMode={this.state.dragMode} showNames={this.state.showNames} setShowNames={this.setShowNames} setDragMode={this.setDragMode} />
          {picker}
        </div>
    );
  }
}
//
//<ToolBar />

export default withStyles(styles)(App);