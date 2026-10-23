import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  platform: 'ALL' | 'INSTAGRAM' | 'YOUTUBE';
  city: string;
  niche: string;
  minFollowers: number;
  maxFollowers: number;
  minEngagement: number;
  search: string;
  page: number;
  limit: number;
}

const initialState: FilterState = {
  platform: 'ALL',
  city: 'All',
  niche: 'All',
  minFollowers: 5000,
  maxFollowers: 500000,
  minEngagement: 1.0,
  search: '',
  page: 1,
  limit: 12,
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPlatform: (state, action: PayloadAction<'ALL' | 'INSTAGRAM' | 'YOUTUBE'>) => {
      state.platform = action.payload;
      state.page = 1;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
      state.page = 1;
    },
    setNiche: (state, action: PayloadAction<string>) => {
      state.niche = action.payload;
      state.page = 1;
    },
    setMinFollowers: (state, action: PayloadAction<number>) => {
      state.minFollowers = action.payload;
      state.page = 1;
    },
    setMaxFollowers: (state, action: PayloadAction<number>) => {
      state.maxFollowers = action.payload;
      state.page = 1;
    },
    setMinEngagement: (state, action: PayloadAction<number>) => {
      state.minEngagement = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: (state) => {
      state.platform = 'ALL';
      state.city = 'All';
      state.niche = 'All';
      state.minFollowers = 5000;
      state.maxFollowers = 500000;
      state.minEngagement = 1.0;
      state.search = '';
      state.page = 1;
    },
  },
});

export const {
  setPlatform,
  setCity,
  setNiche,
  setMinFollowers,
  setMaxFollowers,
  setMinEngagement,
  setSearch,
  setPage,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
