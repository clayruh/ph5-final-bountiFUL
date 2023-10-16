#!/usr/bin/env python3
# Remote library imports
from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
import requests
import base64
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

# Local imports
from config import app, db
from models import User, Plant, Pin
import os

PLANT_ID_API_KEY=os.environ.get('PLANT_ID_API_KEY')

app.secret_key = b'u\xd2\xdc\xe82\xa3\xc0\xca\xe7H\xd03oi\xd1\x95\xcc\x7f'

bcrypt = Bcrypt(app)

URL = '/api/v1'

# HELPER METHODS #
def current_user():
    print(f"\nuser id: {session.get('user_id')}\n")
    return User.query.filter(User.id == session.get('user_id')).first()

def check_admin():
    return current_user() and current_user().admin

# ============ USER SIGNUP ============ #

@app.post(URL + '/users')
def create_user():
    try:
        data = request.json

        pw_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        new_user = User(username=data['username'], password_hash=pw_hash, fname=data['fname'], lname=data['lname'], address=data['address'])
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id

        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 406
    
# ============ SESSION LOGIN/LOGOUT ============ #

@app.post(URL + '/login')
def login():
    print(f"\n\ncurrent user: {current_user()}\n\n")
    data = request.json
    print(data)
    user = User.query.filter(User.username == data['username']).first()

    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        session['user_id'] = user.id
        return jsonify(user.to_dict()), 202
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    
@app.get(URL + '/check_session')
def check_session():
    user = current_user()
    if user:
        return jsonify( user.to_dict() ), 200
    else: 
        return {}, 401
    
@app.delete(URL + '/logout')
def logout():
    session['user_id'] = None
    # session.pop('user_id')
    return {}, 204

# ============ USERS ============ #

@app.get(URL + '/users')
def get_users():
    users=User.query.all()
    return jsonify([user.to_dict(rules=('-pins.plant_id', '-pins.user_id')) for user in users]), 200

@app.get(URL + '/users/<int:id>')
def get_users_by_id(id):
    user=User.query.filter(User.id==id).first()
    return jsonify(user.to_dict(rules=('-pins',))), 200


@app.patch(URL + '/users/<int:id>')
def edit_user(id):
    data = request.json
    User.query.filter(User.id == id).update(data)
    db.session.commit()
    user = User.query.filter(User.id == id).first()
    return jsonify(user.to_dict()), 202

@app.delete(URL + '/users/<int:id>')
def delete_user(id):
    user = User.query.filter(User.id == id).first()
    db.session.delete(user)
    return jsonify({}), 204

# ============ PINS ============ #

@app.get(URL + '/pins')
def get_pins():
    pins = Pin.query.all()
    return jsonify([pin.to_dict(rules=('-user.id', '-user.address', '-user.admin', '-user.password_hash', 'user.fname', '-user.lname', '-user_id', '-plant_id')) for pin in pins]), 200

# is this right? current_user()? or session.get('user_id')
@app.get(URL + '/pins/<int:id>')
def get_pins_by_user_id(id):
    pin = Pin.query.filter(Pin.user_id == current_user()).first()
    return jsonify(pin.to_dict(rules=('-user_id',))), 200

@app.post(URL + '/pins')
def create_pin():
    data = request.json
    new_pin = Pin(image=data['image'], location=data['location'], comment=data['comment'])
    # somehow will need to grab the current user id that is logged in as well as the plant 
    db.session.add(new_pin)
    db.session.commit()
    return jsonify(new_pin.to_dict()), 201

@app.patch(URL + '/pins/<int:id>')
def edit_pin(id):
    data = request.json
    Pin.query.filter(Pin.id == id).update(data)
    db.session.commit()
    pin = Pin.query.filter(Pin.id == id).first()
    return jsonify(pin.to_dict()), 202

@app.delete(URL + '/pins/<int:id>')
def delete_pin(id):
    pin = Pin.query.filter(Pin.id == id).first()
    if pin:
        db.session.delete(pin)
        db.session.commit()
        return jsonify({}), 200
    else:
        return jsonify({"error": "Pin not found"}), 404

# ============= PLANT ID API ============== #

