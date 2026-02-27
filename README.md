# Практические работы по фронтенд и бэкенд разработке

## Практика 1: CSS-препроцессоры (SASS)
Карточка товара для виниловой пластинки The Beatles с использованием:
- Переменные ($color-primary, $color-accent, $font-heading)
- Миксин (@mixin button)
- Вложенность селекторов
- Дополнительный элемент (бейдж "Limited Edition")

## Практика 2: Node.js + Express API
CRUD API для товаров с дополнительным полем "category":
- GET /api/products — список товаров
- GET /api/products/:id — один товар
- POST /api/products — создание товара
- PATCH /api/products/:id — обновление товара
- DELETE /api/products/:id — удаление товара
<<<<<<< HEAD

**Скриншоты:**
- ![GET все товары](docs/get.png)
- ![GET товар по ID](docs/get_users_ext.png)
- ![POST создание](docs/post.png)
- ![PATCH обновление](docs/patch.png)
- ![DELETE удаление](docs/delete.png)

## Практика 3: JSON и внешние API

### Тестирование своего API (из Практики 2)
Скриншоты запросов к своему API находятся выше (Практика 2).

### Работа с внешним API (JSONPlaceholder)
Выполнено 5 запросов:
- GET /posts — ![все посты](docs/get_posts_external.png)
- GET /posts/1 — ![пост с id=1](docs/get_post1_external.png)
- GET /users — ![все пользователи](docs/get_users_external.png)
- POST /posts — ![создание поста](docs/post_external.png)
- DELETE /posts/1 — ![удаление поста](docs/delete_post1_external.png)

## Практика 4: API + React (Интернет-магазин)
- **Бэкенд:** `/backend` — Express API с товарами (минимум 10 товаров с полями: название, категория, описание, цена, наличие на складе)
- **Фронтенд:** `/frontend` — React приложение, подключенное к API
- Реализован полный CRUD через интерфейс

### Запуск проекта
**Бэкенд:**
```bash
cd backend
npm install
npm run dev
=======
- Дополнительное поле: category
>>>>>>> origin/main
