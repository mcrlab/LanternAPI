import React from "react";
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

export default class LightListItem extends React.Component {
    constructor(props){
        super(props)
        this.updateFirmware = this.updateFirmware.bind(this);
        this.deleteLight = this.deleteLight.bind(this);
    }
    updateFirmware(){
        console.log(this.props.light.id);
    }
    deleteLight(){
        fetch(`/lights/${this.props.light.id}/delete`,{
            method : "POST",
            headers: {
              "content-type": "application/json",
              "Authorization":'Basic ' + Buffer.from("lantern:password").toString('base64')
            },
            body: "{}"
            })
          .then(response=> {
            return response.json()
          })
          .then(json => {
              console.log(json);
          });
    }
    render(){
        return (
            <div>
                <ListItem>
                    <ListItemText primary={this.props.light.id} />
                    <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={this.updateFirmware}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={this.deleteLight}>
                            <DeleteIcon />
                        </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            </div>
        )
    }
}