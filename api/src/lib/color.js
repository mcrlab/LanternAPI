
export function HexToRGBObject(hexInput){
    let red = hexInput.substring(0,2);
    let green = hexInput.substring(2,4);
    let blue = hexInput.substring(4,6);

    let output = {};
    output.r = parseInt(red, 16);
    output.g = parseInt(green, 16);
    output.b = parseInt(blue, 16);

    return output;
}

export function RGBObjectToHex(colorObject){
    let hex = [];
    hex.push(intToHex(colorObject.r));
    hex.push(intToHex(colorObject.g));
    hex.push(intToHex(colorObject.b));
    return hex.join('');
}
  
export  function intToHex(color){
    let char = color.toString(16);
    if(char.length == 1){
      char = "0"+char;
    }
    return char.toUpperCase();
  }