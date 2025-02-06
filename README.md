# Тестовое задание от Генезис - amoCRM интеграция


![](https://i.imgur.com/jJ4AJVH.png)


## Задание

### Верстка

Сверстать на Vue3 следующие компоненты:
1. Выпадающий список (dropdown)
2. Кнопка
3. Область отображения результата списка созданных ID сущностей. 

Преимуществом будет:
- реализация на Pinia
- использование Composition API + TypeScript
- реализация переиспользуемых компонентов

Обязательное требование - сохранить следующую стилистику: 

кнопка “Создать”:

а) неактивная:

![](https://i.imgur.com/8Wg1b2O.png)

б) активная (в названии кнопки должно быть слово “Создать”. слово “Сохранить” здесь только для примера стиля):

![](https://i.imgur.com/NGRyLoY.png)


Прелоадер на кнопку в виде крутящегося круга:

![](https://i.imgur.com/GtIzLD6.png)

Пример видео анимации прелоадера [здесь](https://monosnap.com/file/Ikchjl7btT64AaWsv9jg3YQD9Ykt55).

Выпадающий список (пример):

![](https://i.imgur.com/xHJSkuT.png)

![](https://i.imgur.com/bp9QmCJ.png)


Функционал фронтенда
В выпадающем списке пользователь выбирает одну из трех сущностей, которую нужно создать в amoCRM: Сделка, Контакт, Компания.

По нажатию на кнопку “Создать” с фронтенда на бэкенд уходит POST-запрос (contenttype=application/json), с бэкенда выполняется запрос к API amoCRM, создается выбранная сущность, в теле ответа API присылает ID созданной сущности и http код ответа 200, либо текст ошибки и соответствующий http-код ответа.

В случае успешного создания сущности отображаем название сущности и её идентификатор в области отображения результатов. Результаты накапливаем, должны отображаться все ID и имена сущностей, созданных с момента открытия окна браузера.

В выпадающем списке отображаем четыре элемента:
- Не выбрано
- Сделка
- Контакт
- Компания

По-умолчанию в списке выбран первый элемент “Не выбрано”. При выбранном элементе “Не выбрано” кнопку “Создать” делаем неактивной (на белом фоне). При иных выбранных элементах кнопку делаем активной (на синем фоне).

Мокапов и макетов по визуальному расположению элементов не даём, здесь можно и нужно применить полёт фантазии)

**Будет плюсом**: стек реализации задачи: Vue3 (Composition API + TypeScript), Pinia, Vite, axios


### Работа с API amoCRM. Бэкенд часть приложения

Реализовать следующий функционал:
1. Получить действующий Access Token для API amoCRM
2. Создать запрашиваемую сущность "Сделка", "Контакт" или "Компания" (выбранную на фронте сущность в выпадающем списке) с помощью POST-запроса
3. Отправить в ответе полученный ID сущности


#### Формат запросов к бэкенду:

Метод: POST
Content-Type: application/json

Для работы с API amoCRM нужна авторизация OAuth2. 
Получить действующий Access Token нужно так:
`https://example.com/amocrm/oauth/get-token.php`
`Method: GET`
`Content-Type: application/json`

В запросе передать заголовок `X-Client-Id`. Значение заголовка получить.
Тело ответа в формате JSON содержит два поля, необходимые для авторизации в amoCRM:

- `access_token`
- `base_domain`

Ссылки на документацию по работе с сущностями amoCRM:
- [Сделка](https://www.amocrm.ru/developers/content/crm_platform/leads-api)
- [Контакт](https://www.amocrm.ru/developers/content/crm_platform/contacts-api)
- [Компания](https://www.amocrm.ru/developers/content/crm_platform/companies-api)

**Будет плюсом** реализация работы с API amoCRM на NestJS (бэкенд часть приложения)



## Running


### Frontend


Set up environment variables
```bash
(cd Gnzs-Task-Frontend && cp .env.example .env)
```

Install
```bash
(cd Gnzs-Task-Frontend && npm run install)
```

Run
```bash
(cd Gnzs-Task-Frontend && npm run dev)
```


### Backend

Set up environment variables
```bash
(cd Gnzs-Task-Backend && cp .env.example .env)
```


Install
```bash
(cd Gnzs-Task-Backend && npm run install)
```


Run
```bash
(cd Gnzs-Task-Backend && npm run start:dev)
```