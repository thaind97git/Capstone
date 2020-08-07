import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { upperCase } from 'lodash/fp';
import { Typography, Grid, Divider, Link, Chip } from '@material-ui/core';
import MissingInfoComponent from './MissingInfoComponent';
import RatingComponent from './commons/RatingComponent';
import ShortenContentComponent from './commons/ShortenContentComponent';
import {
  getShopById,
  GetShopByIdDataSelector,
  getServicesByShopId,
  GetServicesByShopIdDataSelector
} from '../stores/ShopState';
import { Done, Lock } from '@material-ui/icons';
import CardSimpleLayout from '../layouts/CardSimpleLayout';
import Button from '../layouts/Button';
import InfoLayout from '../layouts/InforLayout';
import ReactTableLayout from '../layouts/SimpleTableLayout';

const connectToRedux = connect(
  createStructuredSelector({
    detailsData: GetShopByIdDataSelector,
    servicesData: GetServicesByShopIdDataSelector
  }),
  dispatch => ({
    getDetails: id => dispatch(getShopById(id)),
    getServicesByShopId: shopId => dispatch(getServicesByShopId({ shopId }))
  })
);

const COLUMNS = [
  {
    field: 'serviceName',
    title: 'Service Name'
  },
  {
    field: 'description',
    title: 'Description'
  },
  {
    field: 'unit',
    title: 'Unit'
  },
  {
    field: 'status',
    title: 'Shop Status'
  }
];

const getData = ({ servicesData = [] }) =>
  servicesData &&
  servicesData.map(({ services = {} }) => ({
    serviceName: services.serviceName,
    description: services.description,
    unit: services.unit,
    status: (
      <Chip
        label={services.status ? 'Active' : 'Disabled'}
        clickable
        color={!services.status ? 'secondary' : 'default'}
        deleteIcon={status ? <Done /> : <Lock />}
        style={services.status ? { background: 'green', color: 'white' } : {}}
      />
    )
  }));

const ShopDetailsComponent = ({
  detailsData,
  getDetails,
  servicesData,
  getServicesByShopId
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    getDetails(Router.query.id);
  }, [getDetails]);

  useEffect(() => {
    getServicesByShopId(Router.query.id);
  }, [getServicesByShopId]);

  const rows = [
    { label: 'Shop Name', key: 'shopName' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Longtitude', key: 'longtitude' },
    { label: 'Latitude', key: 'latitude' },
    { label: 'Rating Star', key: 'rating' },
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    { label: 'Open Time', key: 'openTime' },
    { label: 'Close Time', key: 'closeTime' },
    { label: 'Description', key: 'description' },
    { label: 'Status', key: 'status' }
  ];
  let displays = {};
  if (detailsData)
    displays = {
      shopName: detailsData.shopName,
      phoneNumber: detailsData.phoneNumber,
      longtitude: detailsData.longtitude || <small>not yet defined</small>,
      latitude: detailsData.latitude || <small>not yet defined</small>,
      rating: <RatingComponent star={detailsData.numOfStar} /> || (
        <small>not yet defined</small>
      ),
      email: detailsData.email || <small>not yet defined</small>,
      address: <ShortenContentComponent content={detailsData.address} /> || (
        <small>not yet defined</small>
      ),
      description: detailsData.description || <small>not yet defined</small>,
      openTime: detailsData.openTime || <small>not yet defined</small>,
      closeTime: detailsData.closeTime || <small>not yet defined</small>,
      status: (
        <Chip
          label={detailsData.status ? 'Active' : 'Disabled'}
          clickable
          color={!detailsData.status ? 'secondary' : 'default'}
          deleteIcon={detailsData.status ? <Done /> : <Lock />}
          style={
            detailsData.status ? { background: 'green', color: 'white' } : {}
          }
        />
      )
    };

  return !detailsData ? (
    <MissingInfoComponent>
      <Typography variant="h5" color="secondary">
        Not found any Shop
      </Typography>
    </MissingInfoComponent>
  ) : (
    <Grid>
      <Grid container justify="center">
        <Grid xs={12} item className="shadow-0">
          <CardSimpleLayout
            header={
              <Grid
                container
                justify="space-between"
                alignItems="center"
                direction="row"
              >
                <Typography variant="h6">Shop details</Typography>

                <Grid>
                  <Button onClick={() => setIsOpenModal(true)}>
                    Disable Shop
                  </Button>
                </Grid>
              </Grid>
            }
            body={<InfoLayout subtitle="" rows={rows} displays={displays} />}
          />
        </Grid>
      </Grid>
      <Grid style={{ marginTop: 40 }} container justify="center">
        <Grid xs={12} item className="shadow-0">
          <CardSimpleLayout
            bodyStyle={{ padding: 0 }}
            header={<Typography variant="h6">Shop services</Typography>}
            body={
              <ReactTableLayout
                dispatchAction={() => getServicesByShopId(Router.query.id)}
                hasPaging={false}
                data={getData({
                  servicesData: servicesData || []
                })}
                columns={COLUMNS}
              />
            }
          />
        </Grid>
      </Grid>

      {/* <Divider style={{ margin: '40px 0px' }} /> */}
      {/* <UserWalletsComponent id={Router.query.id} /> */}
    </Grid>
  );
};

export default connectToRedux(ShopDetailsComponent);
