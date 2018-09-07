import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { Provider } from 'mobx-react';
import codePush from 'react-native-code-push';

import AppNavigator from './src/AppNavigator';
// import UserStore from './src/store/user';
// import ClientStore from './src/store/client';
import { AppProvider } from './src/store';

const initialState = {
	tokenKesehatan: null,
	dataUKM: null,
	tokenAbsensi: null
};

type Props = {};
type State = {};
class App extends Component<Props, State> {
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

let codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
	installMode: codePush.InstallMode.IMMEDIATE
};

const Main = (AwesomeApp = codePush(codePushOptions)(App));
export default Main;
