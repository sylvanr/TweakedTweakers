import csv
import json
import logging

import pandas as pd


def convert_to_csv(target, output_dir='static/out'):
    """
    Converts a JSON file of product data into a CSV file.

    :param target: The name of the JSON file (without extension) to be converted
    :param output_dir: Directory where input JSON and output CSV files are located
    """
    input_file = f'{output_dir}/{target}.json'
    output_file = f'{output_dir}/{target}.csv'
    headers = ['store', 'url', 'title', 'price', 'compared price', 'compared to', 'buy']

    logging.debug(f"Debug:: csvify.py/convert_to_csv: Converting {input_file} to CSV...")

    # Load JSON data
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        logging.error(f"Error:: csvify.py/convert_to_csv: {input_file} not found.")
        return
    except json.JSONDecodeError:
        logging.error(f"Error:: csvify.py/convert_to_csv: Failed to decode JSON from {input_file}.")
        return

    # Write data to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()

        # Iterate over stores and products
        for store, products in data.items():
            for product in products:
                comp = product.get('compared to', None)
                if not comp or comp == "None":  # Skip entries without a 'compared to' value
                    continue

                # Write each product entry to CSV
                writer.writerow({
                    'store': store,
                    'url': product.get('url', ''),
                    'title': product.get('title', ''),
                    'price': product.get('price', ''),
                    'compared price': product.get('compared price', ''),
                    'compared to': product['compared to'],
                    'buy': product.get('buy', '')
                })

    # pandas load, remove duplicates, and save the csv file
    logging.debug("Debug:: csvify.py/convert_to_csv: Removing duplicates and saving the CSV file...")
    df = pd.read_csv(output_file)
    df.drop_duplicates(subset=['store', 'url', 'title', 'price'], keep='first', inplace=True)
    df.to_csv(output_file, index=False)
    logging.debug(f"Debug:: csvify.py/convert_to_csv: Data successfully written to {output_file}")


if __name__ == "__main__":
    convert_to_csv("compared")
