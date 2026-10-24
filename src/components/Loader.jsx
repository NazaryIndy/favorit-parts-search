function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 py-4">
      <div
        className="spinner-border spinner-border-sm text-primary"
        role="status"
      >
        <span className="visually-hidden">Загрузка...</span>
      </div>

      <span className="text-secondary">Загружаем данные...</span>
    </div>
  );
}

export default Loader;
