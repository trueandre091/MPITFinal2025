from sqlalchemy.exc import IntegrityError
from typing import List, Dict, Any

from api.database import SessionLocal
from api.models.region import Region
from api.models.support_measure import SupportMeasure
from api.services.parse_service import get_all_regional_support_measures


def seed_support_measures() -> Dict[str, int]:
    db = SessionLocal()
    
    stats = {
        "regions_added": 0,
        "measures_added": 0,
        "regions_skipped": 0,
        "measures_skipped": 0
    }
    
    try:
        print("Начало парсинга данных о региональных мерах поддержки...")
        parsed_data = get_all_regional_support_measures()
        print(f"Парсинг завершен. Получено {len(parsed_data)} регионов.")
        
        for region_data in parsed_data:
            region_name = region_data["region"]
            
            existing_region = Region.get_by_name(db, region_name)
            
            if not existing_region:
                region = Region.create(db, name=region_name)
                stats["regions_added"] += 1
            else:
                region = existing_region
                stats["regions_skipped"] += 1
            
            for measure_data in region_data["support_measures"]:
                description = measure_data["description"]
                epgu_link = measure_data.get("epgu_link")
                
                existing_measures = SupportMeasure.get_region_id(db, region.id)
                measure_exists = any(m.description == description for m in existing_measures)
                
                if not measure_exists:
                    SupportMeasure.create(
                        db=db,
                        description=description,
                        link=epgu_link,
                        region_id=region.id
                    )
                    stats["measures_added"] += 1
                else:
                    stats["measures_skipped"] += 1
        
        print(f"Добавлено в БД: {stats['regions_added']} новых регионов, {stats['measures_added']} мер поддержки")
        print(f"Пропущено: {stats['regions_skipped']} существующих регионов, {stats['measures_skipped']} существующих мер поддержки")
    
    except Exception as e:
        print(f"Ошибка при заполнении базы данных: {e}")
    
    finally:
        db.close()
        return stats


def run():
    print("Запуск заполнения таблицы мер поддержки...")
    seed_support_measures()
    print("Заполнение таблицы мер поддержки завершено.")


if __name__ == "__main__":
    run() 