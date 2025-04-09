import os
import subprocess
import sys
from pathlib import Path

current_dir = Path(__file__).parent.absolute()
src_dir = current_dir.parent
sys.path.insert(0, str(src_dir))

from api.settings import get_settings
from api.database import create_db


def run_migrations():
    settings = get_settings()
    if not settings.DB_CREATED:
        create_db()
        settings.DB_CREATED = True
    
    api_dir = current_dir
    migrations_dir = api_dir / "migrations"
    
    if not migrations_dir.exists():
        print(f"Ошибка: Директория миграций не найдена по пути: {migrations_dir}")
        print("Текущая директория:", os.getcwd())
        print("Содержимое api директории:", os.listdir(api_dir))
        sys.exit(1)
    
    try:
        print(f"Запуск миграций из директории {api_dir}...")
        print(f"Используя конфигурацию: {api_dir}/alembic.ini")
        
        os.chdir(api_dir)
        
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("Миграции успешно применены.")
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при выполнении миграций: {e}")
        sys.exit(1)


if __name__ == "__main__":
    run_migrations() 