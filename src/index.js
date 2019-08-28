import LightingController from './controllers/LightingController';
import MQTTBroker from './lib/mqtt';
import createApplication from './lib/application';
import LightStorage from './lib/LightStorage';
import http from 'http'
import WebSocket from 'ws';
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: process.env.DYNAMODB
});


async function createDB(){
  try {
      var dynamodb = new AWS.DynamoDB();
      var params = {
        TableName : "Lights",
        KeySchema: [       
            { AttributeName: "id", KeyType: "HASH"}
        ],
        AttributeDefinitions: [         
            { AttributeName: "id", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    };

    let response = await dynamodb.createTable(params).promise();
    console.log(response);    
  } catch(e){
    console.log("no db setup",e);
  }
}

function server(){
  const lightController = new LightingController(new MQTTBroker(), new LightStorage());

  const app    = createApplication(lightController);
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws) => {
    const allLights = await lightController.getAllLightsData();
    ws.send(JSON.stringify(
      {
        "instruction": "ALL_LIGHTS",
        "data": { "lights": allLights }
      }
    ));

    lightController.registerCallback((data)=>{
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(
            {
              "instruction": "UPDATE",
              "data": data
            }
          ));
        }
      });
    });
  
  });

  server.listen(process.env.PORT || '3001', '0.0.0.0', () => {
    console.log('received:');
  });
}
async function startApp(){
  await createDB();
  server();
}

startApp();