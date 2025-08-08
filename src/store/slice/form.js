// src/store.js
import { createSlice } from '@reduxjs/toolkit';

export const formSlice = createSlice({
  name: 'form',
  initialState: {
    formFields: [],
    transaction:"",
    data:""
  },
  reducers: {
    setFormFields: (state, action) => {
      state.formFields = action.payload;
    },  
    setTransaction(state, action) {
      state.transaction = action.payload;
    },
    setData:(state,action) => {
      state.data = action.payload;
    }
  },
});

export const { setFormFields,setTransaction,setData} = formSlice.actions;

export default formSlice.reducer