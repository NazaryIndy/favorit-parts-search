import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <h2>Страница не найдена</h2>
      <p className="text-secondary">Возможно, адрес указан неверно.</p>
      <Link className="btn btn-primary" to="/search">
        Перейти к поиску
      </Link>
    </section>
  );
}

export default NotFoundPage;
