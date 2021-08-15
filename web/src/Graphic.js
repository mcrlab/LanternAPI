import React from 'react';
import Light from './Light';

export default class Graphic extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        x:0,
        y:0,
        hover: false,
        touching: false,
        touchingLight: null,
        color: "000000",
        debounce: new Date().getTime()
      }

      this.paint = this.paint.bind(this);
      
      this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
      this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
      this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
      
      this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
      this.handleOnMouseOut = this.handleOnMouseOut.bind(this);

      this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
      this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
      this.handleOnMouseUp = this.handleOnMouseUp.bind(this);

      this.touchStart = this.touchStart.bind(this);
      this.touchMove = this.touchMove.bind(this);
    }
  
    componentDidUpdate() {
      this.paint();
    }
  
    isTouchinglight(x,y){
      let filteredLights = this.props.lights.filter((light)=> {
        let lightX = light.position.x * this.props.width;
        let lightY = light.position.y * this.props.height;
        let a = (
          (x > (lightX-25) && x < (lightX + 25)) && 
          (y > (lightY-25) && y < (lightY + 25)) 
        );
        return a;
      });
      if(filteredLights.length > 0){
        return filteredLights[0]
      } else {
        return null
      }
    }

    handleOnTouchStart(event){

      const now = new Date().getTime();
      event.preventDefault();

      if(now < this.state.debounce + 100){
        return;
      }
      let x = event.touches[0].clientX;
      let y = event.touches[0].clientY;
      this.touchStart(x, y);
    }

    touchStart(x, y) {
      let scaledX = x / this.props.width;
      let scaledY = y / this.props.height;

      let light = this.isTouchinglight(x,y);

      if(this.props.dragMode){

        if(light){
          let currentColor = light.currentColor;
          light.setColor("FF0000", 500);
          this.setState({
            x: scaledX,
            y: scaledY,
            touching: true,
            touchingLight: light,
            color: currentColor
          });
    
        }
      } else {
        if(light){
          light.setColor(this.props.color, 1000);
        } else {

          let request = {
            color: this.props.color,
            time:  3000,
            delay: 1000,
            position: {
              x: scaledX,
              y: scaledY
            },
          }

          fetch(`/lights`,{
            method : "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(request)
          })
          .then(response=> response.json());
        }
      }
    }

    handleOnMouseOver(event){
      this.setState({
        hover: true
      });
    }
    
    handleOnMouseOut(event){
      this.setState({
        hover: false
      })
    }

    handleOnTouchMove(event){
      event.preventDefault();
      this.touchMove(event.touches[0].clientX, event.touches[0].clientY);
      
    }

    touchMove(x, y){
      let scaledX = ((x / this.props.width));
      let scaledY = ((y / this.props.height));
      this.setState({
        x: scaledX,
        y: scaledY,
        hover: true
      });
    }


    handleOnTouchEnd(event){
      const now = new Date().getTime();
      if(this.state.touchingLight){
        this.state.touchingLight.setPosition({x:parseFloat(this.state.x), y:parseFloat(this.state.y), color:this.state.color});
      }
      this.setState({
        touching: false,
        touchingLight: null,
        debounce: now
      });
      this.paint();
    }

    handleOnMouseUp(event){
      this.handleOnTouchEnd(event);
    }

    handleOnMouseMove(event){
      event.preventDefault();
      this.touchMove(event.clientX, event.clientY);
    }

    handleOnMouseDown(event){
      event.preventDefault();
      this.touchStart(event.clientX, event.clientY);
    }
    paint() {
      const { width, height } = this.props;
      const context = this.refs.canvas.getContext("2d");
      context.clearRect(0, 0, width, height);
      context.save();

      if(this.props.dragMode){
        context.textBaseline = 'middle';
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = "60px Arial";
        context.fillText("Drag Mode", width / 2, height / 2);
      }
      this.props.lights.forEach((lightPoint)=>{
        if(lightPoint !== this.state.touchingLight){
          lightPoint.paint(context, this.props.showNames);
        }
      });

      if(this.state.touching){
        new Light(this.state.touchingLight.id, "FF0000", {x: this.state.x, y: this.state.y}).paint(context, this.props.showNames)
      }

      if(this.state.hover){
        context.fillStyle = "#"+this.props.color;
        context.beginPath();
        context.arc(this.state.x * width, this.state.y * height, 10, Math.PI*2, false);
        context.closePath();
        context.fill();

      }

      context.restore();
    }
  
    render() {
      const { width, height } = this.props;
      return (
        <canvas
          onTouchStart={this.handleOnTouchStart}
          onTouchMove={this.handleOnTouchMove}
          onTouchEnd = {this.handleOnTouchEnd}
          onMouseDown = {this.handleOnMouseDown}
          onMouseMove = { this.handleOnMouseMove}
          onMouseUp = {this.handleOnMouseUp}
          onMouseEnter = {this.handleOnMouseOver}
          onMouseOut = {this.handleOnMouseOut}
          ref="canvas"
          width={width}
          height={height}
        />
      );
    }
  }