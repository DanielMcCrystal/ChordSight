import csv
import json

chord_data = {}

note_aliases = [
	{
		'A', 'G##', 'Bbb',
	}, {
		'A#', 'Bb', 'Cbb',
	}, {
		'B', 'A##', 'Cb',
	}, {
		'C', 'B#', 'Dbb',
	}, {
		'C#', 'B##', 'Db',
	}, {
		'D', 'C##', 'Ebb',
	}, {
		'D#', 'Eb', 'Fbb',
	}, {
		'E', 'D##', 'Fb',
	}, {
		'F', 'E#', 'Gbb',
	}, {
		'F#', 'E##', 'Gb',
	}, {
		'G', 'F##', 'Abb',
	}, {
		'G#', 'Ab',
	}
]

strings = [7, 0, 5, 10, 2, 7]

def get_note_index(note_name):
	i = 0
	for i in range(len(note_aliases)):
		if note_name in note_aliases[i]:
			return i
	return -1

def get_semitones_offset(string_note_index, target_note):
	#print("Searching for {} offset from [{}] string".format(target_note, note_aliases[string_note_index]))
	offset = 0
	i = string_note_index
	
	while target_note not in note_aliases[i]:
		i = (i + 1) % 12
		offset += 1
		if offset >= 12:
			raise Exception("Target note not found: {}".format(target_note))
	
	#print("Found {} in {} {} semitones higher".format(target_note, note_aliases[i], offset))

	return offset

with open('chord-fingers.csv', 'r') as csv_file:
	reader = csv.reader(csv_file, delimiter=';')
	next(reader)

	for row in reader:

		root, chord_type, structure, fingers, notes = row

		fingers = fingers.split(',')
		notes = notes.split(',')


		finger_index = 0

		frets = []

		for i in range(6):
			if fingers[i] in ['x']:
				frets.append(fingers[i])
			else:
				frets.append(str(get_semitones_offset(strings[i], notes[finger_index])))
				finger_index += 1


		if chord_type == 'maj':
			chord_type = 'M'

		symbol = root + chord_type

		if symbol not in chord_data:
			chord_data[symbol] = []


		chord_info = {
			'structure': structure.split(';'),
			'fingers': fingers,
			'notes': notes,
			'frets': frets,
		}
		chord_data[symbol].append(chord_info)


with open('chord_data.json', 'w+') as json_file:

	json.dump(chord_data, json_file)

