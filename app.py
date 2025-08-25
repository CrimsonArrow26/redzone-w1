import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, RedZone

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure your database URI from environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@app.route('/api/news')
def get_news():
    api_key = 'pub_c824623afeb34d20883fa0d4559aa4b6'  
    url = f'https://newsdata.io/api/1/latest?apikey=pub_c824623afeb34d20883fa0d4559aa4b6&q=crime%20in%20pune'

    try:
        response = requests.get(url)
        data = response.json()

        if "results" not in data:
            return jsonify([])

        articles = []
        for article in data["results"]:
            articles.append({
                "title": article.get("title", "No Title"),
                "summary": article.get("description", ""),
                "content": article.get("content", ""),
                "date": article.get("pubDate", ""),
                "location": article.get("source_id", "Unknown"),
                "category": "safety",
                "priority": "medium",
                "imageUrl": article.get("image_url"),
                "url": article.get("link")
            })

        return jsonify(articles)

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/red_zones')
def get_red_zones():
    zones = RedZone.query.all()
    return jsonify([z.to_dict() for z in zones])

if __name__ == '__main__':
    app.run(debug=True)
