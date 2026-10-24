import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { resetResults, setNumber } from '../features/search/searchSlice';
import { searchProducts } from '../features/search/searchThunks.js';
import SearchForm from '../components/SearchForm.jsx';
import Loader from '../components/Loader.jsx';
import BrandList from '../components/BrandList.jsx';

function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const numberFromUrl = searchParams.get('number')?.trim() ?? '';

  const { brands, selectedBrand, brandsStatus, offersStatus, brandsError } =
    useSelector((state) => state.search);

  useEffect(() => {
    dispatch(resetResults());

    if (!numberFromUrl) {
      return;
    }

    dispatch(setNumber(numberFromUrl));
    dispatch(searchProducts({ number: numberFromUrl, brand: null }));
  }, [dispatch, numberFromUrl]);

  const isLoading = brandsStatus === 'loading' || offersStatus === 'loading';

  return (
    <>
      <section className="search-card card border-0 shadow-sm">
        <div className="card-body p-4">
          <SearchForm />
        </div>
      </section>

      {isLoading && <Loader />}

      {brandsStatus === 'failed' && brandsError && (
        <div className="alert alert-danger mt-4" role="alert">
          <h2 className="h6">Не удалось найти производителей</h2>
          <p className="mb-0">{brandsError}</p>
        </div>
      )}

      {brandsStatus === 'succeeded' &&
        !selectedBrand &&
        brands.length === 0 && (
          <div className="alert alert-info mt-4" role="status">
            По этому артикулу производители не найдены.
          </div>
        )}

      <div className="results">
        <BrandList />
      </div>
    </>
  );
}

export default SearchPage;
