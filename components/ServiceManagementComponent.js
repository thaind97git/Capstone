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
  UpdateServiceResetter,
  updateService
} from '../stores/CategoryState';
import ServiceActionComponent from './ServiceActionComponent';
import Link from 'next/link';
import { createLink } from '../libs';

const connectWithRedux = connect(
  createStructuredSelector({
    servicesData: GetServicesDataSelector,
    addServiceSuccessMessage: AddNewServiceDataSelector,
    updateServiceData: UpdateServiceDataSelector
  }),
  dispatch => ({
    getServices: (page, pageSize) => dispatch(getServices({ page, pageSize })),
    resetData: () => {
      dispatch(AddNewServiceResetter);
      dispatch(UpdateServiceResetter);
    },
    resetAddServiceForm: () => dispatch(reset('addNewService')),
    activeService: (values = {}) =>
      dispatch(
        updateService({
          ...values,
          status: true,
          categoryId: (values.category || {}).id
        })
      ),
    disableService: values =>
      dispatch(
        updateService({
          ...values,
          status: false,
          categoryId: (values.category || {}).id
        })
      )
  })
);

const getActions = ({
  status,
  id,
  setCurrentIdSelected,
  setIsOpenUpdate,
  activeService,
  disableService,
  service
}) => {
  return !status
    ? [
        {
          label: 'Active Service',
          action: () => activeService(service),
          icon: <LockOpen />
        }
      ]
    : [
        {
          label: 'Edit Service',
          action: () => {
            setIsOpenUpdate(true);
            setCurrentIdSelected(id);
          },
          icon: <Edit />
        },
        {
          label: 'Disable Service',
          action: () => disableService(service),
          icon: <Lock />
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
  servicesData = [],
  setCurrentIdSelected,
  setIsOpenUpdate,
  activeService,
  disableService
}) =>
  servicesData &&
  servicesData.map(service => ({
    name: service.serviceName,
    unit: service.unit,
    category: (
      <Link
        href={createLink([
          'category',
          `details?id=${(service.category || {}).id}`
        ])}
      >
        <a>{(service.category || {}).categoryName}</a>
      </Link>
    ),
    description: service.description,
    status: (
      <Chip
        label={service.status ? 'Active' : 'Disabled'}
        clickable
        color={!service.status ? 'secondary' : 'default'}
        deleteIcon={service.status ? <Done /> : <Lock />}
        style={service.status ? { background: 'green', color: 'white' } : {}}
      />
    ),
    actions: getActions({
      status: service.status,
      id: service.id,
      setCurrentIdSelected,
      setIsOpenUpdate,
      activeService,
      disableService,
      service
    }).map(({ label, action, icon }, index) => (
      <ButtonActionTableComponent
        key={index}
        label={label}
        action={action}
        icon={icon}
      />
    ))
  }));

const ServiceManagementComponent = ({
  servicesData,
  getServices,
  addServiceSuccessMessage,
  resetData,
  resetAddServiceForm,
  updateServiceData,
  activeService,
  disableService
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
  if (servicesData) {
    totalCount = servicesData.totalElements;
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
          servicesData: (servicesData || {}).content || [],
          setCurrentIdSelected,
          setIsOpenUpdate,
          activeService,
          disableService
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
