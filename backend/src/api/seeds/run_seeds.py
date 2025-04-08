from api.settings import get_settings
from api.seeds.admin_seed import create_first_admin
from api.seeds.support_measures_seed import run as run_support_measures_seed

settings = get_settings()

def run_all_seeds():
    print("Запуск сидов...")
    
    if settings.SHOULD_SEED_ADMIN:
        create_first_admin()
    
    run_support_measures_seed()
    
    print("Загрузка сидов завершена.")

if __name__ == "__main__":
    run_all_seeds() 