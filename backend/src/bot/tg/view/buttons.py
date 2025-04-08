from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButtonRequestChat,
    KeyboardButtonRequestUser,
    ReplyKeyboardMarkup,
    KeyboardButton,
)
from bot.tg.utils.themes_enum import Theme


def themes_buttons(is_admin: bool = False):
    buttons = [
        [InlineKeyboardButton(text=theme.value, callback_data=theme.name)]
        for theme in Theme
    ]
    if is_admin:
        buttons.append(
            [InlineKeyboardButton(text="Режим администратора", callback_data="admin")]
        )
    buttons = InlineKeyboardMarkup(inline_keyboard=buttons)
    return buttons


def request_buttons():
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Получить консультацию", callback_data="request"
                )
            ]
        ]
        + [[InlineKeyboardButton(text="Главное меню", callback_data="main")]]
    )
    return buttons


def request_card_buttons(request_id: int):
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Откликнуться", callback_data=f"respond_confirm_{request_id}"
                )
            ],
            [
                InlineKeyboardButton(
                    text="Отклонить", callback_data=f"reject_confirm_{request_id}"
                )
            ],
        ]
    )
    return buttons


def confirm_buttons(user_id: int, msg_id: int, action: str, request_id: int):
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Да",
                    callback_data=f"yes_{user_id}_{msg_id}_{action}_{request_id}",
                )
            ],
            [InlineKeyboardButton(text="Нет", callback_data=f"no_{user_id}_{msg_id}")],
        ]
    )
    return buttons


def respond_buttons(bot_username: str, request_id: int):
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Перейти в чат",
                    url=f"https://t.me/{bot_username}?start={request_id}",
                )
            ],
        ]
    )
    return buttons


def stop_chatting_buttons(request_id: int):
    buttons = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text=f"Закончить разговор и закрыть запрос {request_id}",
                )
            ]
        ],
        resize_keyboard=True,
    )
    return buttons


def rate_buttons(request_id: int):
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=f"{i}", callback_data=f"rate_{request_id}_{i}"
                )
                for i in range(1, 6)
            ],
            [
                InlineKeyboardButton(
                    text=f"{i}", callback_data=f"rate_{request_id}_{i}"
                )
                for i in range(6, 11)
            ],
        ]
    )
    return buttons


def back_buttons(request_id: int = None):
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Главное меню",
                    callback_data=("main" if not request_id else f"main_{request_id}"),
                )
            ]
        ]
    )
    return buttons


def admin_buttons():
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Выбрать чат", callback_data="admin_choose_chat"
                )
            ],
            [
                InlineKeyboardButton(
                    text="Назначить лидера", callback_data="admin_choose_leader"
                )
            ],
            [
                InlineKeyboardButton(
                    text="Исключить лидера", callback_data="admin_exclude_leader"
                )
            ],
            [InlineKeyboardButton(text="Режим пользователя", callback_data="main")],
        ]
    )
    return buttons


def admin_choose_chat_buttons():
    buttons = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="Выбрать чат",
                    request_chat=KeyboardButtonRequestChat(
                        request_id=0, chat_is_group=True, chat_is_channel=False
                    ),
                )
            ]
        ],
        resize_keyboard=True,
        one_time_keyboard=True,
    )
    return buttons


def admin_choose_leader_buttons():
    buttons = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="Выбрать лидера",
                    request_user=KeyboardButtonRequestUser(
                        request_id=0, user_is_bot=False
                    ),
                )
            ]
        ],
        resize_keyboard=True,
        one_time_keyboard=True,
    )
    return buttons
