import React from 'react';
import { Tooltip, Grid } from '@material-ui/core';

const getShortenValue = (value = ' ') => {
  return value.length > 10 ? value.slice(0, 10) + '...' : value;
};

function DisplayShortenComponent({ children, shorten = true }) {
  if (!children) {
    return <div />;
  }
  return (
    <Grid container direction="row" wrap="nowrap" alignItems="center">
      <Tooltip title={children} placement="top">
        <span>{shorten ? getShortenValue(children) : children}</span>
      </Tooltip>
    </Grid>
  );
}

export default DisplayShortenComponent;
