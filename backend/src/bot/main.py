import asyncio
import logging

from bot.tg.bot import dp, bot
from bot.tg import handlers

logging.basicConfig(level=logging.INFO)


async def start_bot():
    logging.info("Бот запущен")
    await dp.start_polling(bot)
