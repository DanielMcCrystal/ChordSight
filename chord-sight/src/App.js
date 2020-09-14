import './App.css';

import ChordViewer from './ChordViewer';
import GuitarChordViewer from './GuitarChordViewer';
import Keyboard from './Keyboard';
import React from 'react';

function App() {
	return (
		<div className="App">
			<div className="main">
				<div className="keyboardContainer">
					<Keyboard />
				</div>
				<div className="chordViewerContainer">
					<ChordViewer />
				</div>
				<div className="guitarChordViewerContainer">
					<GuitarChordViewer />
				</div>
			</div>
		</div>
	);
}

export default App;
