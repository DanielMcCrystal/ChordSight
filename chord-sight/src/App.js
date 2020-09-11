import './App.css';

import Keyboard from './Keyboard';
import React from 'react';

function App() {
	return (
		<div className="App">
			<div className="main">
				<div className="keyboardContainer">
					<Keyboard />
				</div>
			</div>
		</div>
	);
}

export default App;
