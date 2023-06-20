import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  isAuthenticated: boolean;
  user: {
    id: number, 
    fullname: string,
    email: string
  }
}

const initialState: AuthState = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  isAuthenticated: false,
  user: typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') ?? '{}')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.tokens.accessToken = '';
      state.tokens.refreshToken = '';
      state.isAuthenticated = false;
    },
    setTokens(state, action: PayloadAction<any>) {
      state.tokens.accessToken = action.payload.accessToken;
      state.tokens.refreshToken = action.payload.refreshToken;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.tokens.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.tokens.refreshToken = action.payload;
    },
    setUser(state, action: PayloadAction<any>) {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.user = action.payload
    }
  },
});

export const selectUser = (state: any) => state.user;

export const { setUser, setTokens, loginSuccess, logoutSuccess, setAccessToken, setRefreshToken } = authSlice.actions;

export default authSlice.reducer;
