import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, Fragment } from 'react';

import Button from '../layouts/Button';
import { Grid } from '@material-ui/core';
import RenderFieldComponent from './FormFields/RenderFieldComponent';

import { required } from '../utils/validation';

import {
  getCategoryById,
  updateService,
  addNewService,
  getServiceById,
  GetServiceByIdResetter,
  GetServiceByIdDataSelector,
  AddNewServiceErrorSelector,
  AddNewServiceDataSelector
} from '../stores/CategoryState';
import RenderSwitchFieldComponent from './FormFields/RenderSwitchFieldComponent';
const connectToRedux = connect(
  createStructuredSelector({
    addServiceSuccessMessage: AddNewServiceDataSelector,
    addServiceErrorMessage: AddNewServiceErrorSelector,
    initialValues: GetServiceByIdDataSelector
  }),
  dispatch => ({
    onSubmit: values => {
      if ('status' in values) {
        dispatch(updateService(values));
      } else {
        dispatch(addNewService(values));
      }
    },
    getServiceById: id => dispatch(getServiceById(id)),
    resetData: () => dispatch(GetServiceByIdResetter)
  })
);

const withForm = reduxForm({ form: 'addNewService' });
const enhance = compose(connectToRedux, withForm);

const ServiceActionComponent = ({
  handleSubmit,
  pristine,
  submitting,
  reset,
  isUpdate = false,
  id,
  getServiceById,
  resetData
}) => {
  useEffect(() => {
    if (id) {
      getServiceById(id);
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
            col={12}
            name="categoryName"
            component={RenderFieldComponent}
            placeholder="Category Name"
            validate={[required]}
            label="Category name"
          />
          <Field
            col={12}
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

export default enhance(ServiceActionComponent);
