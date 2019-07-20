import LightDataError from '../exceptions/LightDataError';

export function colorValidator(color) {
    if(!color.match(/[0-9A-Fa-f]{6}/)){
        throw new LightDataError(400, 'Color is not in the correct format');
    }
    return color;
}
