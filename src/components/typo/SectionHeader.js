import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  sectionContainer: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  title: {
    fontWeight: 'bold'
  }
});

class SectionHeader extends Component {
  render() {
    const { classes, title, subtitle} = this.props;
    return (
      <div className={classes.sectionContainer}>
        <h5 variant="subtitle1" className={classes.title}>
          {title}
        </h5>
        <p variant="body1" gutterBottom>
          {subtitle}
        </p>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(SectionHeader));
