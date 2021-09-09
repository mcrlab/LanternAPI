import React from "react";
import { Divider, List } from "@material-ui/core";
import LightListItem from "./LightListItem";
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
        let lights = this.props.lights.map(light => {
            return (<LightListItem light={light}/>)
        })

        return (
        <List>
            <Divider />
            {lights}
        </List>
        )
    }
}