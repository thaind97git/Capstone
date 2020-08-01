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
import { getShopById, GetShopByIdDataSelector } from '../stores/ShopState';
import { Done, Lock } from '@material-ui/icons';
import CardSimpleLayout from '../layouts/CardSimpleLayout';
import Button from '../layouts/Button';
import InfoLayout from '../layouts/InforLayout';

const connectToRedux = connect(
  createStructuredSelector({
    detailsData: GetShopByIdDataSelector
  }),
  dispatch => ({
    getDetails: id => dispatch(getShopById(id))
  })
);

const ShopDetailsComponent = ({ detailsData, t, getDetails }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    getDetails(Router.query.id);
  }, [getDetails]);

  const rows = [
    { label: 'Shop Name', key: 'shopName' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Longtitude', key: 'longtitude' },
    { label: 'Latitude', key: 'latitude' },
    { label: 'Rating Star', key: 'rating' },
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    { label: 'Description', key: 'description' },
    { label: 'Status', key: 'status' }
  ];
  let displays = {};
  if (detailsData)
    displays = {
      shopName: detailsData.shopName,
      phoneNumber: detailsData.phoneNumber,
      longtitude: detailsData.longtitude,
      latitude: detailsData.latitude,
      rating: <RatingComponent star={detailsData.numOfStart} />,
      email: detailsData.email,
      address: <ShortenContentComponent content={detailsData.address} />,
      description: detailsData.description,
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
      {/* <Divider style={{ margin: '40px 0px' }} /> */}
      {/* <UserWalletsComponent id={Router.query.id} /> */}
    </Grid>
  );
};

export default connectToRedux(ShopDetailsComponent);
