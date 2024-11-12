import logging

import pandas as pd

from services.charts import make_charts
from services.price_track import price_track


def verify_rows(rows_to_verify):
    # Prepare rows with default "correct" or "wrong" values based on price comparison
    rows_with_buttons = []
    for index, row in rows_to_verify.iterrows():
        default_value = "correct" if float(row['price'].replace(',', '.')) >= row['compared price'] * 0.8 else "wrong"
        rows_with_buttons.append({
            'index': index,
            'store': row['store'],
            'title': row['title'],
            'price': row['price'],
            'compared_price': row['compared price'],
            'compared_to': row['compared to'],
            'default_value': default_value
        })
# sort rows_with_buttons by `compared to` on alphabetical order
    return sorted(rows_with_buttons, key=lambda x: x['compared_to'])


def verify_get_data():
    logging.debug("Debug:: app/verify.py/verify(): verify page requested")
    df = pd.read_csv("static/out/compared.csv")
    rows_to_verify = df[df['buy'].str.lower() == 'yes']

    rows_with_buttons = verify_rows(rows_to_verify)
    return rows_with_buttons


def verify_update_data(wrong_rows):
    logging.debug("Debug:: app/verify.py/verify(): verify posted, removing incorrect rows")
    df = pd.read_csv("static/out/compared.csv")
    for index in wrong_rows:
        df.drop(index, inplace=True)
    df.to_csv('static/out/compared.csv', index=False)

    logging.debug("Debug:: app/verify.py/verify(): executing price_track.py")
    price_track()
    logging.debug("Debug:: app/verify.py/verify(): executing charts.py")
    make_charts()
    logging.debug("Debug:: app/verify.py/verify(): price_track.py and charts.py executed")
    return "Completed"
