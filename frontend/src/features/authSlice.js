import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  user: null,
  isLoggedIn: false,
  token: null,
  loading: false,
  error: null,
};

// Utility: Save token to localStorage
const saveTokenToLocalStorage = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
  }
};

// Utility: Remove token from localStorage
const removeTokenFromLocalStorage = () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};

// Utility: Extract error message
const extractErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null; // Clear previous errors
    },
    authSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true; // Set logged-in status
      state.loading = false;
    },
    authFail(state, action) {
      state.error = action.payload; // Store error message
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false; // Reset state
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFail, logout } = authSlice.actions;

// Async Action: Sign In
export const signIn = (email, password) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signin", {
      email,
      password,
    });

    dispatch(authSuccess(response.data)); // Dispatch success action
    console.log(response.data);
    saveTokenToLocalStorage(response.data.token); // Save token to storage
  } catch (error) {
    dispatch(authFail(extractErrorMessage(error))); // Dispatch failure action
  }
};

// Async Action: Sign Up
export const signUp = (email, password) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signup", {
      email,
      password,
    });

    dispatch(authSuccess(response.data)); // Dispatch success action
    saveTokenToLocalStorage(response.data.token); // Save token to storage
  } catch (error) {
    dispatch(authFail(extractErrorMessage(error))); // Dispatch failure action
  }
};

// Async Action: Logout
export const performLogout = () => async (dispatch) => {
  try {
    removeTokenFromLocalStorage(); // Remove token from storage
    dispatch(logout()); // Reset state
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default authSlice.reducer;
