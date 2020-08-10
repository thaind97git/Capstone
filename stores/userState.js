import { makeFetchAction } from 'redux-api-call';
import { get } from 'lodash/fp';
import Router from 'next/router';

import {
  respondToSuccess,
  respondToFailure
} from '../stores/middlewares/api-reaction';
import { createErrorSelector } from '../utils';
import { saveToken, removeToken } from '../libs/token-libs';
import nfetch from '../libs/nfetch';
import { saveUserID, getUserID } from '../libs/user-libs';

export const LOGIN_USER = 'LOGIN_USER';
const GET_CURRENT_USER = 'GET_CURRENT_USER';
const GET_USERS = 'GET_USERS';
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';
const GET_USER_BY_ID = 'GET_USER_BY_ID';

export const loginUserAPI = makeFetchAction(
  LOGIN_USER,
  ({ phoneNumber, password }) =>
    nfetch({
      endpoint: `/api/login`
    })({ phoneNumber, password })
);

export const loginUser = (phoneNumber, password) => {
  return respondToSuccess(
    loginUserAPI.actionCreator({
      phoneNumber,
      password
    }),
    resp => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      const token = get('accessToken', resp);
      const userID = get('id', resp);
      saveToken(token);
      saveUserID(userID);
      Router.push('/');

      return;
    }
  );
};

export const loginUserErrorMessageSelector = createErrorSelector(loginUserAPI);

export const getCurrentUserAPI = makeFetchAction(
  GET_CURRENT_USER,
  nfetch({
    endpoint: `/api/v2/users/my_profile`,
    method: 'GET'
  })
);

export const verifyLogin = user => {
  if (!user) {
    return false;
  }
  return true;
};

export const getCurrentUser = () => {
  return respondToFailure(getCurrentUserAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error('Err: ', resp.errors);
      return;
    }

    if (!verifyLogin(resp.user_id)) {
      return Router.replace({
        pathname: '/login'
      });
    }

    return;
  });
};

// Logout
export const logOut = () => {
  removeToken();
  Router.push('/login');
};

// Get Users Paging
const GetUsersAPI = makeFetchAction(GET_USERS, ({ page, size }) =>
  nfetch({
    endpoint: `/admin/users/page?page=${page}&size=${size}`,
    method: 'GET'
  })()
);
export const getUsers = ({ page, size }) =>
  respondToSuccess(GetUsersAPI.actionCreator({ page, size }), () => {
    return;
  });
export const GetUsersDataSelector = GetUsersAPI.dataSelector;

// Ban User
export const BanUserAPI = makeFetchAction(UPDATE_USER_STATUS, id =>
  nfetch({
    endpoint: `/admin/users/status/${id}?status=${0}`,
    method: 'GET'
  })()
);
export const banUser = id =>
  respondToSuccess(BanUserAPI.actionCreator(id), (resp, _, store) => {
    store.dispatch(getUsers({ page: 0, size: 10 }));
  });

// UnBan User
export const UnBanUserAPI = makeFetchAction(UPDATE_USER_STATUS, id =>
  nfetch({
    endpoint: `/admin/users/status/${id}?status=${1}`,
    method: 'GET'
  })()
);
export const unbBanUser = id =>
  respondToSuccess(UnBanUserAPI.actionCreator(id), (resp, _, store) => {
    store.dispatch(getUsers({ page: 0, size: 10 }));
  });

// Get User By Id
export const GetUserByIdAPI = makeFetchAction(GET_USER_BY_ID, () =>
  nfetch({
    endpoint: `/admin/users/${getUserID()}`,
    method: 'GET'
  })()
);
export const getUserById = () =>
  respondToSuccess(GetUserByIdAPI.actionCreator(), () => {});

export const GetUserByIdDataSelector = GetUserByIdAPI.dataSelector;
