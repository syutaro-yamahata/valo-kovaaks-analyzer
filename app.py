from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "ee3d04b8-714d-49b4-b601-9470aec394a4"

@app.route("/api/valorant", methods=["GET"])
def get_valorant_stats():
    valo_id = request.args.get("id")
    if not valo_id:
        return jsonify({"error": "No Valorant ID provided"}), 400

    encoded_id = valo_id.replace("#", "%23")
    url = f"https://api.tracker.gg/api/v2/valorant/standard/profile/riot/{encoded_id}/segments/overview"

    headers = {
        "TRN-Api-Key": API_KEY
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
