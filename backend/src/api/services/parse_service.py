import requests
from bs4 import BeautifulSoup
import lxml.html as html
from typing import List, Dict, Any


class ParseService:
    """
    Сервис для парсинга данных с различных сайтов.
    """
    
    @staticmethod
    def parse_fzo_regional_support_measures() -> List[Dict[str, Any]]:
        """
        Парсит информацию о региональных мерах поддержки с сайта ФЗО.
        
        Returns:
            List[Dict[str, Any]]: Список региональных мер поддержки
        """
        url = "https://fzo.gov.ru/praktika-regionov/regionalnye-mery-podderzhki.html"

        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при запросе: {e}")
            return []
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        main_container = soup.select_one('body > main > div:nth-child(3) > div > div > div:nth-child(1) > section > div')
        
        if not main_container:
            print("Основной контейнер не найден")
            return []
        
        result = []
        
        region_headers = main_container.find_all('h2')
        
        for region_header in region_headers:
            try:
                region_name = region_header.text.strip()
                
                measures = []
                current_element = region_header.next_sibling
                
                while current_element and (not isinstance(current_element, type(region_header)) or current_element.name != 'h2'):
                    if current_element.name == 'ul':
                        list_items = current_element.find_all('li')
                        for item in list_items:
                            if item.text.strip():
                                measure = {
                                    "description": item.text.strip(),
                                    "epgu_link": None
                                }
                                measures.append(measure)
                    
                    elif current_element.name == 'p' and 'Ссылка на услугу ЕПГУ' in current_element.text:
                        link_element = current_element.find('a')
                        if link_element and measures:
                            measures[-1]["epgu_link"] = link_element.get('href')
                    
                    current_element = current_element.next_sibling
                
                if measures:
                    result.append({
                        "region": region_name,
                        "support_measures": measures
                    })
            except Exception as e:
                print(f"Ошибка при обработке региона {region_header.text if region_header else 'неизвестно'}: {e}")
                continue
        
        return result


def get_all_regional_support_measures() -> List[Dict[str, Any]]:
    """
    Получает все региональные меры поддержки с сайта ФЗО.
    
    Returns:
        List[Dict[str, Any]]: Список региональных мер поддержки
    """
    return ParseService.parse_fzo_regional_support_measures()


if __name__ == "__main__":
    data = get_all_regional_support_measures()
    
    print(f"Найдено регионов: {len(data)}")
    

