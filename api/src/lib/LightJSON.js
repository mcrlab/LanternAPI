const LightJSON = (light) => {
    let data = {
        id: light.id,
        color: light.color,
        version: light.version,
        platform: light.platform || "unknown",
        position: {
            x: light.x || 0,
            y: light.y || 0
        },
        voltage: light.voltage || -1,
        sleep: light.sleep,
        last_updated: light.last_updated,
        config: light.config
    };
    
    return data;
}

export default LightJSON;