# Admin Fast Cart

Панели идоракунӣ (Admin Panel) барои дӯкони онлайн **Fast Cart**.
Бо backend-и `store-api.softclub.tj` тавассути REST API кор мекунад.

## Технологияҳо
React + TypeScript · Vite · Tailwind CSS v4 · Zustand · React Router · React Hook Form · Axios (interceptors) · AOS · lucide-react

## Оғоз
```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL-ро пур кунед
npm run dev
```

## Скриптҳо
| Команда | Кор |
|---|---|
| `npm run dev` | Сервери development |
| `npm run build` | Build + typecheck |
| `npm run preview` | Пешнамоиши build |
| `npm run lint` | Lint (oxlint) |

## Сохтор
```
src/
  components/   ui, layout, shared, dashboard, products, categories
  pages/        Login, Dashboard, Products, Orders, Categories, Customers
  services/     axios instance + interceptors + API calls
  store/        zustand (auth, toast)
  types/        domain types
  lib/          utils (cn, formatPrice, imageUrl)
```

## Амният
URL-и backend дар `.env` (`VITE_API_BASE_URL`) нигоҳ дошта мешавад ва ба `.gitignore` дохил аст — дар коди публикшуда намоён нест.

## Эзоҳ
Backend endpoint-и **Orders** надорад, бинобар ин саҳифаи Orders ҳамчун UI бо маълумоти намунавӣ сохта шудааст. Customers ба `UserProfile` пайваст аст.
