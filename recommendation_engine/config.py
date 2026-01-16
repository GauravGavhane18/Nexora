import os
from dotenv import load_dotenv
from pathlib import Path

# Load env from parent directory
env_path = Path(__file__).resolve().parent.parent / 'backend' / '.env'
load_dotenv(dotenv_path=env_path)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/nexora")
PORT = int(os.getenv("RECOMMENDATION_PORT", 8000))
