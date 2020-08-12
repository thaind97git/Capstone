import ButtonActionTableComponent from './commons/ButtonActionTableComponent';
import ReactTableLayout from '../layouts/SimpleTableLayout';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Lock, LockOpen, Done, Edit } from '@material-ui/icons';
import { Chip, Grid } from '@material-ui/core';
import { reset } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import FrameHeaderComponent from './FrameHeaderComponent';
import Button from '../layouts/Button';
import AlertDialog from '../layouts/AlertDialog';
import {
  GetServicesDataSelector,
  getServices,
  DeleteServiceResetter,
  AddNewServiceDataSelector,
  UpdateServiceDataSelector,
  AddNewServiceResetter,
  UpdateServiceResetter
} from '../stores/CategoryState';
import ServiceActionComponent from './ServiceActionComponent';
import Link from 'next/link';
import { createLink } from '../libs';

const connectWithRedux = connect(
  createStructuredSelector({
    categoriesData: GetServicesDataSelector,
    addServiceSuccessMessage: AddNewServiceDataSelector,
    updateServiceData: UpdateServiceDataSelector
  }),
  dispatch => ({
    getServices: (page, pageSize) => dispatch(getServices({ page, pageSize })),
    resetData: () => {
      dispatch(AddNewServiceResetter);
      dispatch(UpdateServiceResetter);
    },
    resetAddServiceForm: () => dispatch(reset('addNewService'))
  })
);

const getActions = ({ status, id, setCurrentIdSelected, setIsOpenUpdate }) => {
  return !status
    ? [
        {
          label: 'Edit service',
          action: () => {
            setIsOpenUpdate(true);
            setCurrentIdSelected(id);
          },
          icon: <Edit />
        }
      ]
    : [
        {
          label: 'Edit service',
          action: () => {
            setIsOpenUpdate(true);
            setCurrentIdSelected(id);
          },
          icon: <Edit />
        }
      ];
};
const COLUMNS = [
  {
    field: 'name',
    title: 'Service Name'
  },
  {
    field: 'unit',
    title: 'Service Unit'
  },
  {
    field: 'category',
    title: 'Category'
  },
  {
    field: 'description',
    title: 'Description'
  },
  {
    field: 'status',
    title: 'Service Status'
  },
  {
    field: 'actions',
    title: 'Actions'
  }
];

const getData = ({
  categoriesData = [],
  setCurrentIdSelected,
  setIsOpenUpdate
}) =>
  categoriesData &&
  categoriesData.map(
    ({ serviceName, category = {}, unit, status, id, description }) => ({
      name: serviceName,
      unit: unit,
      category: (
        <Link
          href={createLink(['category', `details?id=${(category || {}).id}`])}
        >
          <a>{(category || {}).categoryName}</a>
        </Link>
      ),
      description: description,
      status: (
        <Chip
          label={status ? 'Active' : 'Disabled'}
          clickable
          color={!status ? 'secondary' : 'default'}
          deleteIcon={status ? <Done /> : <Lock />}
          style={status ? { background: 'green', color: 'white' } : {}}
        />
      ),
      actions: getActions({
        status,
        id,
        setCurrentIdSelected,
        setIsOpenUpdate
      }).map(({ label, action, icon }, index) => (
        <ButtonActionTableComponent
          key={index}
          label={label}
          action={action}
          icon={icon}
        />
      ))
    })
  );

const ServiceManagementComponent = ({
  categoriesData,
  getServices,
  addServiceSuccessMessage,
  resetData,
  resetAddServiceForm,
  updateServiceData
}) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [currentIdSelected, setCurrentIdSelected] = useState(null);

  useEffect(() => {
    if (addServiceSuccessMessage) {
      setIsOpenAdd(false);
      resetData();
      resetAddServiceForm();
    }
  }, [addServiceSuccessMessage]);

  useEffect(() => {
    if (updateServiceData) {
      setIsOpenUpdate(false);
      resetData();
    }
  }, [updateServiceData]);

  let totalCount = 0,
    page = 0,
    pageSize = 10;
  if (categoriesData) {
    totalCount = categoriesData.totalElements;
  }

  return (
    <React.Fragment>
      <AlertDialog
        title="Add new service"
        isOpenDialog={isOpenAdd}
        setIsOpenDialog={setIsOpenAdd}
        isFooter={false}
        size="xs"
        fullWidth
        content={isOpenAdd ? <ServiceActionComponent /> : null}
      />
      <AlertDialog
        title="Update service"
        isOpenDialog={isOpenUpdate}
        setIsOpenDialog={setIsOpenUpdate}
        isFooter={false}
        size="xs"
        fullWidth
        content={
          isOpenUpdate ? (
            <ServiceActionComponent isUpdate id={currentIdSelected} />
          ) : null
        }
        onClose={() => {
          setIsOpenUpdate(false);
        }}
      />
      <FrameHeaderComponent title="Service management">
        <Button onClick={() => setIsOpenAdd(true)}>Add new service</Button>
      </FrameHeaderComponent>
      <ReactTableLayout
        dispatchAction={getServices}
        data={getData({
          categoriesData: (categoriesData || {}).content || [],
          setCurrentIdSelected,
          setIsOpenUpdate
        })}
        columns={COLUMNS}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
      />
    </React.Fragment>
  );
};

export default connectWithRedux(ServiceManagementComponent);
