import { makeFetchAction } from 'redux-api-call';
import { get, flow } from 'lodash/fp';

import { respondToSuccess } from '../stores/middlewares/api-reaction';
import { createErrorSelector } from '../utils';
import nfetch from '../libs/nfetch';
import { getResetter } from '../libs';

const GET_SHOP = 'GET_SHOP';
export const ADD_NEW_SHOP = 'ADD_NEW_SHOP';
export const DELETE_SHOP = 'DELETE_SHOP';
export const UPDATE_SHOP = 'UPDATE_SHOP';
export const GET_SHOP_BY_ID = 'GET_SHOP_BY_ID';

// Service
const GET_SERVICE = 'GET_SERVICE';
export const ADD_NEW_SERVICE = 'ADD_NEW_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const GET_SERVICE_BY_ID = 'GET_SERVICE_BY_ID';
export const GET_SERVICES_BY_SHOP_ID = 'GET_SERVICES_BY_SHOP_ID';

//Get shop
export const GetShopsAPI = makeFetchAction(GET_SHOP, ({ page, pageSize }) =>
  nfetch({
    endpoint: `/shop/shops?page=${page}&size=${pageSize}`,
    method: 'GET'
  })()
);
export const getShops = ({}) =>
  respondToSuccess(GetShopsAPI.actionCreator({}), () => {});
export const GetShopsDataSelector = GetShopsAPI.dataSelector;

// Add new Shop
export const AddNewShopAPI = makeFetchAction(ADD_NEW_SHOP, values =>
  nfetch({
    endpoint: '/shop/createShop'
  })(values)
);
export const addNewShop = values =>
  respondToSuccess(AddNewShopAPI.actionCreator(values), (resp, _, store) => {
    store.dispatch(getShops({}));
  });
export const AddNewShopDataSelector = AddNewShopAPI.dataSelector;
export const AddNewShopErrorSelector = AddNewShopAPI.errorSelector;
export const AddNewShopResetter = getResetter(AddNewShopAPI);

// Delete Shop
export const DeleteShopAPI = makeFetchAction(DELETE_SHOP, ({ id }) =>
  nfetch({
    endpoint: `/shop/${id}`,
    method: 'DELETE'
  })()
);
export const deleteShop = id =>
  respondToSuccess(DeleteShopAPI.actionCreator({ id }), (resp, _, store) => {
    store.dispatch(getShops({}));
  });
export const DeleteShopDataSelector = DeleteShopAPI.dataSelector;
export const DeleteShopResetter = getResetter(DeleteShopAPI);

// Update Shop
export const UpdateShopAPI = makeFetchAction(UPDATE_SHOP, values =>
  nfetch({
    endpoint: `/shop/${values.id}`,
    method: 'PUT'
  })(values)
);
export const updateShop = values =>
  respondToSuccess(UpdateShopAPI.actionCreator(values), (resp, _, store) => {
    store.dispatch(getShops({}));
  });
export const UpdateShopDataSelector = UpdateShopAPI.dataSelector;
export const UpdateShopResetter = getResetter(UpdateShopAPI);

// Get Shop by id
export const GetShopByIdAPI = makeFetchAction(GET_SHOP_BY_ID, ({ id }) =>
  nfetch({
    endpoint: `/shop/getShopById/${id}`,
    method: 'GET'
  })()
);
export const getShopById = id =>
  respondToSuccess(GetShopByIdAPI.actionCreator({ id }), () => {});
export const GetShopByIdDataSelector = GetShopByIdAPI.dataSelector;
export const GetShopByIdResetter = getResetter(GetShopByIdAPI);

//Get service
// export const GetServicesAPI = makeFetchAction(GET_SERVICE, ({}) =>
//   nfetch({
//     endpoint: `/services`,
//     method: 'GET'
//   })()
// );
// export const getServices = ({}) =>
//   respondToSuccess(GetServicesAPI.actionCreator({}), () => {});
// export const GetServicesDataSelector = GetServicesAPI.dataSelector;

// Add new Shop
export const AddNewServiceAPI = makeFetchAction(ADD_NEW_SERVICE, values =>
  nfetch({
    endpoint: '/service'
  })(values)
);
export const addNewService = values =>
  respondToSuccess(AddNewServiceAPI.actionCreator(values), (resp, _, store) => {
    // store.dispatch(getShops({}));
  });
export const AddNewServiceDataSelector = AddNewServiceAPI.dataSelector;
export const AddNewServiceErrorSelector = AddNewServiceAPI.errorSelector;
export const AddNewServiceResetter = getResetter(AddNewServiceAPI);

// Delete Shop
// export const DeleteShopAPI = makeFetchAction(DELETE_SHOP, ({ id }) =>
//   nfetch({
//     endpoint: `/shop/${id}`,
//     method: 'DELETE'
//   })()
// );
// export const deleteShop = id =>
//   respondToSuccess(
//     DeleteShopAPI.actionCreator({ id }),
//     (resp, _, store) => {
//       store.dispatch(getShops({}));
//     }
//   );
// export const DeleteShopDataSelector = DeleteShopAPI.dataSelector;
// export const DeleteShopResetter = getResetter(DeleteShopAPI);

// Update service
export const UpdateServiceAPI = makeFetchAction(UPDATE_SERVICE, values =>
  nfetch({
    endpoint: `/service/${values.id}`,
    method: 'PUT'
  })(values)
);
export const updateService = values =>
  respondToSuccess(UpdateServiceAPI.actionCreator(values), (resp, _, store) => {
    // store.dispatch(getShops({}));
  });
export const UpdateServiceDataSelector = UpdateServiceAPI.dataSelector;
export const UpdateServiceResetter = getResetter(UpdateServiceAPI);

// Get service by id
export const GetServiceByIdAPI = makeFetchAction(GET_SERVICE_BY_ID, ({ id }) =>
  nfetch({
    endpoint: `/service/${id}`,
    method: 'GET'
  })()
);
export const getServiceById = id =>
  respondToSuccess(GetServiceByIdAPI.actionCreator({ id }), () => {});
export const GetServiceByIdDataSelector = GetServiceByIdAPI.dataSelector;
export const GetServiceByIdResetter = getResetter(GetServiceByIdAPI);

// Get service by shop id
export const GetServicesByShopIdAPI = makeFetchAction(
  GET_SERVICES_BY_SHOP_ID,
  ({ id, page = 0, pageSize = 10 }) =>
    nfetch({
      endpoint: `/shop/getShopServiceByShopId?shopId=${id}&page=${page}&size=${pageSize}`,
      method: 'GET'
    })()
);
export const getServicesByShopId = ({ id, page, pageSize }) =>
  respondToSuccess(
    GetServicesByShopIdAPI.actionCreator({ id, page, pageSize }),
    () => {}
  );
export const GetServicesByShopIdDataSelector =
  GetServicesByShopIdAPI.dataSelector;
export const GetServicesByShopIdResetter = getResetter(GetServicesByShopIdAPI);
