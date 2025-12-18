# Feedback Proxy - Система сбора отзывов о кассах

Прокси-сервер для сбора отзывов от клиентов и сохранения их в Google Sheets.

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка Google Apps Script

#### Создание скрипта:
1. Откройте Google Sheets: https://docs.google.com/spreadsheets/d/1xLdjIhse1Gl4dET7SCUgQhrpp06WhWFLEJdEGrPUekg/edit
2. Перейдите в **Extensions → Apps Script**
3. Удалите весь существующий код
4. Скопируйте код из файла `google-apps-script.js` или вставьте следующий код:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { cashdesk, rating, comment } = data;

    // ID вашей таблицы
    const SPREADSHEET_ID = '1xLdjIhse1Gl4dET7SCUgQhrpp06WhWFLEJdEGrPUekg';

    // Открываем таблицу
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Отзывы');

    // Если лист не существует, создаем его с заголовками
    if (!sheet) {
      sheet = ss.insertSheet('Отзывы');
      sheet.appendRow(['timestamp', 'cashdesk', 'rating', 'comment']);
      sheet.getRange('1:1').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Форматируем время в DD.MM.YYYY HH:mm:ss (Москва GMT+3)
    const now = new Date();
    const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const timestamp = Utilities.formatDate(moscowTime, 'GMT+3', 'dd.MM.yyyy HH:mm:ss');

    // Добавляем строку
    sheet.appendRow([timestamp, cashdesk, rating, comment || '']);

    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### Деплой Web App:
1. Сохраните скрипт (Ctrl+S / Cmd+S)
2. Нажмите **Deploy → New deployment**
3. Нажмите на шестерёнку рядом с "Select type" → выберите **Web app**
4. Настройки:
   - Description: `Feedback API` (опционально)
   - Execute as: **Me (ваш email)**
   - Who has access: **Anyone**
5. Нажмите **Deploy**
6. Разрешите доступ (Authorize access → выберите аккаунт → Advanced → Go to ... → Allow)
7. Скопируйте **Web app URL** (он будет вида `https://script.google.com/macros/s/.../exec`)

### 3. Настройка переменных окружения (опционально)

Создайте файл `.env`:
```bash
cp .env.example .env
```

Отредактируйте `.env` и вставьте URL из шага 2:
```
GAS_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

Или передайте URL через переменную окружения при запуске:
```bash
GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec npm start
```

### 4. Запуск сервера
```bash
npm start
```

Сервер запустится на http://127.0.0.1:5000

### 5. Использование

Откройте в браузере: **http://localhost:5000**

## Структура данных в Google Sheets

Таблица содержит следующие колонки:

| timestamp | cashdesk | rating | comment |
|-----------|----------|--------|---------|
| DD.MM.YYYY HH:mm:ss | Номер кассы | 1-5 | Текст комментария |

**Пример:**
```
18.12.2025 15:30:45 | 1 | 5 |
18.12.2025 15:31:12 | 2 | 2 | Долгое обслуживание
```

## Архитектура

1. **feed.html** - Форма для оценки обслуживания
2. **server.js** - Node.js прокси-сервер
3. **Google Apps Script** - Обработчик записи в Google Sheets

### Процесс работы:
1. Пользователь заполняет форму на странице
2. Данные отправляются на `/feedback` endpoint
3. Node.js проксирует запрос в Google Apps Script
4. Apps Script записывает данные в Google Sheets
5. Пользователь получает подтверждение

## API

### GET /
Отображает форму обратной связи

### POST /feedback
Отправка отзыва

**Request body:**
```json
{
  "cashdesk": "1",
  "rating": 5,
  "comment": "Отличное обслуживание"
}
```

**Response:**
```json
{
  "status": "success"
}
```

### GET /health
Проверка работоспособности сервера

**Response:**
```json
{
  "status": "ok"
}
```

## Конфигурация

### Переменные окружения:

- `GAS_URL` - URL Google Apps Script Web App (обязательно для продакшена)
- `PORT` - Порт сервера (по умолчанию: 5000)
- `HOST` - Хост сервера (по умолчанию: 127.0.0.1)

## Лицензия

ISC
