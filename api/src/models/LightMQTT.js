
const LightMQTT = (light, easing, time, delay, method) => {
    let data = {
        color: light.current_color,
        easing: easing || "SineEaseInOut",
        time: time,
        delay: delay,
        method: method || "fill"
    };
    return JSON.stringify(data);
} 

export default  LightMQTT;