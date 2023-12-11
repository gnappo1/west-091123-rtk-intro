from flask_restful import Resource
from flask import jsonify, make_response
from flask_jwt_extended import (
    jwt_required,
)

class Logout(Resource):
    @jwt_required()
    def delete(self):
            return {"message": "success"}, 202
