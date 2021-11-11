import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import TimelinePage from './components/pages/TimelinePage';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';


const App = () => {
	return (
		<div className='App'>
			<Router>
				<Navbar />
				<Route exact path='/'>
					<TimelinePage />
				</Route>
				<Route path='/:id'>
					<ProfilePage />
				</Route>
			</Router>
		</div>
	);
}

export default App;