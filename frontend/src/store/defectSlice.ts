import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Defect {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: number;
  project_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

interface DefectState {
  defects: Defect[];
  loading: boolean;
  error: string | null;
}

const initialState: DefectState = {
  defects: [],
  loading: false,
  error: null,
};

const defectSlice = createSlice({
  name: 'defects',
  initialState,
  reducers: {
    setDefects: (state, action: PayloadAction<Defect[]>) => {
      state.defects = action.payload;
    },
    addDefect: (state, action: PayloadAction<Defect>) => {
      state.defects.push(action.payload);
    },
    updateDefect: (state, action: PayloadAction<Defect>) => {
      const index = state.defects.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.defects[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setDefects, addDefect, updateDefect, setLoading, setError } = defectSlice.actions;
export default defectSlice.reducer;