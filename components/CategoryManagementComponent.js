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
  GetCategoriesDataSelector,
  getCategories,
  AddNewCategoryDataSelector,
  AddNewCategoryResetter,
  DeleteCategoryResetter,
  UpdateCategoryDataSelector,
  UpdateCategoryResetter
} from '../stores/CategoryState';
import CategoryAddingComponent from './CategoryAddingComponent';

const connectWithRedux = connect(
  createStructuredSelector({
    categoriesData: GetCategoriesDataSelector,
    addCategorySuccessMessage: AddNewCategoryDataSelector,
    updateCategoryData: UpdateCategoryDataSelector
  }),
  dispatch => ({
    getCategories: () => dispatch(getCategories({})),
    resetData: () => {
      dispatch(AddNewCategoryResetter);
      dispatch(DeleteCategoryResetter);
      dispatch(UpdateCategoryResetter);
    },
    resetAddCategoryForm: () => dispatch(reset('addNewCategory'))
  })
);

const getActions = ({ status, id, setCurrentIdSelected, setIsOpenUpdate }) => {
  return !status
    ? [
        {
          label: 'Edit category',
          action: () => {
            setIsOpenUpdate(true);
            setCurrentIdSelected(id);
          },
          icon: <Edit />
        }
      ]
    : [
        {
          label: 'Edit category',
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
    title: 'Category Name'
  },
  {
    field: 'description',
    title: 'Description'
  },
  {
    field: 'status',
    title: 'Category Status'
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
  categoriesData.map(({ categoryName, status, id, description }) => ({
    name: categoryName,
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
  }));

const CategoryManagementComponent = ({
  categoriesData,
  getCategories,
  addCategorySuccessMessage,
  resetData,
  resetAddCategoryForm,
  updateCategoryData
}) => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [currentIdSelected, setCurrentIdSelected] = useState(null);

  useEffect(() => {
    if (addCategorySuccessMessage) {
      setIsOpenAdd(false);
      resetData();
      resetAddCategoryForm();
    }
  }, [addCategorySuccessMessage]);

  useEffect(() => {
    if (updateCategoryData) {
      setIsOpenUpdate(false);
      resetData();
    }
  }, [updateCategoryData]);

  let totalCount = 0,
    page = 0,
    pageSize = 10;
  if (categoriesData) {
    totalCount = categoriesData.length;
  }

  return (
    <React.Fragment>
      <AlertDialog
        title="Add new category"
        isOpenDialog={isOpenAdd}
        setIsOpenDialog={setIsOpenAdd}
        isFooter={false}
        size="xs"
        fullWidth
        content={isOpenAdd ? <CategoryAddingComponent /> : null}
      />
      <AlertDialog
        title="Update category"
        isOpenDialog={isOpenUpdate}
        setIsOpenDialog={setIsOpenUpdate}
        isFooter={false}
        size="xs"
        fullWidth
        content={
          isOpenUpdate ? (
            <CategoryAddingComponent isUpdate id={currentIdSelected} />
          ) : null
        }
        onClose={() => {
          setIsOpenUpdate(false);
        }}
      />
      <FrameHeaderComponent title="Category management">
        <Button onClick={() => setIsOpenAdd(true)}>Add new category</Button>
      </FrameHeaderComponent>
      <ReactTableLayout
        hasPaging={false}
        dispatchAction={getCategories}
        data={getData({
          categoriesData: categoriesData || [],
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

export default connectWithRedux(CategoryManagementComponent);
