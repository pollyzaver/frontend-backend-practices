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

**Скриншоты:**
- ![GET все товары](docs/get.png)
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

## Практика 5: Swagger (документация API)

К API добавлена интерактивная документация Swagger.

### Что реализовано:
- Полное описание всех эндпоинтов (`/api/products`)
- Схема данных `Product` с полями: id, title, price, category, description, stock
- Документация доступна в браузере по адресу `/api-docs`
- Возможность тестировать запросы прямо из интерфейса Swagger ("Try it out")

### Эндпоинты в документации:
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/products` | Получить все товары |
| GET | `/api/products/{id}` | Получить товар по ID |
| POST | `/api/products` | Создать товар |
| PATCH | `/api/products/{id}` | Обновить товар |
| DELETE | `/api/products/{id}` | Удалить товар |

