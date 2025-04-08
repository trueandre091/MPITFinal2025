import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / '.env.bot'
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("API_KEY")
