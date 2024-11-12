# load and return json data from file
import json
import logging


def load_json(target):
    try:
        with open(f'data/{target}.json', 'r') as file:
            return json.load(file)
    except Exception as e:
        logging.error(f"Error:: services/data.py/load_json(): {e}")
        return {'error': 'An error occurred while loading the data.'}


def load_items():
    return load_json('items')


def load_webshops():
    return load_json('webshops')
