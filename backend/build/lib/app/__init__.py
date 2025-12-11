from flask import Flask
from flask_cors import CORS
from .routes import filter_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(filter_blueprint)

    return app