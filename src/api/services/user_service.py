from fastapi import HTTPException

def validate_name(name: str):
    if any(
        [
            " " in name,
            len(name) < 2,
            len(name) > 50,
        ]
    ):
        return False
    return True


def validate_esia_token(esia_token: str):
    if not esia_token:
        return False
    return True


class UserCreate:
    def __init__(self, esia_token: str, name: str, role: str):
        if not all(
            [
                validate_esia_token(esia_token),
                validate_name(name),
            ]
        ):
            raise HTTPException(status_code=422, detail="Invalid esia_token or name")

        self.esia_token = esia_token
        self.name = name
        self.role = role


