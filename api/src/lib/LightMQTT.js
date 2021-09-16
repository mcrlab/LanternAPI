
import { HexToRGBObject } from './color';

const LightMQTT = (color, easing, time, delay, method) => {
    let data = {
        color: HexToRGBObject(color),
        easing: easing || "SineEaseInOut",
        time: time || 0,
        delay: delay || 0,
        method: method || "fill"
    };
    return JSON.stringify(data);
} 

export default  LightMQTT;