from aiogram import types
from api.models.request import Request
from api.models.admin import Admin
from api.database import get_db
from bot.tg.view.buttons import stop_chatting_buttons


def check_user_is_admin(callback: types.CallbackQuery) -> bool:
    db = next(get_db())
    return Admin.get_by_tg_id(db, callback.from_user.id) is not None


def get_request_card(request: Request) -> str:
    name = request.user.name
    theme = request.theme
    message = request.message
    request_card = f"<b>Запрос от {name}</b>\n\nТема: {theme}\nСообщение: {message}\n\nЧтобы откликнуться, нажмите кнопку ниже (только лидер) ⬇️"
    return request_card


async def handle_and_send_message(bot, message, reciever, request):
    if message.text:
        await bot.send_message(
            reciever.tg_id,
            message.text,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.photo:
        photo = message.photo[-1]
        file_id = photo.file_id
        await bot.send_photo(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.voice:
        voice = message.voice
        file_id = voice.file_id
        await bot.send_voice(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.video:
        video = message.video
        file_id = video.file_id
        await bot.send_video(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.sticker:
        sticker = message.sticker
        file_id = sticker.file_id
        await bot.send_sticker(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.document:
        document = message.document
        file_id = document.file_id
        await bot.send_document(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.audio:
        audio = message.audio
        file_id = audio.file_id
        await bot.send_audio(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.animation:
        animation = message.animation
        file_id = animation.file_id
        await bot.send_animation(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.location:
        location = message.location
        await bot.send_location(
            reciever.tg_id,
            location.latitude,
            location.longitude,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.contact:
        contact = message.contact
        await bot.send_contact(
            reciever.tg_id,
            contact.phone_number,
            contact.first_name,
            contact.last_name,
            reply_markup=stop_chatting_buttons(request.id),
        )
    if message.video_note:
        video_note = message.video_note
        file_id = video_note.file_id
        await bot.send_video_note(
            reciever.tg_id,
            file_id,
            reply_markup=stop_chatting_buttons(request.id),
        )
