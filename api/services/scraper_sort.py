import json
import logging
import re


def clean_price(price):
    """
    Cleans and converts a price string to a float.

    :param price: Price string to be cleaned and converted
    :return: Float representation of price, or 0.0 on conversion error
    """
    cleaned_price = re.sub(r'[^\d,.]', '', price).replace(',', '.')
    try:
        return float(cleaned_price)
    except ValueError:
        return 0.0


def scraper_sort(input_file='./static/out/scraper.json', output_file='./static/out/sorted_scraper.json'):
    """
    Sorts the product data in JSON by price in ascending order.

    :param input_file: Path to the input JSON file with scraped data
    :param output_file: Path to save the sorted JSON data
    """
    logging.debug("Debug:: scraper_sort.py/scraper_sort: Sorting product lists by price in ascending order...")

    # Load JSON data
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Sort each product list in the JSON data by cleaned price
    for _, products in data.items():
        products.sort(key=lambda x: clean_price(x.get('price', '0')))

    # Save sorted data back to JSON
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    logging.debug(f"Debug:: scraper_sort.py/scraper_sort: Data sorted and saved to '{output_file}'")


if __name__ == "__main__":
    scraper_sort()
