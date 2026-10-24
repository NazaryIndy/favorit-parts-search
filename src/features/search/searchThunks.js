import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../../services/api';
import { getOffersKey, normalizeNumber } from './searchUtils.js';

const inFlight = new Set();

const getRequestKey = (number, brand) =>
  brand ? getOffersKey(number, brand) : normalizeNumber(number);

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async ({ number, brand }, { rejectWithValue }) => {
    const key = getRequestKey(number, brand);
    inFlight.add(key);

    try {
      return await fetchProducts(number, brand);
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось получить данные');
    } finally {
      inFlight.delete(key);
    }
  },
  {
    condition: ({ number, brand }, { getState }) => {
      const state = getState().search;
      const normalizedNumber = normalizeNumber(number);

      if (!normalizedNumber) {
        return false;
      }

      const key = getRequestKey(number, brand);

      if (inFlight.has(key)) {
        return false;
      }

      if (brand) {
        return !Object.hasOwn(state.offersCache, key);
      }

      return !Object.hasOwn(state.brandsCache, normalizedNumber);
    },
  },
);
