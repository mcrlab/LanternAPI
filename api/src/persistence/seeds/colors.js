const Colors = require("../colors");

const colorSeed = [{
        "name": "red",
        "hex":'B80000',
    },
    {
        "name": "orange",
        "hex":'DB3E00'
    },
    {
        "name": "yellow",
        "hex":'FCCB00'
    },
    {
        "name": "green",
        "hex": '008B02'
    },
    {
        "name": "teal",
        "hex": '006B76'
    },
    {
        "name": "light blue",
        "hex": '1273DE'
    },
    {
        "name": "blue",
        "hex": '004DCF',
    },
    {
        "name": "purple",
        "hex": '5300EB'
    }
];

let seed = async function(){
    console.log("seeding colours")
    for( let i = 0; i < colorSeed.length; i++){
        let color = colorSeed[i];
        console.log("Inserting ", color['name']);
        await Colors.insert(color['name'], color['hex'])
    }
    console.log("done");
}

seed();