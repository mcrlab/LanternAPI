
import { HexToRGBObject } from './color';

const LightMQTT = (light, easing, time, delay, method) => {
    let data = {
        color: HexToRGBObject(light.current_color),
        easing: easing || "SineEaseInOut",
        time: time || 0,
        delay: delay || 0,
        method: method || "fill"
    };
    return JSON.stringify(data);
} 

export default  LightMQTT;