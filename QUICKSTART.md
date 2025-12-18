# Быстрый старт (краткая версия)

## Для того, кто получил ZIP файл

### 1. Установите Node.js (если нет)
Скачайте с https://nodejs.org/ (LTS версия) → запустите установщик → перезапустите VSCode

### 2. Распакуйте проект
Распакуйте `feedback-proxy.zip` в любую папку

### 3. Откройте в VSCode
`File` → `Open Folder...` → выберите папку `feedback-proxy`

### 4. Установите зависимости
Откройте Terminal в VSCode и выполните:
```bash
npm install
```

### 5. Настройте Google Apps Script

1. Откройте/создайте Google Sheets
2. `Extensions` → `Apps Script`
3. Скопируйте код из файла `google-apps-script.js` в проект
4. Измените `SPREADSHEET_ID` на ID вашей таблицы (строка 8)
5. `Deploy` → `New deployment` → `Web app`
6. **Важно:** "Who has access" = **Anyone**
7. Скопируйте Web app URL

### 6. Создайте .env файл
Создайте файл `.env` в корне проекта:
```
GAS_URL=https://script.google.com/macros/s/ВАШ_URL_ИЗ_ШАГА_5/exec
PORT=3000
HOST=127.0.0.1
```

### 7. Запустите сервер
```bash
npm start
```

### 8. Откройте в браузере
http://localhost:3000

---

## Проверка работы

✅ В терминале: "Proxy server running at http://127.0.0.1:3000"
✅ В браузере: отображается форма с эмодзи
✅ После отправки: "Спасибо за ваш отзыв!"
✅ В Google Sheets: появляется новая строка с данными

---

## Если не работает

**Проблема:** `node: command not found`
→ Установите Node.js, перезапустите VSCode

**Проблема:** "Port 3000 is already in use"
→ Измените PORT=3001 в `.env` и в `feed.html` (строка 73)

**Проблема:** "Не удалось отправить отзыв"
→ Проверьте: сервер запущен? GAS_URL правильный? "Who has access" = "Anyone"?

---

**Полная инструкция:** см. файл `INSTALLATION.md`
