import csv
import json

chord_data = {}

with open('chord-fingers.csv', 'r') as csv_file:
	reader = csv.reader(csv_file, delimiter=';')
	next(reader)

	for row in reader:

		root, chord_type, structure, fingers, notes = row

		if chord_type == 'maj':
			chord_type = 'M'

		symbol = root + chord_type

		if symbol not in chord_data:
			chord_data[symbol] = []


		chord_info = {
			'structure': structure.split(';'),
			'fingers': fingers.split(','),
			'notes': notes.split(','),
		}
		chord_data[symbol].append(chord_info)

with open('chord_data.json', 'w+') as json_file:

	json.dump(chord_data, json_file)

