import { timeValidator, colorValidator } from './validators';
import LightDataError from '../exceptions/LightDataError';
import { isTSAnyKeyword, exportAllDeclaration } from '@babel/types';

describe("timeValidator", ()=> {
    test('it should return the time if greater than 0', ()=> {
        expect(timeValidator(1)).toBe(1);
    });

    test("it should throw an error if the time is less than 0", () => {
        const t = () => {
        timeValidator(-1);
        };
        expect(t).toThrow(LightDataError);
    });

    test("it should throw an error if the time is greater than 10", () => {
        const t = () => {
            timeValidator(11);
        };
        expect(t).toThrow(LightDataError);
    })
});

describe("colorValidator", ()=> {
    test("it should return the colour if valid RGB hex value", () => {
        expect(colorValidator("BADA55")).toBe("BADA55");
    });
    test("it should throw a LightDataError if the colour is invalid", ()=> {
        const t = () => {
            colorValidator("BADCOLOR");
        };
        expect(t).toThrow(LightDataError);
    })
});