from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

import sys
import os
# Добавляем корректные пути для импортов
current_dir = os.path.dirname(os.path.abspath(__file__))
api_dir = os.path.dirname(current_dir)
src_dir = os.path.dirname(api_dir)
sys.path.insert(0, src_dir)

# Импортируем модели и настройки из нашего проекта
from api.database import Base, SQLALCHEMY_DATABASE_URL
from api.models.user import User
from api.models.leader import Leader
from api.models.request import Request
from api.models.config import Config
from api.models.admin import Admin
from api.models.esia_token import EsiaToken
from api.models.region import Region
from api.models.support_measure import SupportMeasure
# Импортируйте здесь другие модели, если они есть

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Устанавливаем строку подключения из нашего приложения
config.set_main_option("sqlalchemy.url", SQLALCHEMY_DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            # Добавляем сравнение типов для корректной работы автогенерации
            compare_type=True,
            # Добавляем сравнение значений по умолчанию
            compare_server_default=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
