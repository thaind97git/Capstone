import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, Fragment } from 'react';

import Button from '../layouts/Button';
import { Grid } from '@material-ui/core';
import RenderFieldComponent from './FormFields/RenderFieldComponent';

import { required, emailValidation } from '../utils/validation';
import RenderSwitchFieldComponent from './FormFields/RenderSwitchFieldComponent';
import {
  addNewShop,
  getShopById,
  GetShopByIdResetter,
  GetShopByIdDataSelector
} from '../stores/ShopState';
const connectToRedux = connect(
  createStructuredSelector({
    initialValues: GetShopByIdDataSelector
  }),
  dispatch => ({
    onSubmit: values => {
      if ('status' in values) {
        dispatch(updateShop(values));
      } else {
        dispatch(addNewShop(values));
      }
    },
    getShopById: id => dispatch(getShopById(id)),
    resetData: () => dispatch(GetShopByIdResetter)
  })
);

const withForm = reduxForm({ form: 'addNewShop' });
const enhance = compose(connectToRedux, withForm);

const ShopActionComponent = ({
  handleSubmit,
  pristine,
  submitting,
  reset,
  isUpdate = false,
  id,
  getShopById,
  resetData
}) => {
  useEffect(() => {
    if (id) {
      getShopById(id);
    }
    return () => {
      resetData();
    };
  }, [id]);
  return (
    <Grid container>
      <form onSubmit={handleSubmit}>
        <Grid container direction="row">
          <Field
            col={6}
            name="shopName"
            component={RenderFieldComponent}
            placeholder="Shop Name"
            validate={[required]}
            label="Shop Name"
          />
          <Field
            col={6}
            name="email"
            component={RenderFieldComponent}
            placeholder="Email"
            label="Email"
            validate={[required, emailValidation]}
          />
          <Field
            col={6}
            name="phoneNumber"
            component={RenderFieldComponent}
            placeholder="Phone Number"
            label="Phone Number"
            validate={[required]}
          />
          <Field
            col={6}
            name="address"
            component={RenderFieldComponent}
            placeholder="Address"
            label="Address"
            validate={[required]}
          />
          <Field
            col={6}
            name="description"
            component={RenderFieldComponent}
            placeholder="Description"
            label="Description"
          />
          {isUpdate && (
            <Field
              col={12}
              name="status"
              component={RenderSwitchFieldComponent}
              label="Status"
            />
          )}
          <Grid container justify="center">
            <Grid>
              <Button type="submit" disabled={pristine || submitting}>
                Submit
              </Button>
              <Button
                type="button"
                disabled={pristine || submitting}
                onClick={reset}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default enhance(ShopActionComponent);
