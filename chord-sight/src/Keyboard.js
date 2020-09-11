import React from 'react';

export default class Keyboard extends React.Component {

	NUM_KEYS = 84;

	WHITE_KEY_WIDTH = 28;
	WHITE_KEY_HEIGHT = 115;

	BLACK_KEY_WIDTH = 18;
	BLACK_KEY_HEIGHT = 78;
	
	WHITE_KEY_PATTERN = [true, false, true, false, true, true, false, true, false, true, false, true];

	keyRefs = [];

	constructor(props) {
		super(props);
		for (let i=0; i<this.NUM_KEYS; i++) {
			this.keyRefs.push(React.createRef());
		}
	}

	getWhiteKey(index) {
		return <div 
			style={{
				height: this.WHITE_KEY_HEIGHT,
				width: this.WHITE_KEY_WIDTH,
				outline: '1px solid black',
				borderRadius: '2px',
				backgroundColor: 'whitesmoke'
			}} 
			key={index}
			ref={this.keyRefs[index]}
		/>;
	}

	getBlackKey(index, numKeysOffset) {

		let pxOffset = (numKeysOffset * this.WHITE_KEY_WIDTH) - (this.BLACK_KEY_WIDTH / 2);

		return <div 
			style={{
				height: this.BLACK_KEY_HEIGHT, 
				width: this.BLACK_KEY_WIDTH, 

				position: 'absolute',
				left: pxOffset,

				borderRadius: '2px', 
				backgroundColor: 'black', 
			}}
			key={index}
			ref={this.keyRefs[index]}
		/>
	}

	getKeyArray() {
		let keys = [];
		let numWhiteKeys = 0;
		
		for (let i=0; i<this.NUM_KEYS; i++) {
			let key;
			if (this.WHITE_KEY_PATTERN[i % 12]) {
				key = this.getWhiteKey(i);
				numWhiteKeys++;
			} else {
				key = this.getBlackKey(i, numWhiteKeys);
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