import logging

import pandas as pd


def get_results():
    """
    Load and process the 'compared.csv' file, optionally applying a filter for the 'buy' column.
    Returns the grouped data based on 'compared to' and sorted by price.
    """
    logging.debug("Debug:: app/services/results.py/get_results(): Getting results from compared.csv")
    df = pd.read_csv("static/out/compared.csv")
    if df['price'].dtype == 'object':
        df['price'] = df['price'].str.replace(',', '.')
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        df['price'].dropna(inplace=True)
    if df['compared price'].dtype == 'object':
        df['compared price'] = pd.to_numeric(df['compared price'], errors='coerce')
    df['original price'] = df['compared price'] / 0.8
    df['discount (%)'] = (((df['original price'] - df['price']) / df['original price']) * 100).round().astype(int)

    # remove original price column
    df.drop('original price', axis=1, inplace=True)

    grouped_df = df.sort_values('price').groupby('compared to')
    res = {name: group.to_dict(orient='records') for name, group in grouped_df}
    # Return the data grouped by 'compared to'
    return res
