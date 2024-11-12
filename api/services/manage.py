import json
import pandas as pd
import os

def _delete(item_name, _, items, _type):
    try:
        del items[item_name]
        with open(f'data/{_type}.json', 'w') as file:
            json.dump(items, file, indent=4)
        if _type == "items":
            try:
                price_track = pd.read_csv('data/price_track.csv')
                price_track = price_track.drop(columns=[item_name])
                price_track.to_csv('data/price_track.csv', index=False)
            except Exception:
                pass
            try:
                if os.path.exists(f'./static/charts/{item_name}.png'):
                    os.remove(f'./static/charts/{item_name}.png')
            except Exception:
                pass
        return {'success': 'Item deleted'}
    except KeyError:
        return {'error': 'Item not found, nothing was deleted.'}


def _update(item_name, new_item, items, _type):
    try:
        for new_name in new_item:
            if new_name in items:
                if items[new_name] == new_item[new_name]:
                    return {'error': 'Updated item name already exists, nothing was updated.'}

            updated_item = new_item[new_name]
            orig_item = items[item_name]
            # if the base prices is different, re-calculate the target price
            if _type == "item":
                if updated_item['base_price'] != orig_item['base_price'] or updated_item['target_discount_percentage'] != orig_item['target_discount_percentage']:
                    updated_item['target_price'] = updated_item['base_price'] * (1 - updated_item['target_discount_percentage'] / 100)
                # clean input fields
                if updated_item['bought'] == 'true':
                    updated_item['bought'] = True
                elif updated_item['bought'] == 'false':
                    updated_item['bought'] = False
            if updated_item['subcategories'] != [] and type(updated_item['subcategories']) == str:
                updated_item['subcategories'] = updated_item['subcategories'].split(',')
            # add the new item to the items dict
            del items[item_name]
            items[updated_item['name']] = updated_item
            if _type == "items":
                try:
                    # pd load price_track and rename the column item_name to updated_item['name']
                    price_track = pd.read_csv('data/price_track.csv')
                    price_track = price_track.rename(columns={item_name: updated_item['name']})
                    price_track.to_csv('data/price_track.csv', index=False)
                except Exception:
                    pass
                try:
                    if os.path.exists(f'./static/charts/{item_name}.png'):
                    # rename the chart ./static/charts/{item_name}.png to ./static/charts/{updated_item['name']}.png
                        os.rename(f'./static/charts/{item_name}.png', f'./static/charts/{updated_item["name"]}.png')
                except Exception:
                    pass
        with open(f'data/{_type}.json', 'w') as file:
            json.dump(items, file, indent=4)
        return {'success': 'Item updated.'}
    except KeyError:
        return {'error': 'Item not found, nothing was updated.'}


def _create(item_name, new_item, items, _type):
    try:
        if item_name in items:
            return {'error': 'Item already exists, nothing was added.'}

        # calculate target_price for new_item
        if _type == "item":
            new_item['target_price'] = new_item['base_price'] * (1 - new_item['target_discount_percentage'] / 100)

        if new_item['subcategories'] != [] and type(new_item['subcategories']) == str:
            new_item['subcategories'] = new_item['subcategories'].split(',')
        items[item_name] = new_item

        with open(f'data/{_type}.json', 'w') as file:
            json.dump(items, file, indent=4)
        if _type == "items":
            try:
                # add an empty column to the price_track.csv
                price_track = pd.read_csv('data/price_track.csv')
                price_track[item_name] = new_item['base_price']  # fill column with base price for consistent charting
                price_track.to_csv('data/price_track.csv', index=False)
            except Exception:
                pass
        # add an empty column to the price_track.csv
        return {'success': 'Item added.'}
    except Exception:
        return {'error': 'Unable to add new item.'}


def manage_content(item_name, new_item, operation, _type):
    if not operation or not _type:
        return {'error': 'Operation or type not specified'}

    try:
        with open(f'data/{_type}.json', 'r') as file:
            items = json.load(file)
    except FileNotFoundError:
        return {'error': f'File for {_type} not found'}
    except json.JSONDecodeError:
        return {'error': 'Error reading JSON data'}

    # Define operation functions
    operations = {
        'delete': _delete,
        'update': _update,
        'create': _create
    }

    # Execute the corresponding function if operation is valid
    try:
        return operations[operation](item_name, new_item, items, _type)
    except KeyError:
        return {'error': 'Invalid operation'}


"""
The following are commented out tests
"""
# upd = {
#     "DDF484FZB": {
#         "name": "DDF484YEET",
#         "description": "18V LXT Brushless 2-Speed Drill Driver",
#         "target_price": 225,
#         "target_discount_percentage": 20,
#         "base_price": 281.25,
#         "brand": "Makita",
#         "main_category": "Tools",
#         "subcategories": [],
#         "bought": False,
#         "search_term": "DDF484",
#     }
# }

# nw = {
#     "name": "DDF484YEET",
#     "description": "18V LXT Brushless 2-Speed Drill Driver",
#     "target_price": 30,
#     "target_discount_percentage": 20,
#     "base_price": 281.25,
#     "brand": "yes",
#     "main_category": "a",
#     "subcategories": [],
#     "bought": False,
#     "search_term": "new",
# }

# Test delete
# print(manage_content("DDF484RTJ", None, 'delete', 'items'))

# Test update
# print(manage_content("DDF484RTJ", upd, 'update', 'items'))

# Test add
# print(manage_content("new", nw, 'create', 'items'))

# upd_w = {"masteryeets": {
#     "selectors": {
#         "product_container": ".twn-starter__products-item",
#         "url": "a.twn-product-tile",
#         "title": ".twn-product-tile__title a",
#         "price": ".twn-product-tile__price"
#     },
#     "res": [],
#     "query_url": "https://qeqeqe.nl/?q=INPUT#twn|?tn_q=INPUT",
#     "main_category": "a",
#     "subcategories": ["b"]
# }}

# Test update webshop
# print(manage_content("mastertools", upd_w, 'update', 'webshops'))
