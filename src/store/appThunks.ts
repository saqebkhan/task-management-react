import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from './appSlice';

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'app/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/current');
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data as User;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to get current user');
    }
  }
);