from aiogram import Router, types, filters, F
from aiogram.fsm.context import FSMContext

from bot.tg.fsm.states import UserState
from bot.tg.bot import dp, bot
from bot.tg.view.buttons import themes_buttons, back_buttons, respond_buttons
from bot.tg.view.content import CONTENT
from bot.tg.utils.fn import check_user_is_admin
from bot.tg.utils.logger import get_logger

from api.models.user import User
from api.models.leader import Leader
from api.models.request import Request
from api.database import get_db

logger = get_logger(__name__)

router = Router()


@router.message(filters.Command("start"))
async def start_command_handler(message: types.Message, state: FSMContext):
    text = message.text.split()
    db = next(get_db())
    if len(text) == 2:
        user = User.get_by_id(db, int(text[1]))
        if user:
            if not user.tg_id:
                User.update(db, user.id, tg_id=message.from_user.id)
                await message.answer(
                    CONTENT["start"]["messages"][1],
                    parse_mode="HTML",
                )

        request = Request.get_by_id(db, int(text[1]))
        if request:
            if message.from_user.id in [request.user.tg_id, request.leader.tg_id]:
                await state.update_data(request_id=request.id)
                if message.from_user.id == request.user.tg_id:
                    user = User.get_by_tg_id(db, message.from_user.id)
                    if user:
                        await state.update_data(id=user.id)
                        await message.answer(
                            CONTENT["respond"]["messages"][2].format(
                                leader_name=request.leader.name
                            ),
                            parse_mode="HTML",
                        )
                        await state.set_state(UserState.chatting)
                        return
                    else:
                        await message.answer(
                            CONTENT["confirm"]["errors"][0],
                            parse_mode="HTML",
                        )   
                        return
                else:
                    leader = Leader.get_by_tg_id(db, message.from_user.id)
                    if not leader:
                        await message.answer(
                            CONTENT["confirm"]["errors"][2],
                            parse_mode="HTML",
                        )
                        return

                await message.answer(
                    CONTENT["respond"]["messages"][3].format(
                        leader_name=request.leader.name, name=request.user.name
                    ),
                    parse_mode="HTML",
                )
                try:
                    await bot.send_message(
                        request.user.tg_id,
                        CONTENT["respond"]["messages"][1].format(
                            leader_name=request.leader.name
                        ),
                        reply_markup=respond_buttons(
                            (await bot.get_me()).username, request.id
                        ),
                        parse_mode="HTML",
                    )
                except Exception as e:
                    logger.error(e)
                    await message.answer(
                        CONTENT["respond"]["errors"][0].format(name=request.user.name),
                        parse_mode="HTML",
                    )
                    Request.update(db, request.id, is_closed=True)

                    await message.answer(
                        CONTENT["start"]["messages"][0],
                        reply_markup=back_buttons(),
                        parse_mode="HTML",
                    )
                    await state.set_state(UserState.start)
                    return

                await state.set_state(UserState.chatting)
                return

    user = User.get_by_tg_id(db, message.from_user.id)
    if user:
        await state.update_data(id=user.id)

    await message.answer(
        CONTENT["start"]["messages"][0],
        reply_markup=back_buttons(),
        parse_mode="HTML",
    )
    await state.set_state(UserState.start)


@dp.callback_query(
    F.data == "main", ~filters.StateFilter(UserState.chatting)
)
async def main_command_handler(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    if "id" not in data:
        db = next(get_db())
        user = User.get_by_tg_id(db, callback.from_user.id)
        if user:
            await state.update_data(id=user.id)

    await callback.message.edit_text(
        CONTENT["main"]["message"],
        reply_markup=themes_buttons(check_user_is_admin(callback)),
        parse_mode="HTML",
    )
    await state.set_state(UserState.main)


@dp.callback_query(
    F.data.startswith("main_"), filters.StateFilter(UserState.chatting)
)
async def main_command_handler(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    if "id" not in data:
        db = next(get_db())
        user = User.get_by_tg_id(db, callback.from_user.id)
        if user:
            await state.update_data(id=user.id)

    await callback.message.edit_text(
        CONTENT["main"]["message"],
        reply_markup=themes_buttons(check_user_is_admin(callback)),
        parse_mode="HTML",
    )
    await state.set_state(UserState.main)


dp.include_router(router)
