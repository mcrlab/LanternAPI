const LightJSON = (light) => {
    let data = {
        id: light.id,
        color: light.color,
        version: light.version,
        position: {
            x: light.x || 0.5,
            y: light.y || 0.5
        },
        sleep: light.sleep,
        last_updated: light.last_updated,
        config: light.config
    };
    
    return data;
}

export default LightJSON;