import ButtonActionTableComponent from './commons/ButtonActionTableComponent';
import ReactTableLayout from '../layouts/SimpleTableLayout';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Lock, LockOpen, Done } from '@material-ui/icons';
import { Chip, Grid } from '@material-ui/core';
import { reset } from 'redux-form';
import {
  GetRolesDataSelector,
  getRoles,
  addNewRole,
  AddNewRoleDataSelector,
  AddNewRoleErrorSelector,
  AddNewRoleResetter
} from '../stores/RoleState';
import { createStructuredSelector } from 'reselect';
import FrameHeaderComponent from './FrameHeaderComponent';
import Button from '../layouts/Button';
import AlertDialog from '../layouts/AlertDialog';
import RoleAddingComponent from './RoleAddingComponent';
import { getUsers, GetUsersDataSelector } from '../stores/userState';
import AvatarComponent from './AvatarComponent';
import DisplayShortenComponent from './commons/DisplayShotenComponent';

const connectWithRedux = connect(
  createStructuredSelector({
    usersData: GetUsersDataSelector
    // addRoleSuccessMessage: AddNewRoleDataSelector,
    // addRoleErrorMessage: AddNewRoleErrorSelector
  }),
  dispatch => ({
    getUsers: (page, size) => dispatch(getUsers({ page, size }))
    // addNewUser: name => dispatch(addNewRole(name)),
    // resetData: () => dispatch(AddNewRoleResetter),
    // resetAddRoleForm: () => dispatch(reset('addNewRole'))
  })
);

const getMemberManagementActions = ({ status, id }) => {
  return status
    ? [
        {
          label: 'Active User',
          action: () => {},
          icon: <LockOpen />
        }
      ]
    : [
        {
          label: 'Disable User',
          action: () => {},
          icon: <Lock />
        }
      ];
};
const COLUMNS = [
  {
    field: 'fullName',
    title: 'Full Name'
  },
  {
    field: 'email',
    title: 'Email'
  },
  {
    field: 'phoneNumber',
    title: 'Phone'
  },
  {
    field: 'address',
    title: 'Address'
  },
  {
    field: 'latitude',
    title: 'Latitude'
  },
  {
    field: 'longtitude',
    title: 'Longtitude'
  },
  {
    field: 'createTime',
    title: 'Date Created'
  },
  {
    field: 'status',
    title: 'Status'
  },
  {
    field: 'actions',
    title: 'Actions'
  }
];

const getData = (roles = []) =>
  roles &&
  roles.map(
    ({
      id,
      address,
      avtUrl,
      createdTime,
      email,
      enabled,
      fullName,
      latitude,
      longtitude,
      phoneNumber
    }) => ({
      fullName: (
        <Grid container alignItems="center" direction="row">
          <AvatarComponent small url={avtUrl} />
          <span>&nbsp;&nbsp;</span>
          {fullName}
        </Grid>
      ),
      email: email,
      phoneNumber: phoneNumber,
      address: <DisplayShortenComponent>{address}</DisplayShortenComponent>,
      latitude: latitude,
      longtitude: longtitude,
      createTime: fullName,
      status: (
        <Chip
          label={enabled ? 'Active' : 'Disabled'}
          clickable
          color={!enabled ? 'secondary' : 'default'}
          deleteIcon={enabled ? <Done /> : <Lock />}
          style={enabled ? { background: 'green', color: 'white' } : {}}
        />
      ),
      actions: getMemberManagementActions(
        (enabled, id)
      ).map(({ label, action, icon }, index) => (
        <ButtonActionTableComponent
          key={index}
          label={label}
          action={action}
          icon={icon}
        />
      ))
    })
  );

const UserManagementComponent = ({
  usersData,
  getUsers
  // addNewRole,
  // addRoleSuccessMessage,
  // resetData,
  // resetAddRoleForm
}) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  // useEffect(() => {
  //   if (addRoleSuccessMessage) {
  //     setIsOpenAdd(false);
  //     resetData();
  //     resetAddRoleForm();
  //   }
  // }, [addRoleSuccessMessage]);

  let totalCount = 0,
    page = 0,
    pageSize = 10;
  if (usersData) {
    totalCount = usersData.totalElements;
  }

  return (
    <React.Fragment>
      {/* <AlertDialog
        title="Add new role"
        isOpenDialog={isOpenAdd}
        setIsOpenDialog={setIsOpenAdd}
        isFooter={false}
        size="xs"
        fullWidth
        content={<RoleAddingComponent />}
      /> */}
      <FrameHeaderComponent title="User management">
        {/* <Button onClick={() => setIsOpenAdd(true)}>Add new user</Button> */}
      </FrameHeaderComponent>
      <ReactTableLayout
        dispatchAction={getUsers}
        data={getData((usersData || {}).content)}
        columns={COLUMNS}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
      />
    </React.Fragment>
  );
};

export default connectWithRedux(UserManagementComponent);
