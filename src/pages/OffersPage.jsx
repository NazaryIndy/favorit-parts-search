import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectBrand, setNumber } from '../features/search/searchSlice';
import { searchProducts } from '../features/search/searchThunks.js';
import Loader from '../components/Loader.jsx';
import OffersProductTable from '../components/OffersProductTable.jsx';

function OffersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const number = searchParams.get('number')?.trim() ?? '';
  const brand = searchParams.get('brand')?.trim() ?? '';

  const { selectedBrand, offers, offersStatus, offersError } = useSelector(
    (state) => state.search,
  );

  useEffect(() => {
    if (!number || !brand) {
      navigate('/search', { replace: true });
      return;
    }

    dispatch(setNumber(number));
    dispatch(selectBrand(brand));
    dispatch(searchProducts({ number, brand }));
  }, [dispatch, navigate, number, brand]);

  function handleBack() {
    navigate(`/search?${new URLSearchParams({ number }).toString()}`);
  }

  const isCurrentSelection = selectedBrand === brand;

  const isLoading =
    !isCurrentSelection ||
    offersStatus === 'idle' ||
    offersStatus === 'loading';

  return (
    <section className="results-section">
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={handleBack}
      >
        ← К выбору производителя
      </button>

      <h2 className="section-title">Предложения производителя {brand}</h2>

      {isLoading && <Loader />}

      {isCurrentSelection && offersStatus === 'failed' && offersError && (
        <div className="alert alert-danger" role="alert">
          <h3 className="h6">Не удалось загрузить предложения</h3>
          <p className="mb-0">{offersError}</p>
        </div>
      )}

      {isCurrentSelection &&
        offersStatus === 'succeeded' &&
        offers.length === 0 && (
          <div className="alert alert-info" role="status">
            Предложения и аналоги не найдены.
          </div>
        )}

      {selectedBrand === brand && offersStatus === 'succeeded' && (
        <OffersProductTable />
      )}
    </section>
  );
}

export default OffersPage;
