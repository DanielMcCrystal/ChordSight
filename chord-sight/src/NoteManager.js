import { detect } from "@tonaljs/chord-detect";

export default class NoteManager {

	static NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	static activeNotes = new Set();
	static lastChord = null;
	static currentChord = null;

	static onChordChangeCallbacks = [];

	static currentNoteDisabledTimeout = setTimeout(() => {}, 0);
	static noteDisabledBuffer = 200;

	static currentNoteEnabledTimeout = setTimeout(() => {}, 0);;
	static noteEnabledBufferNoChordLocked = 40;
	static noteEnabledBufferChordLocked = 400;

	static chordLocked = false;
	static chordOrigins = new Set();

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
		clearTimeout(this.currentNoteEnabledTimeout);

		NoteManager.currentNoteEnabledTimeout = setTimeout(
			() => NoteManager.calculateChord(), 
			this.chordLocked ? NoteManager.noteEnabledBufferChordLocked : NoteManager.noteEnabledBufferNoChordLocked
		);
	}

	static disableNote(noteIndex) {
		NoteManager.activeNotes.delete(noteIndex);

		clearTimeout(NoteManager.currentNoteDisabledTimeout);

		if (NoteManager.chordOrigins.has(noteIndex)) {
			NoteManager.chordOrigins.delete(noteIndex);

			if (NoteManager.chordOrigins.size < 2) {
				NoteManager.chordOrigins = new Set();
				NoteManager.chordLocked = false;
				console.log("Chord unlocked");
			}
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

		let sortedNotes = [...NoteManager.activeNotes].sort().map((noteIndex) => NoteManager.getNoteName(noteIndex));

		let newChord = detect(sortedNotes)[0];
		if (newChord !== NoteManager.currentChord) {
			NoteManager.lastChord = NoteManager.currentChord;
			NoteManager.currentChord = newChord;

			if (newChord !== '') {
				NoteManager.chordLocked = true;
				NoteManager.chordOrigins = new Set(NoteManager.activeNotes)
			}
			
			NoteManager.onChordChangeCallbacks.forEach((callback) => callback(newChord))
		}	
	}
}