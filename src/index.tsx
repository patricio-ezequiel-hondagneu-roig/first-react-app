import React from 'react';
import ReactDOM from 'react-dom/client';

import { Game } from './components/Game';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
	throw new Error('Root element not found.');
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>
);