import {toRGBObject, intToHex} from './color';

describe("toRGBObject", ()=> {
    test('it should return an object', ()=> {
        expect(toRGBObject("FF0000")).toEqual({"r":255,"g":0,"b":0});
    });
});

describe("intToHex", ()=> {
    test("it should pad strings with 0", ()=>{
        expect(intToHex(1)).toEqual("01");
    });
})