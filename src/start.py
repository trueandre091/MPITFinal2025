from bot.main import start_bot
from api.main import start_api
import asyncio
import multiprocessing


def run_api():
    asyncio.run(start_api())


def run_bot():
    asyncio.run(start_bot())


if __name__ == "__main__":
    api_process = multiprocessing.Process(target=run_api)
    bot_process = multiprocessing.Process(target=run_bot)

    api_process.start()
    bot_process.start()

    api_process.join()
    bot_process.join()
