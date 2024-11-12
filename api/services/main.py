import argparse
import logging

from config import confirm_logger
from services.charts import make_charts
from services.compare import compare as service_compare
from services.csvify import convert_to_csv
from services.price_track import price_track as service_price_track
from services.scraper import scrape as service_scrape
from services.scraper_sort import scraper_sort

confirm_logger()


# Argument parser setup
def parse_arguments():
    logging.debug("Debug:: main.py/parse_arguments: Parsing command-line arguments...")
    parser = argparse.ArgumentParser(description='Run the scraping, sorting, comparison, and price tracking.')
    parser.add_argument('--no-scrape', action='store_false', dest='scrape', help='Skip the scraping process')
    parser.add_argument('--no-sort', action='store_false', dest='sort', help='Skip the sorting process')
    parser.add_argument('--no-compare', action='store_false', dest='compare', help='Skip the comparison process')
    parser.add_argument('--no-price-track', action='store_false', dest='price_track', help='Skip the price tracking process')  # NOQA: E501
    parser.add_argument('--quick-test', action='store_true', dest='quick_test', help='Run a quick test, defaulting to `--test mastertools`, testing only DDF484.')  # NOQA: E501
    return parser.parse_args()


def main(
    scrape=True,
    sort=True,
    compare=True,
    price_track=True,
    quick_test=False,
    scrape_items=None,
    scrape_webshops=None
):  # NOQA: E501
    logging.debug("Debug:: main.py/main: Starting main process...")

    if quick_test:
        price_track = False
        scrape_items = ["DDF484ZJ"]
        scrape_webshops = ["mastertools"]
    if scrape:
        service_scrape(scrape_items, scrape_webshops)
    if sort:
        scraper_sort()
    if compare:
        service_compare()
        convert_to_csv("compared")
    if price_track:
        service_price_track()
        make_charts()
    return "Completed"


if __name__ == "__main__":
    """
    Usage Examples:
    - Run all processes:
        python main.py
    - Run with scraping and comparison only:
        python main.py --no-sort --no-price-track
    """
    args = parse_arguments()
    # Execute functions based on the command-line arguments
    main(args.scrape, args.sort, args.compare, args.price_track, args.quick_test)
