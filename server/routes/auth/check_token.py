from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
)
from flask import make_response

class CheckToken(Resource):
    @jwt_required()
    def get(self):
        return make_response({"message": "Valid Token"}, 202)
