from flask import Blueprint, request, jsonify
from .utils import process_text

routes = Blueprint('routes', __name__)

@routes.route('/api/process-text', methods=['POST'])
def process_text_endpoint():
    try:
        data = request.get_json()
        print("Received data:", data)

        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        keywords = process_text(text)
        return jsonify({"keywords": keywords}), 200

    except Exception as e:
        print("Error occurred:", e)
        return jsonify({"error": str(e)}), 500
