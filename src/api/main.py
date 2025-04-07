import asyncio
from fastapi import FastAPI, Request
from api.settings import get_settings
from api.database import create_db
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from api.routers import auth

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.DB_CREATED:
        create_db()
        settings.DB_CREATED = True
    yield


app = FastAPI(title="API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


@app.get("/")
async def root():
    return {"detail": "Hello World"}


async def start_api():
    import uvicorn

    config = uvicorn.Config(app, host="0.0.0.0", port=8000)
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(start_api())
