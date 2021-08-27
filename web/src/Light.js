const LIGHT_WIDTH = 100;
const LIGHT_HEIGHT = 100;
const LIGHT_ICON = "light.png"

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function RGBObjectToHex(colorObject){
    let hex = [];
    hex.push(intToHex(colorObject.r));
    hex.push(intToHex(colorObject.g));
    hex.push(intToHex(colorObject.b));
    return hex.join('');
}

function intToHex(color){
  let char = color.toString(16);
  if(char.length === 1){
    char = "0"+char;
  }
  return char.toUpperCase();
}
  function lerp(a, b, u){
    return Math.floor((1-u) * a + u * b);
  };




export default class Light {

    constructor(id, color, position){
        this.id = id;
        this.previousColor = color;
        this.currentColor =  color;
        this.targetColor = color;
        this.position = position;
        this.animationTime = 0;
        this.animationDelay = 0;
        this.lastUpdateTime = new Date().getTime();
        this.isTouching = false;
        this.img = new Image();
        this.img.src = LIGHT_ICON;
    }


    update(color, position, animationTime, animationDelay){
      this.previousColor = this.currentColor;
      this.targetColor = color;
      this.animationTime = animationTime || 0;
      this.animationDelay = animationDelay  || 0
      this.position = position;
      this.lastUpdateTime = new Date().getTime();
    }

    setColor(color, time){
      
      if(color.toUpperCase() === this.currentColor.toUpperCase()){
        color = "000000"
      }

      fetch(`/lights/${this.id}`,{
          method : "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            "color": color,
            "time": time || 0,
            "delay": 0,
          })
        })
        .then(response=> {
          response.json()
        });
  }

    setPosition(update){
        this.currentColor = update.color;
        this.position.x = update.x;
        this.position.y = update.y;
        fetch(`/lights/${this.id}/position`,{
            method : "POST",
            headers: {
              "content-type": "application/json",
              "Authorization":'Basic ' + Buffer.from("lantern:password").toString('base64')
            },
            body: JSON.stringify(update)
            })
          .then(response=> {
            response.json()
          });
    }

    drawStatus(ctx, location){
      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 255, 0, 1)";
      ctx.arc(location.x + 25, location.y +35, 8, Math.PI*2, false);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.arc(location.x + 25, location.y +35, 8, Math.PI*2, false);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    paint(ctx, showNames, showStatus){
        const now = new Date().getTime();

        const animationStartTime = this.lastUpdateTime + this.animationDelay;
        const animationEndTime = animationStartTime + this.animationTime;
        const elapsedTime = now - animationStartTime;

        let object = {};
        if(now < animationStartTime){
          object = hexToRgb(this.currentColor);  
        } else if(now > animationStartTime && now < animationEndTime){

          let r = lerp( hexToRgb(this.previousColor).r, hexToRgb(this.targetColor).r, elapsedTime / this.animationTime);
          let g = lerp( hexToRgb(this.previousColor).g, hexToRgb(this.targetColor).g, elapsedTime / this.animationTime);
          let b = lerp( hexToRgb(this.previousColor).b, hexToRgb(this.targetColor).b, elapsedTime / this.animationTime);
          object = {r,g,b};
          this.currentColor = RGBObjectToHex(object);
        } else {
          this.currentColor = this.targetColor;
          object = hexToRgb(this.currentColor);         
        }

        let opacity = 1
        let radius = LIGHT_WIDTH * 0.22;
        var sizeWidth = ctx.canvas.clientWidth;
        var sizeHeight = ctx.canvas.clientHeight;

        let location = {
            x: sizeWidth * this.position.x,
            y: sizeHeight * this.position.y 
        };
    
        if(!this.isTouching){
          ctx.beginPath();
          ctx.fillStyle = "rgba("+object.r+", "+object.g+", "+object.b+", "+opacity+")";
          ctx.arc(location.x, location.y, radius, Math.PI*2, false);
          ctx.fill();

          ctx.drawImage(this.img, location.x - (LIGHT_WIDTH * 0.5), location.y-(LIGHT_HEIGHT * 0.35), LIGHT_WIDTH, LIGHT_HEIGHT);
          if(showStatus){
            this.drawStatus(ctx, location);
          }
          if(showNames){
            ctx.font = '15px serif';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(this.id, location.x, location.y + 80);
          }
        }
    }
}
