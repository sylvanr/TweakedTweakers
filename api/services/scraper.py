import copy
import json
import logging
import os
import re
from concurrent.futures import ProcessPoolExecutor, as_completed

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

SCRAPE_N_RESULTS = 20


# Create a headless driver configuration
def _create_driver(name):
    options = Options()
    # Connect to docker selenium hub, or localhost for local development
    hub_url = "http://selenium:4444" if os.getenv("DOCKER", "False") == "True" else "http://localhost:4444"

    # Add options specific to Docker environments
    options.add_argument('--no-sandbox')  # Needed in some environments, e.g., Docker
    options.add_argument('--disable-dev-shm-usage')  # Bypass /dev/shm memory limit issues
    options.add_argument('--disable-gpu')  # Disable GPU acceleration
    options.add_argument('--window-size=1920x1080')  # Set a default window size

    # Only apply headless mode for specific site names
    if name not in ["hbm-machines", "installand", "bol", "klium", "coolblue", "ijzerhuis", "thstools", "toolmax"]:
        options.add_argument('--headless')

    wd = webdriver.Remote(command_executor=hub_url, options=options) if os.getenv("DOCKER", "False") == "True" else webdriver.Chrome(options=options)  # NOQA: E501
    return wd


def _scrape_website(url, name, selectors, res, items):
    driver = _create_driver(name)
    res_f = []
    try:
        input_values = _get_input_values(name, items)
        for input_value in input_values:
            logging.debug(f"Debug:: app/services/scraper.py/_scrape_website(): Scraping webshop '{name}' with input '{input_value}'...")  # NOQA: E501
            rendered_url = url.replace("INPUT", input_value)
            try:
                driver.get(rendered_url)
                res_f = scrape_products(driver, name, selectors[name], res)
            except Exception as e:
                logging.error(f"Error:: app/services/scraper.py/_scrape_website(): An error occurred while scraping {name}: {e}")  # NOQA: E501
    finally:
        driver.quit()
    return name, res_f


def _get_input_values(name, items):
    """
    Get the input values, which are the names of all the items in data/items.json
    """
    input_values = []
    with open("data/items.json", "r") as file:
        data = json.load(file)
        input_values = []
        for item in data:
            # skip item if it is not explicitly mentioned while others are mentioned
            if items != [] and item not in items:
                continue
            if name in ["bol", "rotopino"]:
                # look for complete names like DDF484RTJ, as they don't show up under DDF484.
                input_values.append(item)
                continue

            search_term = data[item].get("search_term", item)
            if search_term not in input_values:
                input_values.append(search_term)
    return input_values


def _get_webshops(webshops):
    """
    Get the webshop values, which are the names of all the items in data/webshops.json
    """
    with open("data/webshops.json", "r") as file:
        data = json.load(file)

    # Filter out webshops that are not in the list and create the necessary dictionaries
    filtered_data = {name: item for name, item in data.items() if name in webshops or webshops == []}
    webshop_names = list(filtered_data.keys())
    webshop_urls = [item["query_url"] for item in filtered_data.values()]
    webshop_selectors = {name: item["selectors"] for name, item in filtered_data.items()}
    base_res = {name: [] for name in webshop_names}

    return webshop_names, webshop_urls, webshop_selectors, base_res


def scrape(items, webshops):
    """
    Scrapes all webshops based on selectors provided.

    :param test: Specify which webshop to test, set to None to run all
    :return: res
    """
    logging.debug(f"Debug:: app/services/scraper.py/scrape(): Scraping webshops:\n\titems={items}\n\twebshops={webshops}")  # NOQA: E501
    webshop_names, webshop_urls, webshop_selectors, base_res = _get_webshops(webshops)
    res = copy.deepcopy(base_res)

    # Prepare a list of tasks to be executed in parallel
    tasks = []

    # Prepare tasks for each webshop to scrape
    for url, name in zip(webshop_urls, webshop_names):
        if webshops != [] and name not in webshops:
            # skip webshop if it is not explicitly mentioned while others are mentioned
            continue
        tasks.append((url, name, webshop_selectors, res, items))

    # Use ProcessPoolExecutor to manage multiple Selenium processes
    with ProcessPoolExecutor(max_workers=8) as executor:
        futures = []
        for task in tasks:
            futures.append(executor.submit(_scrape_website, *task))

        # Wait for all tasks to complete
        for future in as_completed(futures):
            try:
                name, res_f = future.result()  # Retrieve the result or catch exceptions if needed
                res[name] = res_f
            except Exception as e:
                logging.error(f"Error:: app/services/scraper.py/scrape(): Error in scraping task: {e}")
    # Save results to file after all tasks complete
    with open("./static/out/scraper.json", "w") as outfile:
        json.dump(res, outfile, indent=2)


def scrape_products(driver, name, selectors, res):
    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selectors["product_container"]))
        )
    except Exception:
        logging.error(f"Error:: app/services/scraper.py/scrape_products(): Could not find product container for {name}")
        return res[name]

    page_source = driver.page_source
    # custom for HBM
    if name == "hbm-machines":
        try:
            products = re.findall(r'"item_display_name":"(.*?)".*?"price":(.*?),"from_price":.*?"url_to_product":"(.*?)"', page_source)  # NOQA: 501

            seen_products = set()
            for display_name, price, product_url in products:
                price = price.strip().replace('.', ',')
                product_url = product_url.strip().replace('\\', '')
                display_name = display_name.strip().replace('\n', ' ')
                product_key = (display_name, product_url)

                if product_key not in seen_products:
                    seen_products.add(product_key)
                    res[name].append({
                        "url": product_url,
                        "title": display_name,
                        "price": price
                    })
            return res[name]
        except Exception as e:
            logging.error(f"Error:: app/services/scraper.py/scrape_products(): Could not retrieve title or price for HBM, {e}")  # NOQA: E501
            return res[name]

    try:
        # Generic access
        products = driver.find_elements(By.CSS_SELECTOR, selectors["product_container"])
        i = 0
        for product in products:
            try:
                url_element = product.find_element(By.CSS_SELECTOR, selectors["url"])
                product_url = url_element.get_attribute("href")
                title_element = product.find_element(By.CSS_SELECTOR, selectors["title"])
                title = title_element.text
                price_element = product.find_element(By.CSS_SELECTOR, selectors["price"])
                price = price_element.text
                if price == "":
                    continue
                if name == "bol":
                    price = price.replace("\n", ",")

                price = price.replace("\u20ac", "")
                price = price.replace(",-", ",00")
                price = price.replace("\n", " ")
                price = price.replace(" ", "")
                price = price.replace(",,", ",")
                price = re.sub(r'[^\d,]', '', price)

                title = title.replace("\n", " ")
                if price.endswith(","):
                    price += "00"

                res_obj = {
                    "url": product_url,
                    "title": title,
                    "price": price
                }
                if res_obj not in res[name]:
                    res[name].append(res_obj)

                i += 1
                if i > SCRAPE_N_RESULTS:
                    break
            except Exception as e:
                logging.error(f"Error:: app/services/scraper.py/scrape_products(): Could not retrieve title or price.")  # NOQA: E501
    except Exception as e:
        logging.error(f"Error:: app/services/scraper.py/scrape_products(): Could not retrieve products for {name}: {e}")
    return res[name]


if __name__ == "__main__":
    scrape(items=["DDF484"], webshops=["Mastertools"])
