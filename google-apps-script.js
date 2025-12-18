// Google Apps Script для интеграции с Google Sheets
// Скопируйте этот код в Apps Script вашей таблицы

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

// Функция для тестирования (необязательно)
function testDoPost() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        cashdesk: '1',
        rating: 5,
        comment: 'Тестовый отзыв'
      })
    }
  };

  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
