import { merge, get } from 'lodash/fp';
import { ACTIONS } from 'redux-api-call';
import { LOGIN_USER } from './userState';
import { ADD_NEW_ROLE } from './RoleState';
import { DEFAULT_OPTION_TOAST } from '../utils/options';
import {
  TOAST_ERROR,
  TOAST_SUCCESS,
  TOAST_DEFAULT,
  TOAST_INFO
} from '../enums/actions';
import {
  ADD_NEW_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY
} from './CategoryState';
import { ADD_NEW_SHOP, UPDATE_SHOP } from './ShopState';
export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const REMOVE_TOAST = 'REMOVE_TOAST';

const defaultState = {
  notifications: []
};

const doToastWithType = ({ state = defaultState, message, type }) => {
  if (!message) return state;
  const newNotification = merge(DEFAULT_OPTION_TOAST(), {
    options: { variant: type },
    message
  });
  return {
    ...state,
    notifications: [
      ...state.notifications,
      {
        ...newNotification,
        key: newNotification.options.key
      }
    ]
  };
};
export const removeToast = key => ({
  type: REMOVE_TOAST,
  key
});
const hasErrors = get('json.errors');

export default {
  toastNotification: (
    state = defaultState,
    { type, payload = {}, notification = {}, key }
  ) => {
    const { name } = payload || {};
    let msgNotify = '';
    if (type === ACTIONS.COMPLETE && !hasErrors(payload)) {
      switch (name) {
        case LOGIN_USER:
          msgNotify = 'Login success';
          break;
        case ADD_NEW_ROLE:
          msgNotify = 'Add new role success';
          break;
        case ADD_NEW_CATEGORY:
          msgNotify = 'Add new category success';
          break;
        case DELETE_CATEGORY:
          msgNotify = 'Delete category success';
          break;
        case UPDATE_CATEGORY:
          msgNotify = 'Update category success';
          break;
        case ADD_NEW_SHOP:
          msgNotify = 'Add new shop success';
          break;
        case UPDATE_SHOP:
          msgNotify = 'Update shop success';
          break;
        default:
          break;
      }
      return merge(
        doToastWithType({
          state,
          message: msgNotify,
          type: TOAST_SUCCESS
        }),
        payload
      );
    } else if (
      type === ACTIONS.FAILURE ||
      (type === ACTIONS.COMPLETE && hasErrors(payload))
    ) {
      switch (name) {
        case LOGIN_USER:
          msgNotify = 'Login fail';
          break;
        case ADD_NEW_ROLE:
          msgNotify = 'Add new role fail';
          break;
        case ADD_NEW_CATEGORY:
          msgNotify = 'Add new category fail';
          break;
        case DELETE_CATEGORY:
          msgNotify = 'Delete category fail';
          break;
        case UPDATE_CATEGORY:
          msgNotify = 'Update category fail';
          break;
        case ADD_NEW_SHOP:
          msgNotify = 'Add new shop fail';
          break;
        case UPDATE_SHOP:
          msgNotify = 'Update shop fail';
          break;
        default:
          break;
      }
      return merge(
        doToastWithType({
          state,
          message: msgNotify,
          type: TOAST_ERROR
        }),
        payload
      );
    } else {
      switch (type) {
        case TOAST_INFO:
        case TOAST_SUCCESS:
        case TOAST_ERROR:
        case TOAST_DEFAULT:
          if (!notification.message) return state;
          const newNotification = merge(DEFAULT_OPTION_TOAST(), notification);
          if (!notification.options || !notification.options.variant) {
            newNotification.options.variant = type;
          }
          return {
            ...state,
            notifications: [
              ...state.notifications,
              {
                ...newNotification,
                key: newNotification.options.key
              }
            ]
          };
        case REMOVE_TOAST:
          return {
            ...state,
            notifications: state.notifications.filter(
              notification => notification.key !== key
            )
          };
        default:
          return state;
      }
    }
  }
};
