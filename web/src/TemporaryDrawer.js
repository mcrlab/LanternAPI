import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import ToolBar from './ToolBar';
const useStyles = makeStyles({

  list: {
    width: "400px",
  },
  fullList: {
    width: 'auto',
  },
  menu: {
      position: 'fixed',
      left: 0,
      top: 0
  }
});

export default function TemporaryDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, 'open': open });
  };

  return (
    <div>
        <div className={classes.menu}>
            <IconButton onClick={toggleDrawer(true)} color="primary"><MenuIcon /></IconButton>
        </div>
        <Drawer anchor={'left'} open={state['open']} onClose={toggleDrawer(false)}>
            <ToolBar dragMode={props.dragMode} setDragMode={props.setDragMode} showNames={props.showNames} setShowNames={props.setShowNames} handleOpen={props.handleSettings} lights={props.lights} />
        </Drawer>
    </div>
  );
}
