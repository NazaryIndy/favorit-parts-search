import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumber } from '../features/search/searchSlice';
import { searchProducts } from '../features/search/searchThunks.js';

function SearchForm() {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.search.number);

  useEffect(() => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 3) return;

    const timeoutId = setTimeout(() => {
      dispatch(searchProducts({ number: trimmedValue, brand: null }));
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [value, dispatch]);

  function handleChange(event) {
    dispatch(setNumber(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const number = value.trim();

    if (number.length < 3) return;

    dispatch(searchProducts({ number, brand: null }));
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="part-number" className="form-label fw-semibold">
        Артикул запчасти
      </label>

      <div className="input-group">
        <input
          id="part-number"
          className="form-control"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Например, 90915-YZZJ1"
          autoComplete="off"
        />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={value.trim().length < 3}
        >
          Найти
        </button>
      </div>

      <div className="form-text">
        Введите артикул, чтобы найти доступных производителей. Введите не менее
        3 символов для поиска.
      </div>
    </form>
  );
}

export default SearchForm;
