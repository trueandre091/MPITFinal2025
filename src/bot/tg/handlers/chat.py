import asyncio
from aiogram import Router, types, filters, F
from aiogram.fsm.context import FSMContext

from bot.tg.fsm.states import UserState
from bot.tg.bot import dp, bot
from bot.tg.view.buttons import (
    request_buttons,
    back_buttons,
    request_card_buttons,
    confirm_buttons,
    respond_buttons,
    stop_chatting_buttons,
    rate_buttons,
)
from bot.tg.view.content import CONTENT
from bot.tg.utils.logger import get_logger
from bot.tg.utils.fn import handle_and_send_message

from api.models.request import Request
from api.models.leader import Leader
from api.models.user import User
from api.database import get_db

logger = get_logger(__name__)

router = Router()


@dp.callback_query(lambda c: c.data.split("_")[1] == "confirm")
async def confirm_handler(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()

    db = next(get_db())
    leader = Leader.get_by_tg_id(db, callback.from_user.id)
    if not leader:
        await callback.message.answer(CONTENT["confirm"]["errors"][2])
        return

    callback_data = callback.data.split("_")
    request = Request.get_by_id(db, int(callback_data[2]))
    if request.user.tg_id == callback.from_user.id and callback_data[0] == "respond":
        answer = await callback.message.answer(
            CONTENT["respond"]["errors"][2],
            parse_mode="HTML",
        )
        await asyncio.sleep(2)
        await answer.delete()
        return

    await callback.message.answer(
        CONTENT["confirm"]["message"],
        reply_markup=confirm_buttons(
            callback.from_user.id,
            callback.message.message_id,
            callback_data[0],
            int(callback_data[2]),
        ),
        parse_mode="HTML",
    )
    await state.set_state(UserState.confirm)


@dp.callback_query(filters.StateFilter(UserState.confirm))
async def confirm_answer_handler(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    callback_data = callback.data.split("_")

    if int(callback_data[1]) != callback.from_user.id:
        await callback.message.answer(
            CONTENT["confirm"]["errors"][1], reply_markup=back_buttons()
        )
        return

    if callback_data[0] == "yes":
        db = next(get_db())
        request = Request.get_by_id(db, int(callback_data[4]))
        leader = Leader.get_by_tg_id(db, callback.from_user.id)
        await callback.message.delete()

        if callback_data[3] == "respond":
            await callback.message.chat.delete_message(int(callback_data[2]))
            await callback.message.answer(
                CONTENT["respond"]["messages"][0].format(
                    name=request.user.name, leader_name=leader.name
                ),
                parse_mode="HTML",
                reply_markup=respond_buttons((await bot.get_me()).username, request.id),
            )
            Request.update(db, request.id, leader_id=leader.id)

        elif callback_data[3] == "reject":
            await callback.message.chat.delete_message(int(callback_data[2]))
            await callback.message.answer(
                CONTENT["reject"]["messages"][0].format(
                    name=request.user.name, leader_name=leader.name
                ),
                parse_mode="HTML",
            )
            Request.update(db, request.id, is_closed=True)
    else:
        await callback.message.delete()


@dp.message(filters.StateFilter(UserState.chatting))
async def chatting_handler(message: types.Message, state: FSMContext):
    data = await state.get_data()
    db = next(get_db())
    request = Request.get_by_id(db, data["request_id"])

    if message.text and str(request.id) in message.text:
        if message.from_user.id == request.user.tg_id:
            await message.answer(
                CONTENT["chatting"]["messages"][0].format(
                    request_id=request.id, name=request.user.name
                )
                + "\n\n"
                + CONTENT["chatting"]["messages"][1],
                reply_markup=rate_buttons(request.id),
                parse_mode="HTML",
            )

            answer = await bot.send_message(
                request.leader.tg_id,
                CONTENT["rate"]["messages"][2],
                reply_markup=types.ReplyKeyboardRemove(),
                parse_mode="HTML",
            )
            await asyncio.sleep(1)
            await answer.delete()

            await bot.send_message(
                request.leader.tg_id,
                CONTENT["chatting"]["messages"][0].format(
                    request_id=request.id, name=request.user.name
                ),
                reply_markup=back_buttons(),
                parse_mode="HTML",
            )
            await state.set_state(UserState.rate)
        else:
            answer = await message.answer(
                CONTENT["rate"]["messages"][2],
                reply_markup=types.ReplyKeyboardRemove(),
                parse_mode="HTML",
            )
            await asyncio.sleep(1)
            await answer.delete()

            await message.answer(
                CONTENT["chatting"]["messages"][0].format(
                    request_id=request.id, name=request.leader.name
                ),
                reply_markup=back_buttons(),
                parse_mode="HTML",
            )
            await bot.send_message(
                request.user.tg_id,
                CONTENT["chatting"]["messages"][0].format(
                    request_id=request.id, name=request.leader.name
                )
                + "\n\n"
                + CONTENT["chatting"]["messages"][1],
                reply_markup=rate_buttons(request.id),
                parse_mode="HTML",
            )
            await state.set_state(UserState.main)
        Request.update(db, request.id, is_closed=True)
        return

    reciever = (
        request.leader
        if request.user.tg_id == message.from_user.id
        else request.user
    )
    try:
        await handle_and_send_message(bot, message, reciever, request)

    except Exception as e:
        logger.error(e)
        if request.user.tg_id == message.from_user.id:
            await message.answer(
                CONTENT["chatting"]["errors"][1].format(
                    leader_name=request.leader.name
                ),
                reply_markup=back_buttons(),
            )
            Request.update(db, request.id, is_closed=True)
        else:
            await message.answer(
                CONTENT["chatting"]["errors"][0].format(name=request.user.name),
                reply_markup=back_buttons(),
            )
            Request.update(db, request.id, is_closed=True)


@dp.callback_query(lambda c: c.data.split("_")[0] == "rate")
async def rate_handler(callback: types.CallbackQuery, state: FSMContext):
    answer = await callback.message.answer(
        CONTENT["rate"]["messages"][1],
        reply_markup=types.ReplyKeyboardRemove(),
        parse_mode="HTML",
    )
    await callback.message.delete()
    await asyncio.sleep(1)
    await answer.delete()

    callback_data = callback.data.split("_")
    db = next(get_db())
    request = Request.get_by_id(db, int(callback_data[1]))
    rating = int(callback_data[2])

    Request.update(db, request.id, rating=rating)
    
    await callback.message.answer(
        CONTENT["rate"]["messages"][0],
        reply_markup=back_buttons(),
        parse_mode="HTML",
    )
    await state.set_state(UserState.main)


dp.include_router(router)
