import { flow, get, isArray } from 'lodash/fp';
import brn from 'brn';
import moment from 'moment';

export const isServer = !process.browser;

export const DATE_FORMAT = 'MM/DD/YYYY';

export const TIME_FORMAT = 'hh:mm:ss A';

export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export const createErrorSelector = (action) =>
  flow(
    brn(action.errorSelector, action.errorSelector, action.dataSelector),
    get('error')
  );

export const doDispatchAction = (dispatch) => (fetchData) => {
  let actionCreators = fetchData;
  if (typeof fetchData === 'function') {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach((actionCreator) => dispatch(actionCreator()));
  }
};

export const doFunctionWithEnter = (event, func) =>
  typeof event === 'object' &&
  event.key === 'Enter' &&
  typeof func === 'function' &&
  func();

export const parseBoolean = (val) =>
  !val || val === 'false' || val === 'null' || val === 'undefined'
    ? false
    : true;
export const DEFAULT_DATE_RANGE = {
  fromDate: null,
  toDate: null
};

export const formatDate = (time) =>
  time ? moment(time).format(DATE_FORMAT) : null;

export const isValidDateFormat = (value) =>
  value ? moment(value, DATE_FORMAT, true).isValid() : false;
