import Light from '../models/Light';
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: process.env.DYNAMODB
});


export default class LightStorage {
    constructor(){
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }
    
    async get(id){

        var params = {
            TableName: "Lights",
            Key:{
                "id": id
            }
        };
        
        const response = await this.docClient.get(params).promise();
        if(response.Item){
            return new Light(response.id, response.Item.light);     
        } else {
            return null;
        }
    }

    async all(){
       let lights = []
       var params = {
            TableName: "Lights",
            ProjectionExpression: "light"
        };

        let result = await this.docClient.scan(params).promise();

        result.Items.forEach(function(data) {
            lights.push(new Light(data.light.id, data.light));
         });
         return lights;
    }

    async set(id, update){

        var params = {
            TableName: "Lights",
            Item: {
                "id":  id,
                "light": update
            }
        };
    
        const response = await this.docClient.put(params).promise();

        return new Light(id, update);
        
    }
    
}