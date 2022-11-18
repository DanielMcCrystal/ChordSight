import { Chord } from "@tonaljs/tonal";
import { ChordBox } from 'vexchords';
import NoteManager from './NoteManager';
import React from 'react';
import chordData from './chord_data.json';

export default class GuitarChordViewer extends React.Component {


	componentDidMount() {
		this.setUpChordBox();

		NoteManager.listenForChordChange((newChord) => { this.renderChord(newChord) });
	}

	setUpChordBox() {
		this.chordbox = new ChordBox('#chordbox', {

			width: 140, // canvas width
			height: 220, // canvas height
			circleRadius: 5, // circle radius (width / 20 by default)

			numStrings: 6, // number of strings (e.g., 4 for bass)
			numFrets: 5, // number of frets (e.g., 7 for stretch chords)
			showTuning: true, // show tuning keys

			defaultColor: '#666', // default color
			bgColor: '#FFF', // background color
			strokeColor: '#666', // stroke color (overrides defaultColor)
			textColor: '#666', // text color (overrides defaultColor)
			stringColor: '#666', // string color (overrides defaultColor)
			fretColor: '#666', // fret color (overrides defaultColor)
			labelColor: '#666', // label color (overrides defaultColor)

			fretWidth: 1, // fret width
			stringWidth: 1, // string width

		});
		this.renderBlankChord();
	}

	renderBlankChord() {
		this.chordbox.draw({
			chord: [],
			tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
		})
	}

	calculateBarres(fingers, frets) {

		let barres = [];
		let consideredFingers = new Set();

		for (let i = 0; i<6; i++) {
			let finger = fingers[i];
			if (consideredFingers.has(finger) || frets[i] === '0' || frets[i] === 'x') {
				continue;
			}
			let fromString = 6-i;
			let toString = fromString;

			for (let j = i+1; j<6; j++) {
				if (fingers[j] === finger) {
					toString = 6 - j;
				}
			}

			if (toString !== fromString) {
				barres.push({
					fromString: fromString,
					toString: toString,
					fret: parseInt(frets[i]),
				});

				consideredFingers.add(finger);
			}
		}

		return barres;
	}

	renderChord(chord_) {
		let existingChord = document.querySelector('#chordbox');
		existingChord.innerHTML = '';
		this.setUpChordBox();


		let chordInfo = Chord.get(chord_);

		if (!chordInfo) {
			return;
		}

		let symbol = chordInfo.symbol;


		let fingeringInfo = chordData[symbol];

		if (!fingeringInfo || fingeringInfo.size === 0) {
			return;
		}

		let frets = Array.from(fingeringInfo[0].frets);
		let lowestFret = -1;
		for (let i = 0; i<6; i++) {
			if (frets[i] === 'x' || frets[i] === '0') {
				continue;
			}

			let fretNum = parseInt(frets[i]);
			if (fretNum < lowestFret) {
				lowestFret = fretNum;
			}
		}

		let positionOffset = 0;
		if (lowestFret >= 3) {
			positionOffset = lowestFret - 1;
		}

 
		let chord = fingeringInfo[0].frets.map((fret, i) => {
			return [6-i, fret, parseInt(fingeringInfo[0].fingers[i])];
		});

		
		this.chordbox.draw({
			// array of [string, fret, label (optional)]
			chord: chord,
		  
			// optional: tuning keys
			tuning: ['E', 'A', 'D', 'G', 'B', 'E'],

			barres: this.calculateBarres(fingeringInfo[0].fingers, fingeringInfo[0].frets),

			position: positionOffset,
		  });
	}


	render() {

		return (
			<div style={{height: 250, width: 1200, display: "flex", justifyContent: "center", alignItems: "stretch"}}>
				<div style={{backgroundColor: "darkslategray", borderRadius: 20, flexGrow: 1, display: "flex", alignItems: "center", justifyContent: 'center'}}>
					<div id="chordbox" style={{backgroundColor: 'whitesmoke', borderRadius: 20}}>

					</div>
				</div>
			</div>
		);
	}
}