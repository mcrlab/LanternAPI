
const LightMQTT = (color, easing, time, delay) => {
    let data = {
        color: color,
        easing: easing || "SineEaseInOut",
        time: time || 0,
        delay: delay || 0
    };
    return JSON.stringify(data);
} 

export default  LightMQTT;