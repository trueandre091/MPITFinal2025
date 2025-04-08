from enum import Enum


class Theme(Enum):
    informbureau = "Информбюро"
    show_me_moskow = "Покажите мне Москву, москвичи"
    moskow_duty_officer = "Дежурный по Москве"
    in_my_sphere = "В СВОей сфере"

    @staticmethod
    def text_to_theme(text: str):
        for theme in Theme:
            if theme.value == text:
                return theme
        return None
