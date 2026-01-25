from pymongo import MongoClient
from config import MONGODB_URI

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
# Parse database name from URI if possible, else default
try:
    db_name = MONGODB_URI.split("/")[-1].split("?")[0]
    if not db_name:
        db_name = "nexora"
except:
    db_name = "nexora"

db = client[db_name]

def get_database():
    return db
