from aiogram import Bot
from aiogram import Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from bot.settings import API_KEY

bot = Bot(token=API_KEY)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)
