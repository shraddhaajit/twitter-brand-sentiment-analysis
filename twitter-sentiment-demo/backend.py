# backend.py
from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta
import requests
import os

app = Flask(__name__)
CORS(app)

# ------------------------------
# Config: Replace with your Bearer Token if using real Twitter data
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")  # set as env variable
# ------------------------------

# Keep historical data in memory
HISTORICAL_MINUTES = 30  # show last 30 minutes
sentiment_history = []
volume_history = []

# Initialize historical data
def init_history():
    global sentiment_history, volume_history
    now = datetime.utcnow()
    sentiment_history = []
    volume_history = []
    for i in range(HISTORICAL_MINUTES):
        t = (now - timedelta(minutes=HISTORICAL_MINUTES - i)).strftime("%H:%M")
        pos = random.randint(50, 100)
        neu = random.randint(20, 50)
        neg = random.randint(10, 40)
        sentiment_history.append({"time": t, "Positive": pos, "Neutral": neu, "Negative": neg})
        volume_history.append({"time": t, "volume": pos + neu + neg})

init_history()

# ------------------------------
# Helper to generate fake popular tweets
def generate_fake_tweets(brand):
    fake_samples = [
        f"Big news about {brand} just dropped today!",
        f"{brand} is trending globally right now!",
        f"People are talking about {brand} like crazy...",
        f"Check out the latest from {brand}!",
        f"Everyone is sharing {brand} updates!",
        f"{brand} fans are excited today!",
        f"Latest {brand} headlines are wild!",
    ]
    selected = random.sample(fake_samples, 5)
    # shorten to one line max
    return [{"content": s if len(s) <= 80 else s[:77] + "...", "sentiment": random.choice(["positive","neutral","negative"])} for s in selected]

# ------------------------------
# Route: Sentiment for Pie Chart
@app.route("/api/sentiment/<brand>")
def sentiment(brand):
    # Latest data
    latest = sentiment_history[-1]
    return jsonify({
        "Positive": latest["Positive"],
        "Neutral": latest["Neutral"],
        "Negative": latest["Negative"]
    })

# ------------------------------
# Route: Trend for Line Charts (Sentiment + Volume)
@app.route("/api/trend/<brand>")
def trend(brand):
    global sentiment_history, volume_history

    # simulate slight change for latest point
    last_sentiment = sentiment_history[-1]
    last_volume = volume_history[-1]

    new_pos = max(0, last_sentiment["Positive"] + random.randint(-5, 5))
    new_neu = max(0, last_sentiment["Neutral"] + random.randint(-3, 3))
    new_neg = max(0, last_sentiment["Negative"] + random.randint(-3, 3))
    new_time = datetime.utcnow().strftime("%H:%M")

    new_sentiment_point = {"time": new_time, "Positive": new_pos, "Neutral": new_neu, "Negative": new_neg}
    new_volume_point = {"time": new_time, "volume": new_pos + new_neu + new_neg}

    sentiment_history.append(new_sentiment_point)
    volume_history.append(new_volume_point)

    # Keep history length constant
    if len(sentiment_history) > HISTORICAL_MINUTES:
        sentiment_history = sentiment_history[-HISTORICAL_MINUTES:]
    if len(volume_history) > HISTORICAL_MINUTES:
        volume_history = volume_history[-HISTORICAL_MINUTES:]

    return jsonify(sentiment_history)

# ------------------------------
# Route: Live Feed (Top 5 tweets)
@app.route("/api/tweets/<brand>")
def tweets(brand):
    tweets_list = []

    # Try fetching real tweets if token is set
    if TWITTER_BEARER_TOKEN:
        headers = {"Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"}
        query = f"{brand} lang:en -is:retweet -is:reply"
        url = "https://api.twitter.com/2/tweets/search/recent"
        params = {
            "query": query,
            "max_results": 10,
            "tweet.fields": "public_metrics,created_at,text",
        }
        try:
            res = requests.get(url, headers=headers, params=params, timeout=5)
            if res.status_code == 200:
                data = res.json().get("data", [])
                # Filter by 10k+ likes
                filtered = [t for t in data if t.get("public_metrics", {}).get("like_count", 0) >= 10000]
                for t in filtered[:5]:
                    content = t["text"]
                    if len(content) > 80:
                        content = content[:77] + "..."
                    tweets_list.append({"content": content, "sentiment": "neutral"})
        except:
            pass

    # If no real tweets, generate fake ones
    if len(tweets_list) < 5:
        needed = 5 - len(tweets_list)
        tweets_list.extend(generate_fake_tweets(brand)[:needed])

    # Ensure exactly 5
    tweets_list = tweets_list[:5]
    return jsonify(tweets_list)

# ------------------------------
if __name__ == "__main__":
    init_history()
    app.run(debug=True)