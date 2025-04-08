from sqlalchemy.orm import Session
from api.models import Admin
from api.database import SessionLocal
from api.settings import get_settings

settings = get_settings()

def create_first_admin(tg_id: int = None):
    if tg_id is None:
        tg_id = settings.MAIN_ADMIN_TG_ID
        
    db = SessionLocal()
    try:
        existing_admin = Admin.get_by_tg_id(db, tg_id)
        if existing_admin:
            print(f"Администратор с tg_id {tg_id} уже существует в базе данных.")
            return existing_admin
        
        admin = Admin.create(db, tg_id=tg_id)
        print(f"Администратор успешно создан с id: {admin.id} и tg_id: {admin.tg_id}")
        return admin
    except Exception as e:
        print(f"Ошибка при создании администратора: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def seed_admin():
    create_first_admin()

if __name__ == "__main__":
    seed_admin() 