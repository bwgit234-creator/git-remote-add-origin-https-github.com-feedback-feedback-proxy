# Исправление Google Apps Script

## Проблема
Ваш скрипт развернут, но возвращает ошибку "Страница не найдена". Это означает что в коде есть ошибка.

## Решение: Скопируйте этот код заново

### Шаг 1: Откройте Apps Script
1. https://docs.google.com/spreadsheets/d/1xLdjIhse1Gl4dET7SCUgQhrpp06WhWFLEJdEGrPUekg/edit
2. Extensions → Apps Script

### Шаг 2: Удалите весь код и вставьте этот:

```javascript
function doPost(e) {
  try {
    // Парсим данные
    const data = JSON.parse(e.postData.contents);
    const cashdesk = data.cashdesk;
    const rating = data.rating;
    const comment = data.comment || '';

    // ID вашей таблицы
    const SPREADSHEET_ID = '1xLdjIhse1Gl4dET7SCUgQhrpp06WhWFLEJdEGrPUekg';

    // Открываем таблицу
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Отзывы');

    // Если лист не существует, создаем его
    if (!sheet) {
      sheet = ss.insertSheet('Отзывы');
      sheet.appendRow(['timestamp', 'cashdesk', 'rating', 'comment']);
      sheet.getRange('1:1').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Форматируем время (Москва GMT+3)
    const now = new Date();
    const moscowTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const timestamp = Utilities.formatDate(moscowTime, 'GMT+3', 'dd.MM.yyyy HH:mm:ss');

    // Добавляем строку
    sheet.appendRow([timestamp, cashdesk, rating, comment]);

    // Возвращаем успех
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

// Тестовая функция
function testDoPost() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        cashdesk: '1',
        rating: 5,
        comment: 'Тест'
      })
    }
  };

  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
```

### Шаг 3: Сохраните (Ctrl+S / Cmd+S)

### Шаг 4: Протестируйте функцию (необязательно)
1. Выберите функцию `testDoPost` в выпадающем списке
2. Нажмите Run (▶)
3. Разрешите доступ если попросит
4. Проверьте логи: View → Logs
5. Должно быть: `{"status":"success"}`

### Шаг 5: ВАЖНО! Создайте НОВОЕ развертывание

**НЕ ОБНОВЛЯЙТЕ** старое развертывание! Создайте новое:

1. Deploy → **New deployment** (не Manage deployments!)
2. Шестерёнка → Web app
3. **New description:** введите `v2` или любое новое название
4. Execute as: **Me**
5. Who has access: **Anyone** ⚠️
6. Deploy
7. Authorize access (если попросит)
8. **СКОПИРУЙТЕ НОВЫЙ URL**

### Шаг 6: Обновите .env

Создайте файл `.env` (если нет):
```
GAS_URL=https://script.google.com/macros/s/НОВЫЙ_URL_ИЗ_ШАГА_5/exec
PORT=3000
HOST=127.0.0.1
SPREADSHEET_ID=1xLdjIhse1Gl4dET7SCUgQhrpp06WhWFLEJdEGrPUekg
```

### Шаг 7: Запустите сервер
```bash
npm start
```

### Шаг 8: Тестируйте
Откройте http://localhost:3000

---

## Что изменилось в коде?

✅ Упрощенное получение данных из `e.postData.contents`
✅ Явная проверка на пустой комментарий
✅ Более надежная обработка ошибок
✅ Добавлена тестовая функция
✅ Убраны лишние методы которые могут вызвать ошибки

---

## Если всё равно не работает

Попробуйте полностью **удалить все развертывания** и создать один новый с нуля.

Deploy → Manage deployments → Archive (на каждом) → потом Deploy → New deployment
