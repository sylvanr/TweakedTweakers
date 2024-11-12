import logging

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import confirm_logger
from services.data import load_items, load_webshops
from services.main import main
from services.manage import manage_content
from services.results import get_results
from services.verify import verify_get_data, verify_update_data

app = Flask(__name__)
CORS(app)

confirm_logger()


@app.route('/', methods=['GET'])
def health_check():
    """Health check route to test whether the API is up."""
    logging.debug("Debug:: app.py/health_check(): health check requested")
    return jsonify({"status": "API is up and running"})


@app.route('/scrape', methods=['POST'])
def scrape():
    """Handle the scraping, sorting, comparison, and price tracking process."""
    logging.debug("Debug:: app.py/scrape(): scrape page requested")

    data = request.get_json()
    scrape = data.get('scrape', True)
    sort = data.get('sort', True)
    compare = data.get('compare', True)
    price_track = data.get('price_track', True)
    quick_test = data.get('quick_test', False)
    scrape_items = data.get('scrape_items', [])
    scrape_webshops = data.get('scrape_webshops', [])
    result = main(scrape, sort, compare, price_track, quick_test, scrape_items, scrape_webshops)
    return jsonify(result)


@app.route('/verify/get-data', methods=['GET'])
def get_verify_data():
    """Trigger verify_get_data and return the resulting dataframe as JSON."""
    logging.debug("Debug:: app.py/get_verify_data(): verify/get-data requested")
    result = verify_get_data()
    return jsonify(result)


@app.route('/verify/update-data', methods=['POST'])
def update_verify_data():
    """Trigger verify_update_data with wrong_items and return the result."""
    logging.debug("Debug:: app.py/update_verify_data(): verify/update-data requested")
    data = request.get_json()
    result = verify_update_data(data)
    return jsonify(result)


@app.route('/results/get-data', methods=['GET'])
def get_results_data():
    """Trigger get_data from services/results and return the resulting data as JSON."""
    logging.debug("Debug:: app.py/get_results_data(): results/get-data requested")
    result = get_results()
    return jsonify(result)


@app.route('/manage', methods=['POST'])
def manage_content_route():
    """Handle the management of an item, either existing or new."""
    logging.debug("Debug:: app.py/manage_content(): content management")
    data = request.get_json()
    item_name = data.get('item_name', None)
    new_item = data.get('new_item', None)
    operation = data.get('operation', None)
    _type = data.get('type', None)

    result = manage_content(item_name, new_item, operation, _type)
    return jsonify(result)


@app.route('/get-items', methods=['GET'])
def get_items():
    """Return the items.json file as JSON."""
    logging.debug("Debug:: app.py/get_items(): get-items requested")
    res = load_items()
    return jsonify(res)


@app.route('/get-webshops', methods=['GET'])
def get_webshops():
    """Return the webshops.json file as JSON."""
    logging.debug("Debug:: app.py/get_webshops(): get-webshops requested")
    res = load_webshops()
    return jsonify(res)


if __name__ == '__main__':
    logging.debug("Debug:: app.py/__main__(): Running flask app...")
    app.run(debug=False, port=5000)
