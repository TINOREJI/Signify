from flask import Flask
from flask_cors import CORS
from app.routes import routes

app = Flask(__name__)
CORS(app)  # Allow all origins

app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
