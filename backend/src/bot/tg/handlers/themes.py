from aiogram import Router, types, filters, F
from aiogram.fsm.context import FSMContext

from bot.tg.fsm.states import UserState
from bot.tg.bot import dp, bot
from bot.tg.view.buttons import request_buttons, back_buttons, request_card_buttons
from bot.tg.view.content import CONTENT
from bot.tg.utils.themes_enum import Theme
from bot.tg.utils.fn import get_request_card
from bot.tg.utils.logger import get_logger

from api.models.config import Config
from api.models.request import Request
from api.models.user import User
from api.database import get_db
from api.settings import get_settings

logger = get_logger(__name__)

router = Router()


@dp.callback_query(lambda c: c.data in [theme.name for theme in Theme])
async def themes_handler(callback: types.CallbackQuery, state: FSMContext):
    db = next(get_db())
    data = await state.get_data()

    if not Config.get_by_key(db, "LEADERS_CHAT_ID"):
        await callback.message.answer(
            CONTENT["main"]["errors"][2],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        await callback.message.delete()
        await state.set_state(UserState.main)
        return

    if "id" not in data:
        user = User.get_by_tg_id(db, callback.from_user.id)
        if user:
            await state.update_data(id=user.id)
        else:
            await callback.message.answer(
                CONTENT["main"]["errors"][3],
                reply_markup=back_buttons(),
                parse_mode="HTML",
            )
            await callback.message.delete()
            await state.set_state(UserState.main)
            return

    await state.update_data(theme=callback.data)
    data = await state.get_data()
    await callback.message.edit_text(
        CONTENT[data["theme"]]["message"],
        reply_markup=request_buttons(),
        parse_mode="HTML",
    )
    await state.set_state(UserState.themes)


@dp.callback_query(lambda c: c.data == "request", filters.StateFilter(UserState.themes))
async def request_handler(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    await callback.message.edit_text(
        CONTENT["request"]["messages"][0],
        reply_markup=back_buttons(),
        parse_mode="HTML",
    )
    await state.set_state(UserState.request)


@dp.message(UserState.request)
async def request_message_handler(message: types.Message, state: FSMContext):
    db = next(get_db())
    data = await state.get_data()
    request = Request.create(
        db,
        user_id=data["id"],
        theme=Theme[data["theme"]].value,
        message=message.text,
    )
    chat_id = Config.get_by_key(db, "LEADERS_CHAT_ID").value
    try:
        await bot.send_sticker(
            chat_id,
            CONTENT["stickers"]["fly"],
        )
        await bot.send_message(
            chat_id,
            get_request_card(request),
            reply_markup=request_card_buttons(request.id),
            parse_mode="HTML",
        )
    except Exception as e:
        logger.error(e)
        await message.answer(
            CONTENT["request"]["errors"][0],
            reply_markup=back_buttons(),
            parse_mode="HTML",
        )
        await state.clear()
        await state.set_state(UserState.main)
        return

    await message.answer_sticker(CONTENT["stickers"]["mirror"])
    await message.answer(
        CONTENT["request"]["messages"][1],
        reply_markup=back_buttons(),
        parse_mode="HTML",
    )
    await state.clear()
    await state.set_state(UserState.main)


dp.include_router(router)
