import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import TimelinePage from './components/pages/TimelinePage';
import UserPage from './components/pages/UserPage';

import UserState from './context/user/UserState';

import './App.css';


const App = () => {
	return (
		<div className='App'>
			<UserState>
				<Router>
					<Navbar />
					<Route exact path='/'>
						<TimelinePage />
					</Route>
					<Route path='/:id'>
						<UserPage />
					</Route>
				</Router>
			</UserState>
		</div>
	);
}

export default App;