@app.post(URL + '/process-image')
def process_image():
    # try:
    comment = request.form.get('comment')
    image = request.files.get('upload-image')
    # since we append on the front-end with formData.append, we're looking for the key 'lat' 'lng'
    latitude = request.form['lat']
    longitude = request.form['lng']
    print(f"\n\n\nform data: {request.form}")
    print(f"files: {request.files}")
    # files: ImmutableMultiDict([('upload-image', <FileStorage: 'IMG_5056.jpg' ('image/jpeg')>)])
    print(f"comment: {request.form.get('comment')}")
    # form: ImmutableMultiDict([('comment', 'i am comment!!!!!!!!')])
    print(f"image: {request.files.get('upload-image')}")
    # image: <FileStorage: 'IMG_5056.jpg' ('image/jpeg')>
    # print(request.headers)
    print(f"\n\nlat: {latitude}, long: {longitude}")
    # lat: 40.7053516, long: -74.0140096

    # encode the image uploaded from the front-end
    encoded_img = [base64.b64encode(image.read()).decode("ascii")]

    if encoded_img is not None:
        print("\nwe're gonna get the result?\n")
        result = send_to_plant_id(encoded_img)
        print("\nwe got the result\n")
        print(result)
        print("\n\n\n")
        # iterate through the dictionary and return values
        for suggestion in result["suggestions"]:
            plant_name = suggestion['plant_name']
            common_names = suggestion['plant_details']['common_names']
            common_name = common_names[0] if common_names else "No common names available"
            probability = suggestion['probability']

            print(f" >> {plant_name} AKA: {common_name} -- {probability}%")

        # if plant already exists, use the existing plant
        common_names = result["suggestions"][0]["plant_details"]["common_names"]
        if common_names:
            plant_name = common_names[0]
        else:
            plant_name = result["suggestions"][0]["plant_name"]
        existing_plant = Plant.query.filter(Plant.plant_name==plant_name).first()
        if existing_plant:
            plant = existing_plant
        else:
            plant = Plant(plant_name=plant_name)
            db.session.add(plant)
            db.session.commit()

        # assign the logged-in user
        user = current_user()

        # if latitude or latitude == None: # aka my apt lol
        #     latitude = 40.742006
        #     longitude = -73.924876

        # update image url to the one from plant.id (where they store it)
        img_from_plant_id = result['images'][0]['url']        
        if img_from_plant_id.startswith("https://plant.id/media/imgs/"):
            img = "https://storage.googleapis.com/mlapi_images/plant.id/production/" + img_from_plant_id[len("https://plant.id/media/imgs/"):]

        pin = Pin(image=img, latitude=latitude, longitude=longitude, comment=comment, plant=plant, user=user)

        db.session.add(pin)
        db.session.commit()
    return jsonify(pin.to_dict()), 200

    # if image and allowed_file(image.filename):
    #     result = send_to_plant_id(image)
    #     return jsonify(result)

        # else:
        #     return jsonify({"error": "Invalid or unsupported image format"})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

def send_to_plant_id(image):
    # response = requests.post('https://plant.id/api/v3/identification', files={'image': image})
    response = requests.post(
        "https://api.plant.id/v2/identify",
        json={
            "images": image,
            # "modifiers": ["similar_images"],
            "plant_details": ["common_names", "url"]
        },
        headers={
            "Content-Type": "application/json",
            "Api-Key": PLANT_ID_API_KEY
        }
    )
    result = response.json()
    return result

# ============ PLANTS ============ #
@app.get(URL + '/plants')
def get_plants():
    plants = Plant.query.all()
    return jsonify([plant.to_dict(rules=('-pins.user_id', '-pins.user.admin', '-pins.user.password_hash', '-pins.user.username', '-pins.user.address')) for plant in plants]), 200

@app.get(URL + '/plants/<int:id>')
def get_plants_by_id(id):
    plant = Plant.query.filter(Plant.id == id).first()
    return jsonify(plant.to_dict(rules=('-pins.user_id', '-pins.user.admin', '-pins.user.password_hash', '-pins.user.username', '-pins.user.address'))), 200

@app.patch(URL + '/plants/<int:id>')
def edit_plant(id):
    pass

@app.delete(URL + '/plants/<int:id>')
def delete_plant(id):
    pass

# ====================== GOOGLE MAPS API ====================== #


if __name__ == '__main__':
    app.run(port=5555, debug=True)

