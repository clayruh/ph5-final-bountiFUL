#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random
from faker import Faker
from flask_bcrypt import Bcrypt

# Local imports
from app import app
from models import db, User, Plant, Pin

faker = Faker()
bcrypt = Bcrypt(app)

app.secret_key = b'u\xd2\xdc\xe82\xa3\xc0\xca\xe7H\xd03oi\xd1\x95\xcc\x7f'

if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        User.query.delete()
        Plant.query.delete()
        Pin.query.delete()

        print("Starting seed...")

        print("Creating users...")
        users = []
        pw_hash = bcrypt.generate_password_hash('password').decode('utf-8')
        for _ in range(2):
            user = User(
                admin=False,
                username=faker.user_name(),
                password_hash=pw_hash,
                fname=faker.first_name_nonbinary(),
                lname=faker.last_name_nonbinary(),
                address=faker.address()
            )
            users.append(user)
            db.session.add_all(users)
            db.session.commit()

        print("Creating plants...")
        plants = []
        for _ in range(30):
            plant = Plant(
                plant_name=faker.word()
            )
            plants.append(plant)
            db.session.add_all(plants)
            db.session.commit()

        print("Creating pins...")
        pins = []
        for _ in range(50):
            pin = Pin(
                image=faker.url(),
                latitude=faker.latitude(),
                longitude=faker.longitude(),
                # eventually can swap for faker.paragraph() to work with a longer string of text
                comment=faker.word(),
                user=random.choice(users),
                plant=random.choice(plants)
            )
            pins.append(pin)
            db.session.add_all(pins)
            db.session.commit()

        print("Seeding complete!")