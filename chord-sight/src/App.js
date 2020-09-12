import './App.css';

import ChordViewer from './ChordViewer';
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
			</div>
		</div>
	);
}

export default App;
