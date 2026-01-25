import os
from dotenv import load_dotenv
from pathlib import Path

# Try to load .env from parent directory for local dev
try:
    env_path = Path(__file__).resolve().parent.parent / 'backend' / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except Exception:
    pass

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/nexora")
PORT = int(os.getenv("PORT", 8000))
