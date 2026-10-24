const API_URL = '/api';
const API_KEY = import.meta.env.VITE_FAVORIT_API_KEY;

const ERROR_MESSAGES = {
  'Empty key!': 'Не указан ключ доступа к API.',
  'Invalid key client!': 'Неверный ключ доступа к API.',
  'Empty number goods!': 'Введите артикул.',
  'Request quota exceeded!': 'Превышен лимит запросов к API. Попробуйте позже.',
};

const ZERO_GUID = '00000000-0000-0000-0000-000000000000';

export async function fetchProducts(number, brand) {
  if (!API_KEY) {
    throw new Error('Не задан ключ доступа к API.');
  }

  const params = new URLSearchParams({
    key: API_KEY,
    number,
  });

  if (brand) {
    params.set('brand', brand);
    params.set('analogues', 'on');
  }

  let response;

  try {
    response = await fetch(`${API_URL}?${params}`);
  } catch {
    throw new Error(
      'Не удалось связаться с сервером. Проверьте подключение к сети.',
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Сервер вернул некорректный ответ (HTTP ${response.status}).`,
    );
  }

  if (!response.ok || data.error) {
    const message = Array.isArray(data.error)
      ? data.error.join(', ')
      : data.error;

    throw new Error(
      ERROR_MESSAGES[message] ??
        message ??
        `Ошибка сервера (HTTP ${response.status}).`,
    );
  }

  return Array.isArray(data.goods)
    ? data.goods.filter((item) => item.goodsID !== ZERO_GUID)
    : [];
}
