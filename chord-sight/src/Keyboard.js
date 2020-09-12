import MidiManager from './MidiManager';
import React from 'react';

const NUM_KEYS = 84;

const WHITE_KEY_WIDTH = 28;
const WHITE_KEY_HEIGHT = 115;

const BLACK_KEY_WIDTH = 18;
const BLACK_KEY_HEIGHT = 78;

const WHITE_KEY_PATTERN = [true, false, true, false, true, true, false, true, false, true, false, true];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const KEY_SATURATION_RANGE = [20, 80];
const KEY_LIGHTNESS_RANGE = [20, 80]

class KeyboardKey extends React.Component {

	state = {
		keyActive: false,
		velocity: 0,
	}

	constructor(props) {
		super(props);

		this.keyColor = this.getKeyColor();
	}

	enableKey(velocity) {
		this.setState({keyActive: true, velocity: velocity});
	}

	disableKey() {
		this.setState({keyActive: false});
	}

	getKeyColor(velocity) {
		let hue = Math.floor(((this.props.index % 12) / 12) * 360)

		let velocityMultiplier = velocity / 127;
		let lightness = Math.floor(KEY_LIGHTNESS_RANGE[1] - (velocityMultiplier * (KEY_LIGHTNESS_RANGE[1] - KEY_LIGHTNESS_RANGE[0])));
		let saturation = Math.floor(KEY_SATURATION_RANGE[0] + (velocityMultiplier * (KEY_SATURATION_RANGE[1] - KEY_SATURATION_RANGE[0])));

		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}

	getWhiteKeyStyle() {
		return {
			height: WHITE_KEY_HEIGHT,
			width: WHITE_KEY_WIDTH,
			outline: '1px solid black',
			borderRadius: '2px',

			backgroundColor: this.state.keyActive ? this.getKeyColor(this.state.velocity) : 'whitesmoke',

			display: 'flex',
			justifyContent: 'center',
		};
	}

	getBlackKeyStyle(numKeysOffset) {

		let pxOffset = (numKeysOffset * WHITE_KEY_WIDTH) - (BLACK_KEY_WIDTH / 2);

		return {
			height: BLACK_KEY_HEIGHT, 
			width: BLACK_KEY_WIDTH, 

			position: 'absolute',
			left: pxOffset,

			borderRadius: '2px', 

			outline: '1px solid black',
			backgroundColor: this.state.keyActive ? this.getKeyColor(this.state.velocity) : 'black',

			display: 'flex',
			justifyContent: 'center',
		}
	}

	render() {
		return <div style={this.props.white ? this.getWhiteKeyStyle() : this.getBlackKeyStyle(this.props.numKeysOffset)} onClick={() => this.toggleKey()}>
			
			<div 
				style={{
					alignSelf: 'flex-end', 
					marginBottom: '8px', 
					width: '15px', 
					height: '15px', 
					borderRadius: '15px', 
					backgroundColor: 'white', 
					fontSize: 10, 
					display: this.state.keyActive ? 'flex' : 'none',
					justifyContent: 'center', 
					alignItems: 'center',
				}}
			>
				{NOTE_NAMES[this.props.index % 12]}
			</div>
		</div>
	}
}

export default class Keyboard extends React.Component {

	
	keyRefs = [];

	constructor(props) {
		super(props);
		for (let i=0; i<NUM_KEYS; i++) {
			this.keyRefs.push(React.createRef());
		}

	}

	componentDidMount() {
		MidiManager.setUpMidi();
		MidiManager.listenForMidiEvents((event) => this.onMidiEvent(event));
	}

	onMidiEvent(event) {
		let [eventType, noteIndex, velocity] = event;
		console.log(eventType);

		if (eventType === 144) { // note on
			console.log(event)
			if (noteIndex >= 24 && noteIndex < NUM_KEYS + 24) {
				this.keyRefs[noteIndex - 24].current.enableKey(velocity);
			} else {
				console.log(`Note out of range: ${noteIndex}`);
			}
		} else if (eventType === 128) { // note off
			if (noteIndex >= 24 && noteIndex < NUM_KEYS + 24) {
				this.keyRefs[noteIndex - 24].current.disableKey();
			} else {
				console.log(`Note out of range: ${noteIndex}`);
			}
		} else {
			console.log("Unhandled MIDI operation")
		}
	}

	

	getKeyArray() {
		let keys = [];
		let numWhiteKeys = 0;
		
		for (let i=0; i<NUM_KEYS; i++) {
			let key;
			if (WHITE_KEY_PATTERN[i % 12]) {
				key = <KeyboardKey 
					index={i+24} 
					white 
					key={i}
					ref={this.keyRefs[i]}
				/>
				numWhiteKeys++;
			} else {
				key = <KeyboardKey 
					index={i+24} 
					white={false} 
					numKeysOffset={numWhiteKeys}

					key={i}
					ref={this.keyRefs[i]}
				/>
			}
			
			keys.push(key);
		}

		return keys;
	}

	render() {
		return (
			<div style={{display: 'flex', position: 'relative'}}>
				{this.getKeyArray()}
			</div>
		);
	}
}