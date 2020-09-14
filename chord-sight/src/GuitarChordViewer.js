import { Chord } from "@tonaljs/tonal";
import { ChordBox } from 'vexchords';
import NoteManager from './NoteManager';
import React from 'react';
import chordData from './chord_data.json';

export default class GuitarChordViewer extends React.Component {


	componentDidMount() {
		this.setUpChordBox();

		//NoteManager.listenForChordChange((newChord) => { this.renderChord(newChord) });
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

	renderChord(chord) {
		let existingChord = document.querySelector('#chordbox');
		existingChord.innerHTML = '';
		this.setUpChordBox();


		let chordInfo = Chord.get(chord);

		if (!chordInfo) {
			return;
		}

		let symbol = chordInfo.symbol;


		let fingeringInfo = chordData[symbol];

		if (!fingeringInfo || fingeringInfo.size === 0) {
			return;
		}

 
		let chordFingers = fingeringInfo[0].fingers.map((fret, i) => {
			return [6-i, fret];
		});



		console.log(chordFingers);
		
		this.chordbox.draw({
			// array of [string, fret, label (optional)]
			chord: chordFingers,
		  
			// optional: tuning keys
			tuning: ['E', 'A', 'D', 'G', 'B', 'E']
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