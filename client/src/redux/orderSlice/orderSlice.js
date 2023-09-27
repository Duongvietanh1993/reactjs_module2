import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../api/axios";

export const getOrder = createAsyncThunk("getOrder", async (search) => {
  try {
    const response = await instance.get(
      `orders?_sort=id&_order=desc&orderName_like=${search}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const changeActiveOrder = createAsyncThunk(
  "changeActiveOrder",
  async (order) => {
    try {
      await instance.patch(`orders/${order.id}`, {
        status: !order.status,
      });
      return order.id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    mess: "no mess",
    isLoadingGet: false,
    isLoadingChange: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingGet: true,
        };
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        return {
          ...state,
          mess: "ok",
          data: action.payload,
          isLoadingGet: false,
        };
      })
      .addCase(getOrder.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingGet: false,
        };
      })
      .addCase(changeActiveOrder.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingChange: true,
        };
      })
      .addCase(changeActiveOrder.fulfilled, (state, action) => {
        return {
          ...state,
          mess: "oke",
          isLoadingChange: false,
        };
      })
      .addCase(changeActiveOrder.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingChange: false,
        };
      })
     
  },
});


export default orderSlice.reducer;
