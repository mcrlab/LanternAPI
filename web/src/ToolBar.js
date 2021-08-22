import React from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/styles';
import { List, ListItem, ListItemText, Divider, ListItemSecondaryAction } from '@material-ui/core';
import LightList from './ListList';
const styles = theme =>({
  
  list: {
    width: "250px"
  }

});

class ToolBar extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    const { classes } = this.props;

    return (
     <div className={classes.list}>

       <List>
         <ListItem>
         <ListItemText primary="Drag Mode" />
         <ListItemSecondaryAction>
            <Switch
              checked={this.props.dragMode}
              onChange={this.props.setDragMode}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </ListItemSecondaryAction>
         </ListItem>
         <ListItem>
         <ListItemText primary="ShowNames" />
         <ListItemSecondaryAction>
            <Switch
              checked={this.props.showNames}
              onChange={this.props.setShowNames}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </ListItemSecondaryAction>
         </ListItem>
       </List>
       <LightList lights={this.props.lights}/>
      </div>
    );
  }
}

export default withStyles(styles)(ToolBar);
