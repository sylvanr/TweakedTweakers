import logging
import os
from multiprocessing import Pool

import matplotlib
import matplotlib.pyplot as plt
import pandas as pd

# Set non-GUI backend for multiprocessing
matplotlib.use('Agg')


def _plot_column(data, column):
    """Function to plot product price trends and save the plot as a PNG in dark mode."""
    logging.debug(f"Debug:: charts.py/_plot_column(): Making a chart for column {column}...")

    # Set up dark mode colors
    background_color = '#181a1b'
    text_color = '#ffffff'
    grid_color = '#444444'
    line_color = 'b'

    plt.figure(figsize=(10, 6), facecolor=background_color)
    ax = plt.gca()
    ax.set_facecolor(background_color)

    # Plot the product price over time, skipping the first row as before
    last_value = data[column].iloc[-1]
    pt_label = f'Price Trend current price at date (current: {last_value:.2f})'
    plt.plot(data[data.columns[0]][1:], data[column][1:], marker='o', label=pt_label, color=line_color)

    # Add yellow dotted line at the first row's value
    first_value = data[column].iloc[0]
    plt.axhline(y=first_value, color='y', linestyle='--', label=f'Target Price: {first_value:.2f}')

    # Add a red dotted line for the highest value
    highest_value = data[column][1:].max()
    plt.axhline(y=highest_value, color='r', linestyle='--', label=f'Highest Price: {highest_value:.2f}')

    # Add a green dotted line for the lowest value
    lowest_value = data[column][1:].min()
    plt.axhline(y=lowest_value, color='g', linestyle='--', label=f'Lowest Price: {lowest_value:.2f}')

    # Set title and labels with text color for dark mode
    plt.title(f'{column} Price Trend', fontsize=14, color=text_color)
    plt.xlabel('Date', fontsize=12, color=text_color)
    plt.ylabel('Price', fontsize=12, color=text_color)

    # Update x-tick and y-tick parameters for dark mode
    plt.xticks(color=text_color, rotation=45)
    plt.yticks(color=text_color)

    # Apply grid lines with a darker color for contrast
    plt.grid(True, linestyle='--', color=grid_color, alpha=0.7)
    plt.tight_layout()

    # Set y-axis limits to start at 0
    plt.ylim(bottom=0)

    # Add legend with a background color to improve contrast
    legend = plt.legend(loc='upper left', fontsize=10)
    legend.get_frame().set_facecolor(background_color)
    legend.get_frame().set_edgecolor(grid_color)
    for text in legend.get_texts():
        text.set_color(text_color)

    # Save the chart as a PNG file
    plt.savefig(f'./static/charts/{column}.png', facecolor=background_color)
    plt.close()


def make_charts():
    """Main function to generate price trend charts in dark mode."""
    # Load the data
    logging.debug("Debug:: charts.py/make_charts(): Making all charts in dark mode...")
    data = pd.read_csv('data/price_track.csv')

    # Ensure the output directory exists
    os.makedirs('./static/charts', exist_ok=True)

    # Remove any existing files in the charts directory
    for file in os.listdir('./static/charts'):
        os.remove(f'./static/charts/{file}')

    # Convert date column to datetime for better formatting
    data[data.columns[0]] = pd.to_datetime(data[data.columns[0]], format='%d-%m-%Y')

    # Create a pool of workers to parallelize the plotting process
    with Pool() as pool:
        pool.starmap(_plot_column, [(data, column) for column in data.columns[1:]])

    logging.debug("Debug:: charts.py/make_charts(): All charts created successfully.")


if __name__ == "__main__":
    make_charts()
