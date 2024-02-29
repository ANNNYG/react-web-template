import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface GlobalStateInf {
  userId: string;
}

const GLOBAL_STATE: GlobalStateInf = {
  userId: 'YG123456',
};

const globalSlice = createSlice({
  name: 'global',
  initialState: GLOBAL_STATE,
  reducers: {
    changeUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export { store, globalSlice, GLOBAL_STATE };
