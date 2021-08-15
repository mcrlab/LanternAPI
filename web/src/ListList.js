import React from "react";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
export default class LightList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            "lights": []
        }
    }

    componentDidMount(){
        fetch(`/lights`,{
            method : "GET",
            })
          .then(response=> {
            return response.json();
          })
          .then(json => {
              this.setState({
                  lights: json
              })
          });
    }

    render(){
        let lights = [];

        this.state.lights.map(light => {
            lights.push((<ListItem> <ListItemText primary={light.id} /></ListItem>))
        })

        return (
        <List>
            <Divider />
            {lights}
        </List>
        )
    }
}