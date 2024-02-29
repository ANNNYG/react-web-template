import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './index';

export const selectSlice = (state: RootState) => state.global;

export const globalSlice = createSelector([selectSlice], state => state);

export const selectUserId = createSelector(
  [globalSlice],
  state => state.userId,
);
