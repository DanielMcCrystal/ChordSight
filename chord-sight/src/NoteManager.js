import { detect } from "@tonaljs/chord-detect";

export default class NoteManager {

	static NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	static activeNotes = new Set();
	static lastChord = null;
	static currentChord = null;

	static onChordChangeCallbacks = [];

	static currentNoteDisabledTimeout = null;
	static noteDisabledBuffer = 200;

	static listenForChordChange(callback) {
		NoteManager.onChordChangeCallbacks.push(callback);
	}

	static onMidiEvent(event) {
		let [eventType, noteIndex] = event;

		if (eventType === 144) { // note on
			NoteManager.enableNote(noteIndex);
		} else if (eventType === 128) { // note off
			NoteManager.disableNote(noteIndex);
		}
	}

	static enableNote(noteIndex) {
		NoteManager.activeNotes.add(noteIndex);
		NoteManager.calculateChord();
	}

	static disableNote(noteIndex) {
		NoteManager.activeNotes.delete(noteIndex);
		if (NoteManager.noteDisabledBuffer) {
			clearTimeout(NoteManager.noteDisabledBuffer);
		}
		NoteManager.currentNoteDisabledTimeout = setTimeout(() => NoteManager.calculateChord(), NoteManager.noteDisabledBuffer);
	}

	static getNoteName(noteIndex) {
		return NoteManager.NOTE_NAMES[noteIndex % 12];
	}

	static getNoteHue(noteName) {
		let noteIndex = NoteManager.NOTE_NAMES.findIndex(noteName);
		let hue = Math.floor(((noteIndex % 12) / 12) * 360)

		return hue;
	}

	static calculateChord() {
		let uniqueNotes = new Set(Array.from(NoteManager.activeNotes.values()).map((noteIndex) => NoteManager.getNoteName(noteIndex)));
		
		if (uniqueNotes.size < 3) {
			NoteManager.currentChord = null;
			return;
		}

		let newChord = detect(Array.from(uniqueNotes))[0];
		if (newChord !== NoteManager.currentChord) {
			NoteManager.lastChord = NoteManager.currentChord;
			NoteManager.currentChord = newChord;

			NoteManager.onChordChangeCallbacks.forEach((callback) => callback(newChord))
		}	
	}
}