#!/usr/bin/env python3
# Remote library imports
from flask import request, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Plant, Pin

@app.route('/')
def index():
    return '<h1>WildHarvest Server</h1>'

# ============ USERS ============ #

@app.get('/users')
def get_users():
    users=User.query.all()
    return jsonify([user.to_dict(rules=('-pins.plant_id', '-pins.user_id')) for user in users]), 200

@app.get('/users/<int:id>')
def get_users_by_id(id):
    user=User.query.filter(User.id==id).first()
    return jsonify(user.to_dict(rules=('-pins',))), 200

@app.post('/users')
def create_user():
    data = request.json
    new_user = User(username=data['username'], password=data['password'], fname=data['fname'], lname=data['lname'], address=data['address'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.patch('/users/<int:id>')
def edit_user(id):
    data = request.json
    User.query.filter(User.id == id).update(data)
    db.session.commit()
    user = User.query.filter(User.id == id).first()
    return jsonify(user.to_dict()), 202

@app.delete('/users/<int:id>')
def delete_user(id):
    user = User.query.filter(User.id == id).first()
    db.session.delete(user)
    return jsonify({}), 204

# ============ PINS ============ #

@app.get('/pins')
def get_pins():
    pins = Pin.query.all()
    return jsonify([pin.to_dict(rules=('-user_id',)) for pin in pins]), 200

@app.get('/pins/<int:id>')
def get_pins_by_id(id):
    pin = Pin.query.filter(Pin.id == id).first()
    return jsonify(pin.to_dict(rules=('-user_id',))), 200

@app.post('/pins')
def create_pin():
    data = request.json
    new_pin = Pin(image=data['image'], location=data['location'], comment=data['comment'])
    # somehow will need to grab the current user id that is logged in as well as the plant 
    db.session.add(new_pin)
    db.session.commit()
    return jsonify(new_pin.to_dict()), 201

@app.patch('/pins/<int:id>')
def edit_pin(id):
    data = request.json
    Pin.query.filter(Pin.id == id).update(data)
    db.session.commit()
    pin = Pin.query.filter(Pin.id == id).first()
    return jsonify(pin.to_dict()), 202

@app.delete('/pins/<int:id>')
def delete_pin(id):
    pass

# ============ PLANTS ============ #

@app.get('/plants')
def get_plants():
    plants = Plant.query.all()
    return jsonify([plant.to_dict(rules=('-pins.user_id', '-pins.user.password', '-pins.user.username', '-pins.user.address')) for plant in plants]), 200

@app.get('/plants/<int:id>')
def get_plants_by_id(id):
    plant = Plant.query.filter(Plant.id == id).first()
    return jsonify(plant.to_dict(rules=('-pins.user_id', '-pins.user.password', '-pins.user.username', '-pins.user.address'))), 200

@app.post('/plants/')
def create_plant():
    pass

@app.patch('/plants/<int:id>')
def edit_plant(id):
    pass

@app.delete('/plants/<int:id>')
def delete_plant(id):
    pass

if __name__ == '__main__':
    app.run(port=5555, debug=True)

