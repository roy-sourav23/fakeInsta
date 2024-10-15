import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  message: null,
};

const fetchUserData = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userRef);

  let userData = null;
  if (userDocSnap.exists()) {
    userData = userDocSnap.data();
  } else {
    console.log("no such user");
  }
  return userData;
};

export const userUpdated = createAsyncThunk("auth/userUpdated", async (uid) => {
  const userRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userRef);
  const userData = userDocSnap.data();

  return userData;
});

export const userLoggedIn = createAsyncThunk(
  "auth/userLoggedIn",
  async (user) => {
    const response = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    const { uid } = response.user;

    const current_user = await fetchUserData(uid);
    return current_user;
  }
);

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout(state, action) {
      state.user = null;
      state.message = "user logged out successfully!";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoggedIn.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userLoggedIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.message = "user successfuly logged in";
    });
    builder.addCase(userLoggedIn.rejected, (state, action) => {
      state.message = "can not sign in!";
      state.isError = true;
    });

    builder.addCase(userUpdated.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default LoginSlice.reducer;
export const { logout } = LoginSlice.actions;
