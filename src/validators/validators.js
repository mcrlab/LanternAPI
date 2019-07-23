import LightDataError from '../exceptions/LightDataError';

export function colorValidator(color) {
    if(!color.match(/[0-9A-Fa-f]{6}/)){
        throw new LightDataError(400, 'Color is not in the correct format');
    }
    return color;
}

export function timeValidator(time){
    if(time >= 0 && time < 10){
        return time;
    } else {
        throw new LightDataError(400, "Animation time is not defined");
    }
}