#!/bin/bash
set -e

# Функция для проверки доступности PostgreSQL
wait_for_postgres() {
    until PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1" > /dev/null 2>&1; do
        sleep 2
    done
}

# Дополнительная проверка PostgreSQL
wait_for_postgres

# Запуск миграций
echo "Запуск миграций..."
cd /app
python /app/src/api/run_migrations.py
if [ $? -ne 0 ]; then
    echo "Ошибка при выполнении миграций. Завершение работы."
    exit 1
fi

# Если миграции успешно выполнены, запускаем приложение
echo "Запуск приложения..."
exec python /app/src/start.py 