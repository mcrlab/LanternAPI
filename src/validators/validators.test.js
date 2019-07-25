import { timeValidator } from './validators';
import LightDataError from '../exceptions/LightDataError';

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
