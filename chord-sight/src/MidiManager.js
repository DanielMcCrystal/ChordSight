import NoteManager from "./NoteManager";

export default class MidiManager {

	static listeners = [];

	static setUpMidi() {
		navigator.requestMIDIAccess().then(MidiManager.onMidiSucess, MidiManager.onMidiFail);

		MidiManager.listenForMidiEvents((event) => NoteManager.onMidiEvent(event));
	}

	static onMidiSucess(midiAcess) {
		console.log(midiAcess);

		let inputs = midiAcess.inputs;

		if (inputs) {
			for (let input of inputs.values()) {
				input.onmidimessage = MidiManager.midiEventOccurred;
			}
		}
	}

	static onMidiFail() {
		console.log("Failed to connect MIDI");
	}

	static listenForMidiEvents(callback) {
		MidiManager.listeners.push(callback);
	}

	static midiEventOccurred(event) {
		MidiManager.listeners.forEach(callback => callback(event.data));
	}
	
	static checkMidiAccess() {
		console.log('Checking MIDI Access');
		console.log(navigator);
		if (navigator.requestMIDIAccess) {
			console.log('This browser supports WebMIDI!');
			return true;
		} else {
			console.log('WebMIDI is not supported in this browser.');
			return false;
		}
	}

}
