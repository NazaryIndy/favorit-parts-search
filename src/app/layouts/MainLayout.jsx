import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <main className="app">
      <div className="search-page">
        <header className="app-header mb-4">
          <p className="text-primary fw-semibold text-uppercase small mb-2">
            Favorit-parts
          </p>

          <h1 className="app-title">Поиск автозапчастей</h1>

          <p className="text-secondary mb-0">
            Найдите запчасть по артикулу и сравните предложения.
          </p>
        </header>

        <Outlet />
      </div>
    </main>
  );
}

export default MainLayout;
