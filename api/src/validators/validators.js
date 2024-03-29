import LightDataError from '../exceptions/LightDataError';

export function positionValidator(position){
    if(position < 0){
        throw new LightDataError(400, 'Position is not greater than 0');
    }
    return position;
}

export function colorValidator(color) {
    if(!color.match(/[0-9A-Fa-f]{6}/)){
        throw new LightDataError(400, 'Color is not in the correct format');
    }
    return color;
}

export function timeValidator(time){
    time = parseInt(time);
    if(isNaN(time)){
        return 10
    } else if(time >= 0 && time <= 10000){
        return time;
    } else {
        throw new LightDataError(400, "Animation is not between 0 and 10000");
    }
}

export function delayValidator(delay){
    if(delay === undefined){
        return 0
    } else if(delay >= 0 && delay <= 10000){
        return delay;
    } else {
        throw new LightDataError(400, "Delay is not between 0 and 10000");
    }
}

export function easingValidator(easing){
    if(false){
        throw new LightDataError(400, "Easing function isn't valid");
    } 
    return easing;
}  
