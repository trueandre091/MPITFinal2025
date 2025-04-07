import asyncio
from aiogram import Router, types, filters
from aiogram.fsm.context import FSMContext

from bot.tg.fsm.states import UserState
from bot.tg.bot import dp, bot
from bot.tg.view.buttons import (
    back_buttons,
    admin_choose_chat_buttons,
    admin_choose_leader_buttons,
    admin_buttons,
    themes_buttons,
)
from bot.tg.view.content import CONTENT
from bot.tg.utils.fn import check_user_is_admin
from bot.tg.utils.logger import get_logger

from api.models.user import User
from api.models.config import Config
from api.models.request import Request
from api.models.leader import Leader
from api.database import get_db

logger = get_logger(__name__)

router = Router()
ADMIN_FUNCTIONS = ["admin_choose_chat", "admin_choose_leader", "admin_exclude_leader"]


@dp.callback_query(lambda c: c.data == "admin")
async def admin_handler(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        CONTENT["main"]["message_admin"],
        reply_markup=admin_buttons(),
        parse_mode="HTML",
    )
    db = next(get_db())
    if not Config.get_by_key(db, "LEADERS_CHAT_ID"):
        await callback.message.answer(
            CONTENT["main"]["errors"][1],
            parse_mode="HTML",
        )


@dp.callback_query(lambda c: c.data in ADMIN_FUNCTIONS)
async def admin_choose_handler(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    if not check_user_is_admin(callback):
        await callback.message.edit_text(
            CONTENT["main_page"]["errors"][0],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        return
    if callback.data == ADMIN_FUNCTIONS[0]:
        await callback.message.answer(
            CONTENT[callback.data]["messages"][0],
            reply_markup=admin_choose_chat_buttons(),
            parse_mode="HTML",
        )
        await state.set_state(UserState.admin_choose_chat)
    elif callback.data == ADMIN_FUNCTIONS[1]:
        await callback.message.answer(
            CONTENT[callback.data]["messages"][0],
            reply_markup=admin_choose_leader_buttons(),
            parse_mode="HTML",
        )
        await state.set_state(UserState.admin_choose_leader)
    elif callback.data == ADMIN_FUNCTIONS[2]:
        await callback.message.answer(
            CONTENT[callback.data]["messages"][0],
            reply_markup=admin_choose_leader_buttons(),
            parse_mode="HTML",
        )
        await state.set_state(UserState.admin_exclude_leader)


@dp.message(UserState.admin_choose_chat)
async def admin_choose_chat_handler(message: types.Message, state: FSMContext):
    chat = message.chat_shared
    if chat:
        try:
            await bot.get_chat(chat.chat_id)
        except Exception:
            answer = await message.answer(
                CONTENT[ADMIN_FUNCTIONS[0]]["errors"][1],
                parse_mode="HTML",
            )
            await message.chat.delete_message(answer.message_id - 1)
            await message.chat.delete_message(answer.message_id - 2)
            await asyncio.sleep(2)
            await answer.delete()
            return

        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[0]]["messages"][1],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )

        db = next(get_db())
        if not Config.get_by_key(db, "LEADERS_CHAT_ID"):
            Config.create(db, "LEADERS_CHAT_ID", chat.chat_id)
        else:
            Config.update(db, "LEADERS_CHAT_ID", chat.chat_id)

        await asyncio.sleep(1)
        await answer.delete()

        await message.chat.delete_message(answer.message_id - 2)

        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[0]]["messages"][2],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()

        await state.set_state(UserState.main)
    else:
        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[0]]["errors"][0],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()
        return


@dp.message(UserState.admin_choose_leader)
async def admin_choose_leader_handler(message: types.Message, state: FSMContext):
    user = message.user_shared
    if user:
        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[1]]["messages"][1],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )

        db = next(get_db())
        Leader.create(db, user.user_id)

        await asyncio.sleep(1)
        await answer.delete()

        await message.chat.delete_message(answer.message_id - 2)

        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[1]]["messages"][2],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()

        await state.set_state(UserState.main)
    else:
        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[1]]["errors"][0],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()
        return


@dp.message(UserState.admin_exclude_leader)
async def admin_exclude_leader_handler(message: types.Message, state: FSMContext):
    user = message.user_shared
    if user:
        db = next(get_db())
        leader = Leader.get_by_tg_id(db, user.user_id)
        if not leader:
            answer = await message.answer(
                CONTENT[ADMIN_FUNCTIONS[2]]["errors"][2],
                parse_mode="HTML",
            )

            await message.chat.delete_message(answer.message_id - 1)
            await message.chat.delete_message(answer.message_id - 2)

            await asyncio.sleep(2)
            await answer.delete()
            await state.set_state(UserState.main)
            return

        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[2]]["messages"][1],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )
        Leader.delete(db, leader.id)

        await asyncio.sleep(1)
        await answer.delete()

        await message.chat.delete_message(answer.message_id - 2)

        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[2]]["messages"][2],
            reply_markup=types.ReplyKeyboardRemove(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()

        await state.set_state(UserState.main)
    else:
        answer = await message.answer(
            CONTENT[ADMIN_FUNCTIONS[2]]["errors"][0],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()
        return


dp.include_router(router)
