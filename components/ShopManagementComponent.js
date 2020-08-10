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
  GetShopsDataSelector,
  getShops,
  AddNewShopDataSelector,
  AddNewShopResetter,
  DeleteShopResetter,
  UpdateShopDataSelector,
  UpdateShopResetter,
  AddNewServiceDataSelector,
  UpdateServiceDataSelector,
  AddNewServiceResetter,
  UpdateServiceResetter
} from '../stores/ShopState';
// import ShopAddingComponent from './ShopAddingComponent';
import ServiceActionComponent from './ServiceActionComponent';
import ShortenContentComponent from './commons/ShortenContentComponent';
import RatingComponent from './commons/RatingComponent';
import Link from 'next/link';
import { createLink } from '../libs';
import AvatarComponent from './AvatarComponent';
import RLink from '../layouts/RLink';
import ShopActionsComponent from './ShopActionsComponent';

const connectWithRedux = connect(
  createStructuredSelector({
    shopsData: GetShopsDataSelector,
    addShopSuccessMessage: AddNewShopDataSelector,
    updateShopData: UpdateShopDataSelector
  }),
  dispatch => ({
    getShops: (page, pageSize) => dispatch(getShops({ page, pageSize })),
    resetData: () => {
      dispatch(AddNewServiceResetter);
      dispatch(UpdateServiceResetter);
    },
    resetAddShopForm: () => dispatch(reset('addNewShop'))
  })
);

const getActions = ({ status, id, setCurrentIdSelected, setIsOpenUpdate }) => {
  return !status
    ? [
        {
          label: 'Edit shop',
          action: () => {
            setIsOpenUpdate(true);
            setCurrentIdSelected(id);
          },
          icon: <Edit />
        }
      ]
    : [
        {
          label: 'Edit shop',
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
    field: 'avatar',
    title: 'Avatar'
  },
  {
    field: 'shopName',
    title: 'Name'
  },
  {
    field: 'owner',
    title: 'Owner'
  },
  {
    field: 'phoneNumber',
    title: 'Phone'
  },
  {
    field: 'longtitude',
    title: 'Longtitude'
  },
  {
    field: 'latitude',
    title: 'Latitude'
  },
  {
    field: 'numOfStart',
    title: 'Rating'
  },
  {
    field: 'email',
    title: 'Email'
  },
  {
    field: 'address',
    title: 'Address'
  },
  {
    field: 'description',
    title: 'Description'
  },
  {
    field: 'status',
    title: 'Shop Status'
  },
  {
    field: 'actions',
    title: 'Actions'
  }
];

const getData = ({ shopsData = [], setCurrentIdSelected, setIsOpenUpdate }) =>
  shopsData &&
  shopsData.map(
    ({
      avatarUrl,
      shopName,
      status,
      id,
      description,
      longtitude,
      latitude,
      numOfStar,
      email,
      address,
      phoneNumber,
      user = {}
    }) => ({
      avatar: <AvatarComponent small url={avatarUrl} />,
      shopName: (
        <Link href={createLink(['shop', `details?id=${id}`])}>
          <a>{shopName}</a>
        </Link>
      ),
      owner: (
        <Link href={createLink(['user', `details?id=${(user || {}).id}`])}>
          <a>{(user || {}).fullName}</a>
        </Link>
      ),
      phoneNumber: phoneNumber,
      longtitude: longtitude,
      latitude: latitude,
      numOfStart: <RatingComponent star={numOfStar} />,
      email: email,
      address: <ShortenContentComponent content={address} />,
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
      actions: status
        ? getActions({
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
        : null
    })
  );

const ShopManagementComponent = ({
  shopsData,
  getShops,
  addShopSuccessMessage,
  resetData,
  resetAddShopForm,
  updateShopData
}) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [currentIdSelected, setCurrentIdSelected] = useState(null);

  useEffect(() => {
    if (addShopSuccessMessage) {
      setIsOpenAdd(false);
      resetData();
      resetAddShopForm();
    }
  }, [addShopSuccessMessage]);

  useEffect(() => {
    if (updateShopData) {
      setIsOpenUpdate(false);
      resetData();
    }
  }, [updateShopData]);

  let totalCount = 0,
    page = 0,
    pageSize = 10;
  if (shopsData) {
    totalCount = shopsData.totalElements;
  }

  return (
    <React.Fragment>
      <AlertDialog
        title="Add new Shop"
        isOpenDialog={isOpenAdd}
        setIsOpenDialog={setIsOpenAdd}
        isFooter={false}
        size="md"
        fullWidth
        content={isOpenAdd ? <ShopActionsComponent /> : null}
      />
      <AlertDialog
        title="Update Shop"
        isOpenDialog={isOpenUpdate}
        setIsOpenDialog={setIsOpenUpdate}
        isFooter={false}
        size="md"
        fullWidth
        content={
          isOpenUpdate ? (
            <ShopActionsComponent isUpdate id={currentIdSelected} />
          ) : null
        }
        onClose={() => {
          setIsOpenUpdate(false);
        }}
      />
      <FrameHeaderComponent title="Shop management">
        {/* <RLink href="/shop/add">
          <Button>Add new shop</Button>
        </RLink> */}
        <Button onClick={() => setIsOpenAdd(true)}>Add new shop</Button>
      </FrameHeaderComponent>
      <ReactTableLayout
        dispatchAction={getShops}
        data={getData({
          shopsData: (shopsData || {}).content || [],
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

export default connectWithRedux(ShopManagementComponent);
