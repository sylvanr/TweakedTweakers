import datetime
import logging

import pandas as pd


def price_track(compared_file='static/out/compared.csv', track_file='data/price_track.csv'):
    """
    Updates the price tracking file with the lowest prices found in the `compared.csv` file for each unique item.

    :param compared_file: Path to the CSV file with compared prices
    :param track_file: Path to the CSV file to track historical prices
    """
    logging.debug("Debug:: price_track.py/price_track: Updating data/price_track.csv...")

    # Load `compared.csv` and ensure the price column is numeric
    compared_df = pd.read_csv(compared_file)
    compared_df['price'] = pd.to_numeric(compared_df['price'].str.replace(',', '.'), errors='coerce')

    # Group by 'compared to' column and find the minimum price for each group
    lowest_prices = compared_df.groupby('compared to')['price'].min()

    # Load `price_track.csv`
    price_track_df = pd.read_csv(track_file)

    # Create a new row with today's date and lowest prices, matched by column headers
    today_date = datetime.datetime.now().strftime('%d-%m-%Y')
    # dict last known price for each item
    last_known_prices = price_track_df.iloc[-1].to_dict()
    new_row = {
        'date': today_date,
        **{col: lowest_prices.get(col, last_known_prices[col]) for col in price_track_df.columns[1:]}
    }

    # Remove any existing row with today's date to avoid duplicates
    price_track_df = price_track_df[price_track_df['date'] != today_date]

    # Append the new row to the DataFrame
    price_track_df = pd.concat([price_track_df, pd.DataFrame([new_row])], ignore_index=True)

    # Save the updated DataFrame back to `price_track.csv`
    price_track_df.to_csv(track_file, index=False)
    logging.debug("Debug:: price_track.py/price_track: data/price_track.csv Updated with most recent data")


if __name__ == "__main__":
    price_track()
