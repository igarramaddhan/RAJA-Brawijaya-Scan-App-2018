import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { Provider } from 'mobx-react';

import AppNavigator from './src/AppNavigator';
// import UserStore from './src/store/user';
// import ClientStore from './src/store/client';
import { AppProvider } from './src/store';

const initialState = {
	tokenKesehatan: null
};

type Props = {};
type State = {};
export default class App extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			// <Provider userStore={UserStore} clientStore={ClientStore}>
			<AppProvider state={initialState}>
				<AppNavigator />
			</AppProvider>
			// </Provider>
		);
	}
}
