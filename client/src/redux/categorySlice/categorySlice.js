import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../api/axios";

export const getCategory = createAsyncThunk("getCategory", async (search) => {
  
  if (search){
    const response = await instance.get(`categories?_sort=id&_order=desc&category_name_like=${search}`);
    return response.data;
  }else{
    const response = await instance.get(`categories?_sort=id&_order=desc`);
    return response.data;
  }
  
});

export const deleteCategory = createAsyncThunk("deleteCategory", async (id) => {
  await instance.delete(`categories/${id}`);
});

export const addCategory = createAsyncThunk("addCategory", async (data) => {
  await instance.post(`categories`, data);
  return data;
});

export const updateCategory = createAsyncThunk("updateCategory", async (cat) => {
    const { id, ...data } = cat
    // console.log("id: ", id, "data: ", data);
    await instance.put(`categories/${cat.id}`, data)
    return cat
})

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    mess: "no mess",
    isLoadingGet: false,
    isLoadingChange: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategory.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingGet: true,
        };
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        return {
          ...state,
          mess: "ok",
          data: action.payload,
          isLoadingGet: false,
        };
      })
      .addCase(getCategory.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingGet: false,
        };
      })
      .addCase(deleteCategory.pending, (state) => {
        return {
          ...state,
          mess: "pending",
          isLoadingChange: true,
        };
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke",
          isLoadingChange: false,
        };
      })
      .addCase(deleteCategory.rejected, (state) => {
        return {
          ...state,
          mess: "no",
          isLoadingChange: false,
        };
      })
      .addCase(addCategory.pending, (state) => {
        return {
          ...state,
          mess: "pending add",
          isLoadingChange: true,
        };
      })
      .addCase(addCategory.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke add",
          isLoadingChange: false,
        };
      })
      .addCase(addCategory.rejected, (state) => {
        return {
          ...state,
          mess: "no add",
          isLoadingChange: false,
        };
      })
        .addCase(updateCategory.pending, (state) => {
        return {
          ...state,
          mess: "pending update",
          isLoadingChange: true,
        };
      })
      .addCase(updateCategory.fulfilled, (state) => {
        return {
          ...state,
          mess: "oke update",
          isLoadingChange: false,
        };
      })
      .addCase(updateCategory.rejected, (state) => {
        return {
          ...state,
          mess: "no update",
          isLoadingChange: false,
        };
      });
  },
});

export default categorySlice.reducer;
