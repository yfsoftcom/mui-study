import React,  { Component } from 'react';
import _map from 'lodash/map';
import swal from '@sweetalert/with-react'

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
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import green from '@material-ui/core/colors/green';

import { Func } from 'fpmc-jssdk';

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
    maxHeight: 600,
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

const getDefaultEdit = () =>{ 
  return {
    title: '***.sh',
    content: '# /sh/bin\necho "oooops"',
  }
};
class Main extends Component {

  state = {
    open: false,
    console: false,
    scripts: {},
    edit: getDefaultEdit(),
    create: true,
    outputs: [

    ],
    loading: false,
  };

  componentDidMount() {
    const scripts = {};
    new Func('scripts.list')
      .invoke()
      .then(data => {
        data.map( item => {
          scripts[item] = ''
        })
        this.setState({ scripts });
      })

  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true, create: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (key ,val) => {
    const { edit } = this.state;
    edit[key] = val;
    this.setState({ edit })
  }

  handleSave = async () => {
    const sure = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to save this file?",
      icon: "warning",
      dangerMode: true,
    });
    if(!sure){ return; }
    const { create, edit } = this.state;
    this.setState({ open: false });
    new Func('scripts.save')
      .invoke({
        isCreate: create,
        ...edit
      })
      .then(rsp => {
        const { scripts } = this.state;
        scripts[edit.title] = '';
        this.setState({ scripts, edit: getDefaultEdit() })
      })
      .catch(error => {
        console.error(error);
        swal("Oops!", "Something went wrong!", "error");
      })
  };

  handleRun = async (name) => {
    const sure = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to execute this script?",
      icon: "warning",
      dangerMode: true,
    });
    if(!sure){ return; }
    const { outputs } = this.state;
    this.setState({
      console: true,
      loading: true,
    })
    new Func('scripts.run')
      .invoke({
        script: name,
      })
      .then(rsp => {
        outputs.unshift(rsp.data)
        this.setState({ outputs, loading: false })
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false })
        swal("Oops!", "Something went wrong!", "error");
      })
      
  }

  handleClean = () => {
    this.setState({
      outputs: []
    })
  }

  handleEdit = async (name) => {
    try {
      const rsp = await new Func('scripts.get').invoke({ script: name })
      this.setState({
        create: false,
        open: true,
        edit: {
          title: name,
          content: rsp
        }
      })
    } catch (error) {
      console.error(error);
      swal("Oops!", "Something went wrong!", "error");
    }
    
  }

  handleDelete = async(name) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this file?",
      icon: "warning",
      dangerMode: true,
    });
    if(willDelete){
      new Func('scripts.delete')
        .invoke({
          script: name
        })
        .then(rsp =>{
          const { scripts } = this.state;
          delete scripts[name];
          this.setState( { scripts })
        })
        .catch(error => {
          console.error(error);
          swal("Oops!", "Something went wrong!", "error");
        })
    }
    
  }
  render() {
    const { classes } = this.props;
    const { outputs, create, scripts, loading } = this.state;
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
              disabled={ !create }
              onChange={ (e) => this.handleChange('title', e.target.value) }
              id="name"
              value={this.state.edit.title}
              label="Script Title"
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
              onChange={ (e) => this.handleChange('content', e.target.value) }
              multiline
              value={this.state.edit.content}
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
                      { _map(scripts, (row, name) => {
                        return <TableRow key={ `script-${name}` }>
                          <TableCell component="th" scope="row">
                            {name}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="secondary" aria-label="Run" className={classes.margin} onClick={ () => this.handleRun(name) }>
                              <RunIcon fontSize="small" color="action"/>
                            </IconButton>
                            <IconButton color="secondary" aria-label="Edit" className={classes.margin} onClick={ () => this.handleEdit(name) }>
                              <EditIcon fontSize="small" color="secondary" />
                            </IconButton>
                            <IconButton color="secondary" aria-label="Delete" className={classes.margin} onClick={ () => this.handleDelete(name) }>
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      })
                    }
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </div>
      
        <Fab className={ classNames(classes.fab, classes.fabGreen) } color="primary"
          onClick={ this.toggleDrawer('console', true) }
        >
          { <UpIcon />}
        </Fab>
        <SwipeableDrawer
          anchor="bottom"
          open={this.state.console}
          onOpen={ this.toggleDrawer('console', true) }
          onClose={ this.toggleDrawer('console', false)  }
        >
          <div
            tabIndex={0}
            role="button"
            className={ classes.console }
            // onClick={this.toggleDrawer('console', false)}
            // onKeyDown={this.toggleDrawer('console', false)}
            
          >
            {/* <Fab className={ classes.consoleClose } onClick={ this.toggleDrawer('console', false) }>
              <DownIcon />
            </Fab> */}
            <div className={ classes.consoleClose } >
              <Button size="small" className={classes.margin} onClick={ this.handleClean }>
                Clean
              </Button>
              <Button size="small" color="secondary" className={classes.margin} onClick={ this.toggleDrawer('console', false) }>
                x
              </Button>
            </div>
            <h3>Console</h3>
            <Fade
              in={loading}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
            
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
