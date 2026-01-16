from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommender import engine
from config import PORT
import uvicorn

app = FastAPI(title="NEXORA Recommendation Engine")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:5001",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Loading data...")
    engine.load_data()

@app.get("/")
def read_root():
    return {"status": "online", "service": "recommendation-engine"}

@app.get("/recommend/home/{user_id}")
def get_home_recommendations(user_id: str, limit: int = 5):
    try:
        recs = engine.recommend_for_user(user_id, top_n=limit)
        return {"recommendations": recs}
    except Exception as e:
        print(f"Error: {e}")
        return {"recommendations": []}

@app.get("/recommend/product/{product_id}")
def get_product_recommendations(product_id: str, limit: int = 5):
    try:
        recs = engine.recommend_similar_products(product_id, top_n=limit)
        return {"recommendations": recs}
    except Exception as e:
        print(f"Error: {e}")
        return {"recommendations": []}

@app.post("/refresh")
def refresh_data():
    engine.load_data()
    return {"status": "refreshed"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
