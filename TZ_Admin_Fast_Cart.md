# Техникии Супориш (ТЗ) — Admin Fast Cart

## 1. Маълумоти умумӣ
- **Номи лоиҳа:** Admin Fast Cart
- **Намуди лоиҳа:** Веб-аппликейшн — Панели идоракунӣ (Admin Panel) барои дӯкони онлайн
- **Backend API:** https://store-api.softclub.tj/swagger/index.html

## 2. Мақсади лоиҳа
Сохтани панели идоракунӣ (admin panel) барои дӯкони онлайн "Fast Cart", ки тавассути он соҳиб/менеҷер метавонад маҳсулот, категорияҳо, фармоишҳо ва муштариёнро идора кунад. Панел бо backend-и мавҷуда (store-api.softclub.tj) тавассути REST API кор мекунад.

## 3. Технологияҳои истифодашаванда

| Қисмат | Технология |
|---|---|
| Frontend framework | React + TypeScript (.tsx) |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI компонентҳо | shadcn/ui |
| Иконкаҳо | lucide-react (танҳо функсионалӣ, бе зиёдаравӣ) |
| Формаҳо | React Hook Form |
| State management (глобалӣ) | Zustand |
| Роутинг | React Router |
| Анимация | AOS — танҳо **як** анимацияи хушсалиқа ва классикӣ дар тамоми сайт |
| HTTP клиент | Axios + Axios Interceptors |
| Тағйирёбандаҳои муҳит | .env |


## 4. Талаботи амниятӣ
- URL-и асосии backend API **набояд** дар коди намоён (client-side, e.g. дар GitHub) кушод бошад.
  - Нигоҳ доштан дар файли `.env` (масалан `VITE_API_BASE_URL`)
  - `.env` ба `.gitignore` дохил карда шавад
- Axios Interceptors барои:
  - Гузоштани токени аутентификатсия ба сарлавҳаи (header) ҳар дархост
  - Идоракунии хатогиҳои 401/403 (масалан баргардонидан ба саҳифаи Login)
  - Идоракунии марказонидашудаи хатогиҳо/хабарҳо (error toast)

## 5. Талаботи дизайн ва коди
- **Рангҳо:** на рангҳои стандартии "AI-генератсия"-шуда (generic gradient/blue-purple), балки палитаи рангҳои бо дасти инсон интихобшуда, мувофиқ ба бренди "Fast Cart"
- **Skill барои сифати дизайн:** `taste-skill` (`npx skills add Leonxlnx/taste-skill`) — истифода ҳангоми коди фронтенд
- Иконкаҳои зиёдатӣ/декоративӣ (бефоида) истифода **набаранд** — танҳо иконкаҳои функсионалӣ (масалан дар тугмаҳо, навигация)
- Ба ҳои иконка/мавҳум — дар ҷойҳои маҳсулот ва баннер **расмҳои воқеӣ** истифода шаванд
- Код бояд **тоза, хоно ва фаҳмо** бошад: номгузории мантиқӣ, ҷузъиёт (components) хурд ва вазифадор, бе такрор (DRY)



## 6. Дизайн (аз mockup-ҳои `Ecommerce (2)`)

Дизайн аз расмҳои тайёр гирифта мешавад: `C:\Users\USER\Desktop\Ecommerce (2)\` (Dashboard, Orders, Products, Categories, Detail products, Log in, Modal ва ғ.)

**Палитаи рангҳо:**
| Элемент | Ранг |
|---|---|
| Sidebar (паҳлӯи чап) | Тираи navy/dark `#111927` гуногун (хеле тира) |
| Фон асосӣ | Сафед `#FFFFFF` |
| Тугмаи асосӣ (Primary / Add / Save) | Кабуди равшан `#2563EB` (blue) |
| Логотип "fastcart" | Сафед + аробача зард/кабуд |
| Текст асосӣ | Тираи navy `#111927` |
| Текст дуюмдараҷа | Хокистарӣ `#6B7280` |
| Badge "Paid" / Success | Сабзи равшан (фони сабзи кушод) |
| Badge "Pending" | Хокистарӣ кушод |
| Badge "Ready" | Норинҷӣ `#F59E0B` |
| Badge "Shipped" | Бунафши тира/хокистарӣ |
| Badge "Received" | Кабуд |
| Хатари ҳазф (Delete) | Сурх `#EF4444` |

**Layout:**
- **Sidebar тираи собит** дар чап: логотип "fastcart" + менюҳо (Dashboard, Orders [badge шумора], Products, Other) бо иконкаҳои lucide
- **Header боло:** сатри ҷустуҷӯ (Search), занги notification (badge), аватар + номи корбар + dropdown
- **Контент:** сафед, сарлавҳаи саҳифа калон + тугмаи амал (масалан "+ Add order") дар тарафи рост
- **Ҷадвалҳо:** сатрҳои тоза, checkbox интихоб, иконкаҳои таҳрир (кабуд) ва ҳазф (сурх), pagination дар поён + "274 Results"
- **Filter dropdown** ("Newest") ва сатри ҷустуҷӯ дар болои ҷадвал
- **Categories:** grid-и кортҳо (иконка + ном + тугмаи таҳрир), tabs: Categories / Brands / Banners
- **Detail/Add product:** ду сутун — чап (Information, Price, Options) ва рост (Colour picker, Tags, Images upload)
- **Modal:** марказонида, "Cancel" (кабуд пур) + "Delete" (сурх outline), тугмаи бастан ✕

**Услуб:** гӯшаҳои мудаввар (rounded), сояи нарм (soft shadow) дар кортҳо, фосилаи кофӣ (whitespace), typography тоза.

## 7. Модулҳои лоиҳа

1. **Воридшавӣ (Authentication)** — саҳифаи Login, муҳофизати роутҳо (Protected Routes)
2. **Dashboard** — статистикаи умумӣ (фурӯш, шумораи фармоишҳо, муштариён)
3. **Маҳсулот (Products)** — рӯйхат, илова/таҳрир/ҳазф (CRUD), category, нарх, расм
4. **Категорияҳо (Categories)** — CRUD
5. **Фармоишҳо (Orders)** — рӯйхат, тафсилот, тағйири статус
6. **Муштариён (Customers)** — рӯйхат, тафсилот
7. **Профил/Танзимот (Profile / Settings)**

## 8. Сохтори техникии лоиҳа
- Структура: `src/components`, `src/pages`, `src/hooks`, `src/store` (zustand), `src/services` (axios + API calls), `src/types`, `src/lib`
- Ҳар саҳифа/компонент дар файли алоҳида, бе логикаи омехта дар як файл

## 9. Меъёрҳои қабули кор (Acceptance Criteria)
- Тамоми модулҳои дар боло номбаршуда фаъол ва бо backend пайваст
- Сайт responsive (мобил, таблет, desktop)
- Бе хатогии TypeScript/ESLint ҳангоми build
- URL-и backend дар коди публикшуда (GitHub) намоён нест
- Анимацияи AOS танҳо як хел ва дар ҳама ҷо ҳамоҳанг

## 10. Эзоҳҳо
- Дастури насби skill (`npx skills add Leonxlnx/taste-skill`) дар ин ҳуҷҷат сабт шуд барои истинод; иҷрои воқеии он ҳангоми сар шудани кодинг анҷом дода мешавад.
