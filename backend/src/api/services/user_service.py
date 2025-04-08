from fastapi import HTTPException


def validate_name(name: str):
    if any(
        [
            " " in name,
            len(name) < 2,
            len(name) > 30,
        ]
    ):
        return False    
    return True


class UserCreate:
    def __init__(self, esia_token: str, name: str):
        if not all(
            [
                validate_name(name),
            ]
        ):
            raise HTTPException(status_code=422, detail="Invalid name")

        self.esia_token = esia_token
        self.name = name



