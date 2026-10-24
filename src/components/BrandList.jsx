import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectBrand } from '../features/search/searchSlice';

function BrandList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { number, brands, selectedBrand, brandsStatus } = useSelector(
    (state) => state.search,
  );

  if (selectedBrand || brands.length === 0) {
    return null;
  }

  const uniqueBrands = [
    ...new Map(
      brands.filter((item) => item.brand).map((item) => [item.brand, item]),
    ).values(),
  ];

  function handleSelectBrand(brand) {
    const trimmedNumber = number.trim();

    dispatch(selectBrand(brand));

    const params = new URLSearchParams({
      number: trimmedNumber,
      brand,
    });

    navigate(`/offers?${params.toString()}`);
  }

  if (uniqueBrands.length === 0) {
    return null;
  }

  return (
    <section className="results-section">
      <h2 className="section-title">Выберите производителя</h2>

      <p className="text-secondary small">
        Найдено производителей: {uniqueBrands.length}
      </p>

      <div className="list-group">
        {uniqueBrands.map((item) => (
          <button
            key={item.brand}
            type="button"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => handleSelectBrand(item.brand)}
            disabled={brandsStatus === 'loading'}
          >
            <span>
              <span className="fw-semibold">{item.brand}</span>

              {item.name && (
                <span className="d-block text-secondary small">
                  {item.name}
                </span>
              )}
            </span>

            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default BrandList;
