# Elsolcansado Blog

Headless-блог на **Next.js 16** + **WordPress** (REST API). WordPress используется только как CMS: контент редактируется в админке, а публичный сайт отдаётся Next.js-приложением.

## Суть проекта

| Часть | Назначение |
|-------|------------|
| **Next.js** (`app/`, `frontend/`) | Публичный фронтенд: страницы, виджеты, UI-компоненты |
| **WordPress** (`wordpress/`, Docker) | Хранение и редактирование записей, страниц, рубрик, тегов, комментариев |
| **`lib/wordpress.ts`** | Единая точка доступа к WordPress REST API |
| **Плагин `next-revalidate`** | Webhook для инвалидации кэша Next.js при изменении контента |

Фронтенд организован по слоям:

```
frontend/
├── entities/     # Сущности (post, comment)
├── widgets/      # Составные блоки (header, footer, featured-posts, post-detail)
└── shared/       # UI-kit, конфиги, утилиты
```

---

## Быстрый старт

### 1. Next.js

```bash
pnpm install
cp .env.example .env.local
# заполните .env.local (см. ниже)
pnpm dev
```

Сайт: `http://localhost:3000`

### 2. WordPress (локальный стенд через Docker)

```bash
cp .env.docker.example .env.docker
# заполните .env.docker
docker compose up -d
```

WordPress: `http://localhost:8080` (порт задаётся в `WORDPRESS_PORT`)

> При первом запуске WordPress устанавливается автоматически через WP-CLI (см. `wordpress/setup.sh`).

### 3. Связать WordPress и Next.js

В `.env.local`:

```bash
WORDPRESS_URL="http://localhost:8080"
WORDPRESS_HOSTNAME="localhost"
WORDPRESS_WEBHOOK_SECRET="..."   # тот же секрет, что в .env.docker
```

В `.env.docker`:

```bash
NEXTJS_URL=http://host.docker.internal:3000
WORDPRESS_WEBHOOK_SECRET=...     # тот же секрет
```

---

## Переменные окружения

### Next.js (`.env.local`)

| Переменная | Обязательна | Описание |
|------------|-------------|----------|
| `WORDPRESS_URL` | да | Полный URL WordPress, например `http://localhost:8080` |
| `WORDPRESS_HOSTNAME` | да | Домен для `next/image` (без протокола) |
| `WORDPRESS_WEBHOOK_SECRET` | для revalidation | Секрет webhook; должен совпадать с настройкой плагина |

Сгенерировать секрет:

```bash
openssl rand -base64 32
```

### Docker / WordPress (`.env.docker`)

См. `.env.docker.example` — учётные данные MySQL, админ WordPress, `NEXTJS_URL`, `WORDPRESS_WEBHOOK_SECRET`.

---

## WordPress на стенде: общий чек-лист

Выполните один раз после развёртывания WordPress.

### Базовая настройка

- [ ] **Настройки → Постоянные ссылки** — любой вариант кроме «Простые» (нужен для REST API)
- [ ] Проверить REST API: `{WORDPRESS_URL}/wp-json/wp/v2/posts` возвращает JSON
- [ ] Установлена и активирована **headless-тема** (`nextjs-headless`) — входит в Docker-образ; редиректит публичный фронт WordPress на Next.js
- [ ] Установлен и активирован плагин **`next-revalidate`** — входит в `plugin/next-revalidate`, монтируется в Docker

### Плагин next-revalidate

- [ ] **Настройки → Next.js Revalidation**
- [ ] **Next.js URL** — URL фронтенда (локально: `http://host.docker.internal:3000`)
- [ ] **Webhook Secret** — совпадает с `WORDPRESS_WEBHOOK_SECRET` в `.env.local`
- [ ] Тест: опубликовать/изменить запись → изменения появляются на фронте после revalidation

### Контент для разработки

- [ ] Создать несколько записей с **миниатюрой** (Featured Image)
- [ ] Назначить **рубрики** и **теги**
- [ ] Заполнить **профиль автора** (Имя, Биография) — **Пользователи → Профиль**
- [ ] Убедиться, что записи в статусе **Опубликовано**

---

## Фичи и настройки WordPress

> **Правило для разработки:** каждая новая фича, требующая плагин, настройку или переменную окружения в WordPress, **обязательно** документируется в этом разделе.

### Главная страница — сетка «Избранное»

| | |
|---|---|
| **Маршрут** | `/` |
| **Код** | `app/page.tsx`, `frontend/widgets/featured-posts/` |
| **Данные** | Последние 5 записей через `getPostsPaginated(1, 5)` |
| **WordPress** | Опубликованные записи с `_embed` (миниатюра, рубрика) |

