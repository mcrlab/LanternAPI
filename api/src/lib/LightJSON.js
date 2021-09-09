const LightJSON = (light) => {
    let data = {
        id: light.id,
        color: light.current_color,
        pixels: light.pixels,
        version: light.version,
        position: {
            x: light.x || 0.5,
            y: light.y || 0.5
        },
        sleep: light.sleep,
        last_updated: light.last_updated
    };
    
    return data;
}

export default LightJSON;