const LightInstruction = (light, time, delay) => {
    let data = {
        id: light.id,
        color: light.current_color,
        time: time,
        delay: delay,
        position: {
            x: light.x || 0.5,
            y: light.y || 0.5
        }
    };
    return data;
}
export default LightInstruction;