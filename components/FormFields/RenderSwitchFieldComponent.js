import React from 'react';
// import Switch from 'react-switch';
import { Typography, Grid, makeStyles, Switch } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  },
  switch: {
    marginLeft: theme.spacing(1),
    marginTop: 4
  }
}));
const RenderSwitchFieldComponent = ({
  meta,
  input: { value, onChange },
  label,
  col
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item col={col} xs={12} className={classes.root}>
        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
        <Grid className={classes.switch}>
          <Switch
            checked={value || false}
            onChange={onChange}
            color="primary"
          />
          {/* <Switch onChange={onChange} checked={value || false} /> */}
          {meta.touched && meta.error && (
            <span style={{ color: 'red' }}>{meta.error}</span>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RenderSwitchFieldComponent;
