import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../api/axios";

export const getProduct = createAsyncThunk("getProduct", async (search) => {
  if (search) {
    const response = await instance.get(
      `products?_sort=id&_order=desc&product_name_like=${search}`
    );
    return response.data;
  } else {
    const response = await instance.get(`products?_sort=id&_order=desc`);
    return response.data;
  }
});

export const deleteProduct = createAsyncThunk("deleteProduct", async (id) => {
  await instance.delete(`products/${id}`);
});

export const addProduct = createAsyncThunk("addProduct", async (data) => {
  await instance.post(`products`, data);
  return data;
});

export const updateProduct = createAsyncThunk("updateProduct", async (cat) => {
  const { id, ...data } = cat;
  await instance.put(`products/${cat.id}`, data);
  return cat;
});

const productSlice = createSlice({
  name: "Product",
  initialState: {
    data: [],
    mess: "no mess",
    isLoadingGet: false,
    isLoadingChange: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingGet: true,
        };
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        return {
          ...state,
          mess: "ok",
          data: action.payload,
          isLoadingGet: false,
        };
      })
      .addCase(getProduct.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingGet: false,
        };
      })
      .addCase(deleteProduct.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingChange: true,
        };
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke",
          isLoadingChange: false,
        };
      })
      .addCase(deleteProduct.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingChange: false,
        };
      })
      .addCase(addProduct.pending, (state) => {
        return {
          ...state,
          mess: "pending add",
          isLoadingChange: true,
        };
      })
      .addCase(addProduct.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke add",
          isLoadingChange: false,
        };
      })
      .addCase(addProduct.rejected, (state) => {
        return {
          ...state,
          mess: "no add",
          isLoadingChange: false,
        };
      })
      .addCase(updateProduct.pending, (state) => {
        return {
          ...state,
          mess: "pending update",
          isLoadingChange: true,
        };
      })
      .addCase(updateProduct.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke update",
          isLoadingChange: false,
        };
      })
      .addCase(updateProduct.rejected, (state) => {
        return {
          ...state,
          mess: "no update",
          isLoadingChange: false,
        };
      });
  },
});

export default productSlice.reducer;
