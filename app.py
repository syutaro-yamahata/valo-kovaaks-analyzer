from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = "my api"

@app.route("/api/valorant", methods=["GET"])

def get_valorant_stats():
    # ダミーデータを返す（今はTracker.ggが使えないので）
    return jsonify({
        "data": [{
            "stats": {
                "kd": {"displayValue": "1.28"},
                "winRatio": {"displayValue": "53%"},
                "headshotPct": {"displayValue": "27%"}
            }
        }]
    })
# def get_valorant_stats():
#     valo_id = request.args.get("id")
#     if not valo_id:
#         return jsonify({"error": "No Valorant ID provided"}), 400

#     encoded_id = valo_id.replace("#", "%23")
#     url = f"https://api.tracker.gg/api/v2/valorant/standard/profile/riot/{encoded_id}/segments/overview"

#     headers = {
#         "TRN-Api-Key": API_KEY
#     }

#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()
#         return jsonify(response.json())
#     except requests.exceptions.RequestException as e:
#         return jsonify({"error": str(e)}), 500



@app.route("/")
def home():
    return "Flask is running!"

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
