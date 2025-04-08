from aiogram import Bot
from aiogram import Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from bot.settings import load_settings

settings = load_settings()
bot = Bot(token=settings["bot"]["api"])
storage = MemoryStorage()
dp = Dispatcher(storage=storage)
