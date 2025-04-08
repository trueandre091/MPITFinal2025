from aiogram.fsm.state import State, StatesGroup


class UserState(StatesGroup):
    start = State()
    main = State()
    themes = State()
    profile = State()
    request = State()
    confirm = State()
    respond = State()
    reject = State()
    chatting = State()
    rate = State()

    admin_choose_chat = State()
    admin_choose_leader = State()
    admin_leader_name = State()
    admin_exclude_leader = State()
