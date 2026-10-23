import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shortlist, Creator, ShortlistItem } from '@/types';

interface ShortlistState {
  shortlists: Shortlist[];
  selectedShortlistId: string | null;
  isLoading: boolean;
  quickAddCreator: Creator | null;
  detailModalCreator: Creator | null;
}

const initialState: ShortlistState = {
  shortlists: [],
  selectedShortlistId: null,
  isLoading: false,
  quickAddCreator: null,
  detailModalCreator: null,
};

export const shortlistSlice = createSlice({
  name: 'shortlists',
  initialState,
  reducers: {
    setShortlists: (state, action: PayloadAction<Shortlist[]>) => {
      state.shortlists = action.payload;
      if (!state.selectedShortlistId && action.payload.length > 0) {
        state.selectedShortlistId = action.payload[0].id;
      }
    },
    setSelectedShortlistId: (state, action: PayloadAction<string>) => {
      state.selectedShortlistId = action.payload;
    },
    setQuickAddCreator: (state, action: PayloadAction<Creator | null>) => {
      state.quickAddCreator = action.payload;
    },
    setDetailModalCreator: (state, action: PayloadAction<Creator | null>) => {
      state.detailModalCreator = action.payload;
    },
    setShortlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addShortlist: (state, action: PayloadAction<Shortlist>) => {
      state.shortlists.unshift(action.payload);
      state.selectedShortlistId = action.payload.id;
    },
    addCreatorToShortlistState: (
      state,
      action: PayloadAction<{ shortlistId: string; item: ShortlistItem }>
    ) => {
      const shortlist = state.shortlists.find((s) => s.id === action.payload.shortlistId);
      if (shortlist) {
        const existingIdx = shortlist.items.findIndex(
          (i) => i.creatorId === action.payload.item.creatorId
        );
        if (existingIdx >= 0) {
          shortlist.items[existingIdx] = action.payload.item;
        } else {
          shortlist.items.unshift(action.payload.item);
          shortlist.creatorCount = (shortlist.creatorCount || 0) + 1;
        }
        shortlist.totalEstimatedCostINR = shortlist.items.reduce(
          (sum, i) => sum + (i.assignedFeeINR || 0),
          0
        );
      }
    },
    removeCreatorFromShortlistState: (
      state,
      action: PayloadAction<{ shortlistId: string; creatorId: string }>
    ) => {
      const shortlist = state.shortlists.find((s) => s.id === action.payload.shortlistId);
      if (shortlist) {
        shortlist.items = shortlist.items.filter(
          (i) => i.creatorId !== action.payload.creatorId
        );
        shortlist.creatorCount = shortlist.items.length;
        shortlist.totalEstimatedCostINR = shortlist.items.reduce(
          (sum, i) => sum + (i.assignedFeeINR || 0),
          0
        );
      }
    },
    updateShortlistItemFeeState: (
      state,
      action: PayloadAction<{
        shortlistId: string;
        creatorId: string;
        assignedFeeINR: number | null;
        notes?: string | null;
      }>
    ) => {
      const shortlist = state.shortlists.find((s) => s.id === action.payload.shortlistId);
      if (shortlist) {
        const item = shortlist.items.find((i) => i.creatorId === action.payload.creatorId);
        if (item) {
          if (action.payload.assignedFeeINR !== undefined) {
            item.assignedFeeINR = action.payload.assignedFeeINR;
          }
          if (action.payload.notes !== undefined) {
            item.notes = action.payload.notes;
          }
          shortlist.totalEstimatedCostINR = shortlist.items.reduce(
            (sum, i) => sum + (i.assignedFeeINR || 0),
            0
          );
        }
      }
    },
  },
});

export const {
  setShortlists,
  setSelectedShortlistId,
  setQuickAddCreator,
  setDetailModalCreator,
  setShortlistLoading,
  addShortlist,
  addCreatorToShortlistState,
  removeCreatorFromShortlistState,
  updateShortlistItemFeeState,
} = shortlistSlice.actions;

export default shortlistSlice.reducer;
