#!/usr/bin/env python3
# Converts the Bazaar CSV copied from https://ffxii.us/bazaar into a JSON file
import csv
import json


def convert():
    data = []
    with open('bazaar.csv') as f:
        reader = csv.reader(f)
        id = 1
        for row in reader:
            package, price, loot, reward = row
            loot = split_items(loot)
            reward = split_items(reward)
            data.append({
                'id': id,
                'package': package,
                'price': price,
                'loot': loot,
                'reward': reward
            })
            id += 1
    with open('bazaar.json', 'w') as f:
        json.dump(data, f, indent=2)


def split_items(raw):
    rows = raw.split('\n')
    pairs = [row.split(' x') for row in rows]
    items = [{
        'name': p[0],
        'quantity': int(p[1]) if len(p) > 1 else 1
    } for p in pairs]
    return items


if __name__ == "__main__":
    convert()
