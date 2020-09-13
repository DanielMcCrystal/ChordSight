import { Chord } from "@tonaljs/tonal";
import NoteManager from './NoteManager';
import React from 'react';

export default class ChordViewer extends React.Component {

	state = {
		currentChord: null,
		currentChordInfo: null,
	}

	componentDidMount() {
		NoteManager.listenForChordChange((newChord) => {this.setState({currentChord: newChord ,currentChordInfo: Chord.get(newChord)})})
	}

	getCurrentChordColors() {
		if (!this.state.currentChord) {
			return ["hsl(0, 0%, 40%", "hsl(0, 0%, 60%"]
		}

		let tonic = this.state.currentChordInfo.tonic;
		let hue = Math.floor(((NoteManager.NOTE_NAMES.indexOf(tonic)) / 12) * 360)
		return [`hsl(${hue}, 60%, 40%)`, `hsl(${hue}, 40%, 60%)`];
	}

	render() {
		let chordColors = this.getCurrentChordColors();
		let symbol = this.state.currentChordInfo ? this.state.currentChordInfo.symbol : '';
		let type = this.state.currentChordInfo ? this.state.currentChordInfo.type : '';

		if (symbol === '') {
			symbol = '?';
		}
		return (
			<div style={{height: 400, width: 800, display: "flex", justifyContent: "center", alignItems: "stretch"}}>
				<div style={{backgroundColor: chordColors[0], borderRadius: 20, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch"}}>
					<div style={{height: 270, margin: 10, backgroundColor: chordColors[1], borderRadius: 10, display: "flex", justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 200}}>
						{symbol}
					</div>
					<div style={{height: 120, margin: 10, backgroundColor: chordColors[1], borderRadius: 10, display: "flex", justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 70}}>
						{type}
					</div>
				</div>
			</div>
		);
	}
}