import { useSelector } from 'react-redux';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

function formatPrice(price) {
  if (price === null || price === undefined || price === '') {
    return '—';
  }

  const value = Number(price);

  return Number.isFinite(value) ? currencyFormatter.format(value) : '—';
}

function getUniqueProducts(products) {
  return [
    ...new Map(products.map((product) => [product.goodsID, product])).values(),
  ];
}

function buildRows(products) {
  return getUniqueProducts(products).flatMap((product) => {
    const warehouses = Array.isArray(product.warehouses)
      ? product.warehouses
      : [];

    if (warehouses.length === 0) {
      return [{ product, warehouse: null }];
    }

    return warehouses.map((warehouse) => ({
      product,
      warehouse,
    }));
  });
}

function ProductRows({ products }) {
  return buildRows(products).map(({ product, warehouse }) => (
    <tr key={`${product.goodsID}-${warehouse?.id ?? 'no-warehouse'}`}>
      <td className="fw-semibold">{product.number || '—'}</td>
      <td>{product.name || '—'}</td>
      <td>{product.brand || '—'}</td>
      <td>{warehouse?.code || '—'}</td>
      <td>{formatPrice(warehouse?.price)}</td>
      <td>{warehouse ? (warehouse.stock ?? 0) : 'Нет в наличии'}</td>
    </tr>
  ));
}

function OffersProductTable() {
  const offers = useSelector((state) => state.search.offers);

  if (offers.length === 0) {
    return null;
  }

  const analogues = offers.flatMap((item) =>
    Array.isArray(item.analogues) ? item.analogues : [],
  );

  return (
    <section className="results-section">
      <div className="table-responsive">
        <table className="table table-hover align-middle offers-table">
          <thead className="table-light">
            <tr>
              <th scope="col">Артикул</th>
              <th scope="col">Наименование</th>
              <th scope="col">Производитель</th>
              <th scope="col">Склад</th>
              <th scope="col">Цена</th>
              <th scope="col">Остаток</th>
            </tr>
          </thead>

          <tbody>
            <tr className="table-light">
              <th colSpan={6} scope="rowgroup" className="py-3 text-center">
                Основная позиция
              </th>
            </tr>
            <ProductRows products={offers} />

            {analogues.length > 0 && (
              <>
                <tr className="table-light">
                  <th colSpan={6} scope="rowgroup" className="py-3 text-center">
                    Аналоги
                  </th>
                </tr>
                <ProductRows products={analogues} />
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OffersProductTable;