**Чек-лист WordPress:**

- [ ] Есть хотя бы одна опубликованная запись
- [ ] У записей задана миниатюра (необязательно, но рекомендуется)

---

### Страница записи

| | |
|---|---|
| **Маршрут** | `/posts/[slug]` |
| **Код** | `app/posts/[slug]/page.tsx`, `frontend/widgets/post-detail/` |

**Чек-лист WordPress:**

- [ ] Запись опубликована
- [ ] Миниатюра задана (для hero-изображения)
- [ ] Рубрика назначена (для хлебных крошек и бейджа)
- [ ] Теги назначены (для блока тегов внизу статьи)
- [ ] Биография автора заполнена (для сайдбара «О авторе»)

---

### Хлебные крошки

| | |
|---|---|
| **Код** | `frontend/shared/ui/breadcrumbs.tsx` |
| **Цепочка** | Главная → Статьи → {Рубрика} |
| **WordPress** | У записи должна быть назначена рубрика |

**Чек-лист WordPress:**

- [ ] У записи есть хотя бы одна рубрика

---

### Сайдбар «Последние посты»

| | |
|---|---|
| **Код** | `frontend/widgets/post-detail/post-sidebar.tsx`, `frontend/entities/post/ui/recent-post-item.tsx` |
| **Данные** | 4 последние записи, кроме текущей |

**Чек-лист WordPress:**

- [ ] Несколько опубликованных записей (для наполнения блока)

---

### Комментарии

| | |
|---|---|
| **Код** | `frontend/entities/comment/`, `app/api/comments/route.ts` |
| **API** | `GET/POST /api/comments` → WordPress `/wp-json/wp/v2/comments` |
| **WordPress** | Плагин `next-revalidate` или тема `nextjs-headless` включают фильтр `rest_allow_anonymous_comments` |

> **Важно:** настройки **Настройки → Обсуждение** и флаг «Разрешить комментарии» у записи **недостаточны** для headless-сайта. WordPress REST API по умолчанию **запрещает** анонимное создание комментариев (ошибка `rest_comment_login_required`: «необходимо авторизоваться»), даже если в админке гостевые комментарии разрешены. Фильтр `rest_allow_anonymous_comments` уже добавлен в `plugin/next-revalidate` и `wordpress/theme/functions.php`.

**Чек-лист WordPress:**

- [ ] Плагин `next-revalidate` **активен** (фильтр REST API подключается через него)
- [ ] **Настройки → Обсуждение** → включить «Разрешить оставлять комментарии к новым записям»
- [ ] Для гостевых комментариев: **снять** «Пользователи должны быть зарегистрированы и авторизованы, чтобы оставлять комментарии»
- [ ] При необходимости модерации: «Комментарий должен быть одобрен вручную» — комментарий уйдёт в очередь, на фронте покажется сообщение «отправлен на модерацию»
- [ ] У конкретной записи: **Обсуждение → Разрешить комментарии** (не «Закрыто»)

**Поля формы на фронте:** имя, email, текст (требования WordPress REST API для гостей).

**Если после обновления кода ошибка остаётся:** перезапустите контейнер WordPress (`docker compose restart wordpress`) или деактивируйте/активируйте плагин `next-revalidate` в админке.

---

### Счётчик просмотров

| | |
|---|---|
| **Код** | `frontend/entities/post/lib/get-post-view-count.ts` |
| **Статус** | Опционально. В WordPress **нет** встроенного счётчика просмотров |

Блок на странице записи появляется только если плагин отдаёт значение в `post.meta` по одному из ключей:

- `post_views_count`
- `views`
- `jetpack-post-views`
- `_post_views`
- `pvc_post_views`

**Чек-лист WordPress (если нужны просмотры):**

- [ ] Установить плагин счётчика (например, Post Views Counter, Jetpack Stats)
- [ ] Убедиться, что meta-поле доступно в REST API (`register_post_meta` с `show_in_rest: true` — часто требует доработки темы/плагина)
- [ ] Проверить ответ API: `{WORDPRESS_URL}/wp-json/wp/v2/posts?slug=...` — в объекте `meta` есть значение просмотров

Если плагин не установлен — блок просмотров **не отображается** (штатное поведение).

---

### Кэш и revalidation

| | |
|---|---|
| **Код** | `app/api/revalidate/route.ts`, `plugin/next-revalidate/` |
| **Кэш** | 1 час (`revalidate: 3600`), теги `wordpress`, `posts`, `comments` и др. |

