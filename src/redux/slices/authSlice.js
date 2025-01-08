import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        adminDetails: null, 
    },
    reducers: {
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload;
        },
        setAdminDetails: (state, action) => {
            state.adminDetails = action.payload;
        }
    }
})

export const { setAuthenticated, setAdminDetails } = authSlice.actions;
export default authSlice.reducer;