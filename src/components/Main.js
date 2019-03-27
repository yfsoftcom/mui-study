import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Topbar from './Topbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import RunIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';

import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import green from '@material-ui/core/colors/green';

const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['A500'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 20,
    padding: 20,
    paddingBottom: 200
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  consoleClose: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  console: {
    // height: 400,
    padding: 10,
  },
  consoleContent: {
    maxHeight: 400,
    minHeight: 200,
    overflowY: 'auto',
  },
  grid: {
    width: 1000
  },
  table: {
    minWidth: 700,
  },
})

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
class Main extends Component {

  state = {
    open: false,
    console: false,
    outputs: [
      'success',
      '0'
    ]
  };

  componentDidMount() {}

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname
    const { outputs } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth={ true }
          maxWidth={ 'sm'}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Shell Editor</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Script Name"
              type="text"
              variant="outlined"
              fullWidth
            />
            <DialogContentText>
              Edit the shell script file.
            </DialogContentText>
            <TextField
              variant="outlined"
              margin="dense"
              multiline
              rows="10"
              id="name"
              label="Script Content"
              type="text"
              fullWidth
            />


          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.root}>
          <Grid container justify="center"> 
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div>
                  <Button variant="contained" color="primary" className={classes.button} onClick={ this.handleClickOpen }>Create</Button>
                </div>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Shell Name</TableCell>
                        <TableCell align="right">Operation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="secondary" aria-label="Run" className={classes.margin}>
                              <RunIcon fontSize="small" color="action"/>
                            </IconButton>
                            <IconButton color="default" aria-label="Edit" className={classes.margin}>
                              <EditIcon fontSize="small" color="default" />
                            </IconButton>
                            <IconButton color="secondary" aria-label="Delete" className={classes.margin}>
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </div>
      
        <Fab className={ classNames(classes.fab, classes.fabGreen) } color={ green[500] }
          onClick={ this.toggleDrawer('console', true) }
        >
          { <UpIcon />}
        </Fab>
        <SwipeableDrawer
          anchor="bottom"
          open={this.state.console}
        >
          <div
            tabIndex={0}
            role="button"
            className={ classes.console }
            // onClick={this.toggleDrawer('console', false)}
            // onKeyDown={this.toggleDrawer('console', false)}
            
          >
            <Fab className={ classes.consoleClose } onClick={ this.toggleDrawer('console', false) }>
              <DownIcon />
            </Fab>
            <h3>Console</h3>
            <div className= { classes.consoleContent }>
              {
                outputs.map( (output, index) => {
                  return (
                    <pre key={`output-${index}`}>
                      {output}
                    </pre>
                  )
                })
              }
              
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Main);
