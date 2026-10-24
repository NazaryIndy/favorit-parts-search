import { createSlice } from '@reduxjs/toolkit';
import { searchProducts } from './searchThunks.js';
import { getOffersKey, normalizeNumber } from './searchUtils.js';

const initialState = {
  number: '',
  brands: [],
  selectedBrand: null,
  offers: [],

  brandsCache: {},
  offersCache: {},

  brandsStatus: 'idle',
  offersStatus: 'idle',
  brandsError: null,
  offersError: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,

  reducers: {
    setNumber(state, action) {
      const number = action.payload;
      const previousNumber = normalizeNumber(state.number);
      const nextNumber = normalizeNumber(number);

      state.number = number;

      if (previousNumber === nextNumber) {
        return;
      }

      state.selectedBrand = null;
      state.offers = [];
      state.offersStatus = 'idle';
      state.offersError = null;

      if (Object.hasOwn(state.brandsCache, nextNumber)) {
        state.brands = state.brandsCache[nextNumber];
        state.brandsStatus = 'succeeded';
        state.brandsError = null;
      } else {
        state.brands = [];
        state.brandsStatus = 'idle';
        state.brandsError = null;
      }
    },

    selectBrand(state, action) {
      const brand = action.payload;
      const key = getOffersKey(state.number, brand);

      state.selectedBrand = brand;
      state.offersError = null;

      if (Object.hasOwn(state.offersCache, key)) {
        state.offers = state.offersCache[key];
        state.offersStatus = 'succeeded';
      } else {
        state.offers = [];
        state.offersStatus = 'idle';
      }
    },

    resetResults(state) {
      // Сбрасываем отображаемые результаты, но сохраняем кэш.
      state.selectedBrand = null;
      state.offers = [];
      state.offersStatus = 'idle';
      state.offersError = null;

      const key = normalizeNumber(state.number);

      if (Object.hasOwn(state.brandsCache, key)) {
        state.brands = state.brandsCache[key];
        state.brandsStatus = 'succeeded';
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state, action) => {
        const { number, brand } = action.meta.arg;

        if (normalizeNumber(state.number) !== normalizeNumber(number)) {
          return;
        }

        if (brand) {
          if (state.selectedBrand !== brand) {
            return;
          }

          state.offersStatus = 'loading';
          state.offersError = null;
        } else {
          state.brandsStatus = 'loading';
          state.brandsError = null;
        }
      })

      .addCase(searchProducts.fulfilled, (state, action) => {
        const { number, brand } = action.meta.arg;
        const result = action.payload;
        const normalizedNumber = normalizeNumber(number);

        if (brand) {
          const key = getOffersKey(number, brand);

          state.offersCache[key] = result;

          if (
            normalizeNumber(state.number) !== normalizedNumber ||
            state.selectedBrand !== brand
          ) {
            return;
          }

          state.offers = result;
          state.offersStatus = 'succeeded';
          state.offersError = null;
        } else {
          state.brandsCache[normalizedNumber] = result;

          if (normalizeNumber(state.number) !== normalizedNumber) {
            return;
          }

          state.brands = result;
          state.brandsStatus = 'succeeded';
          state.brandsError = null;
        }
      })

      .addCase(searchProducts.rejected, (state, action) => {
        if (action.meta.condition) {
          return;
        }

        const { number, brand } = action.meta.arg;

        if (normalizeNumber(state.number) !== normalizeNumber(number)) {
          return;
        }

        if (brand) {
          if (state.selectedBrand !== brand) {
            return;
          }

          state.offersStatus = 'failed';
          state.offersError =
            action.payload || 'Не удалось получить предложения';
        } else {
          state.brandsStatus = 'failed';
          state.brandsError =
            action.payload || 'Не удалось найти производителей';
        }
      });
  },
});

export const { setNumber, resetResults, selectBrand } = searchSlice.actions;

export default searchSlice.reducer;
