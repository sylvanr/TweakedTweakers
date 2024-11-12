import json
import logging
import re


# Helper function to clean and convert price to a float
def clean_price(price_str):
    cleaned_price = re.sub(r'[^\d,]', '', price_str).replace(',', '.')
    try:
        return float(cleaned_price)
    except ValueError:
        return 0.0  # Default to 0.0 in case of parsing issues


# Helper function to decide if item is worth buying based on expected price
def should_buy(actual_price, expected_price):
    try:
        actual_price = float(actual_price)
        return actual_price <= expected_price * 1.1
    except ValueError:
        return False


def compare():
    logging.debug("Debug:: compare.py/compare(): Comparing scraped prices with expected prices")

    # Load sorted data from JSON
    with open('static/out/sorted_scraper.json', 'r') as file:
        scraped_data = json.load(file)
    # load expected item prices from JSON
    with open('data/items.json', 'r') as file:
        EXPECTED_PRICES = json.load(file)

    # Process each item in scraped data
    for _, items in scraped_data.items():
        for item in items:
            item_name = item["title"].replace("\n", " ")
            item_price = clean_price(item["price"])

            # Set default comparison fields
            item.update({"compared to": "None", "buy": "no", "compared price": "None"})

            # Compare item with expected prices
            for tool_key, details in EXPECTED_PRICES.items():
                if tool_key in item_name:
                    expected_price = details["target_price"]
                    item["compared to"] = tool_key
                    item["compared price"] = expected_price
                    if details["bought"]:
                        item["buy"] = "no"
                        break

                    # Determine if the item should be bought
                    item["buy"] = "yes" if should_buy(item_price, expected_price) else "no"
                    break

    # Save comparison results to JSON
    with open('static/out/compared.json', 'w') as file:
        json.dump(scraped_data, file, indent=4)

    logging.debug("Debug:: compare.py/compare(): Comparison completed and saved to static/out/compared.json.")


if __name__ == "__main__":
    compare()
