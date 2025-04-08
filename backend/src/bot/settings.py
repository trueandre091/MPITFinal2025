import yaml
import os

def load_settings():
    settings_path = os.path.join(os.path.dirname(__file__), 'settings.yaml')
    try:
        with open(settings_path, 'r', encoding='utf-8') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(f"Error loading settings from {settings_path}: {e}")
        raise 
