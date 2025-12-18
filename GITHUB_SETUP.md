# Как загрузить проект на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Заполните данные:
   - Repository name: `feedback-proxy` (или любое другое название)
   - Description: `Feedback collection system with Google Sheets integration`
   - Visibility: **Public** или **Private** (на ваш выбор)
   - **НЕ СОЗДАВАЙТЕ** README, .gitignore или license (они уже есть в проекте)
3. Нажмите **Create repository**

## Шаг 2: Подключите удалённый репозиторий

После создания репозитория GitHub покажет вам команды. Используйте следующие:

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/feedback-proxy.git

# Или используйте SSH (если настроен SSH ключ):
# git remote add origin git@github.com:YOUR_USERNAME/feedback-proxy.git
```

## Шаг 3: Загрузите код на GitHub

```bash
git branch -M main
git push -u origin main
```

## Готово!

После выполнения этих команд ваш проект будет доступен на GitHub по адресу:
`https://github.com/YOUR_USERNAME/feedback-proxy`

## Альтернатива: Использование GitHub Desktop

Если у вас установлен GitHub Desktop:
1. File → Add Local Repository
2. Выберите папку `/Users/agaronyan1/Desktop/feedback-proxy`
3. Publish repository → выберите настройки → Publish

## Проверка статуса

Посмотреть текущее состояние:
```bash
git status
git remote -v
```