**Чек-лист WordPress:**

- [ ] Плагин `next-revalidate` активен и настроен (см. общий чек-лист)
- [ ] `WORDPRESS_WEBHOOK_SECRET` совпадает в WordPress и Next.js

---

### Изображения

| | |
|---|---|
| **Код** | `next.config.ts` → `images.remotePatterns` |

**Чек-лист:**

- [ ] `WORDPRESS_HOSTNAME` в `.env.local` совпадает с доменом медиафайлов WordPress
- [ ] Медиа загружены через WordPress (не hotlink с заблокированных доменов)

---

### Архивы, поиск, страницы

| Маршрут | Статус |
|---------|--------|
| `/posts` | Список записей с фильтрами |
| `/posts/categories`, `/posts/tags`, `/posts/authors` | Архивы |
| `/pages`, `/pages/[slug]` | Статические страницы WordPress |

Специальных плагинов не требуют. Нужны опубликованные записи/страницы и REST API.

---

## Команды

```bash
pnpm dev              # Dev-сервер Next.js (turbo)
pnpm build            # Production-сборка
pnpm start            # Production-сервер
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm test:watch       # Vitest в watch-режиме
pnpm storybook        # Storybook (компоненты UI)
pnpm build-storybook  # Сборка Storybook
```

```bash
docker compose up -d       # Запуск WordPress + MySQL
docker compose down        # Остановка
docker compose logs -f wordpress
```

---

## Структура репозитория

```
├── app/                        # Next.js App Router
│   ├── page.tsx                # Главная (сетка избранных записей)
│   ├── posts/[slug]/           # Страница записи
│   ├── posts/                  # Архив записей
│   ├── pages/                  # WordPress-страницы
│   └── api/
│       ├── comments/           # Прокси комментариев в WordPress
│       ├── revalidate/         # Webhook от WordPress
│       └── og/                 # OG-изображения
├── frontend/
│   ├── entities/post/          # Карточка, мета, просмотры
│   ├── entities/comment/       # Комментарии
│   ├── widgets/                # Header, Footer, FeaturedPosts, PostDetail
│   └── shared/                 # UI-kit, menu, утилиты
├── lib/
│   ├── wordpress.ts            # WordPress REST API
│   └── wordpress.d.ts          # Типы
├── plugin/next-revalidate/     # Плагин revalidation для WordPress
├── wordpress/                  # Docker-образ и headless-тема
├── site.config.ts              # Название и описание сайта
└── docker-compose.yml
```

---

## Конфигурация сайта

**Метаданные** — `site.config.ts`:

```typescript
export const siteConfig = {
  site_name: "Elsolcansado Blog",
  site_description: "Сайт одного разработчика",
  site_domain: "https://your-domain.com",
};
```

**Навигация** — `frontend/shared/config/menu.ts`

---

## Устранение неполадок

### REST API недоступен

- Проверить `WORDPRESS_URL` в `.env.local`
- **Настройки → Постоянные ссылки** — не «Простые»
- Открыть `{WORDPRESS_URL}/wp-json/wp/v2/posts`

### Записи не появляются на фронте

- Записи в статусе «Опубликовано»
- Проверить логи Next.js — при недоступном WordPress используется graceful fallback (пустые данные)
- Проверить revalidation (плагин и секрет)

### Изображения не грузятся

- Проверить `WORDPRESS_HOSTNAME`
- Домен медиа должен совпадать с `remotePatterns` в `next.config.ts`

### Комментарии не отправляются

- Проверить настройки обсуждения (см. раздел «Комментарии»)
- У записи не закрыты комментарии
- **Частая причина:** REST API WordPress блокирует гостевые комментарии по умолчанию. Убедитесь, что активен плагин `next-revalidate` (в нём включён `rest_allow_anonymous_comments`)
- Ответ API: `POST /api/comments` — код `rest_comment_login_required` означает, что фильтр не подключён
- Некоторые хостинги блокируют анонимные POST в REST API — проверить на стенде

### Revalidation не срабатывает

- `WORDPRESS_WEBHOOK_SECRET` совпадает в WordPress и Next.js
- `NEXTJS_URL` доступен **из контейнера WordPress** (локально: `host.docker.internal:3000`)
- Плагин активен: **Настройки → Next.js Revalidation**

---

## Тестирование

```bash
pnpm test
```

Покрытие: `lib/utils`, `lib/metadata`, `lib/wordpress`, `api/revalidate`.

UI-компоненты — в Storybook: `pnpm storybook`.

---

## Лицензия

MIT — см. [LICENSE](LICENSE).
