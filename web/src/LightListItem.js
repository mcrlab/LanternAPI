import React from "react";
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

export default class LightListItem extends React.Component {
    constructor(props){
        super(props)
        this.updateFirmware = this.updateFirmware.bind(this);
    }
    updateFirmware(){
        console.log(this.props.light.id);
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
                  </ListItemSecondaryAction>
                </ListItem>
            </div>
        )
    }
}