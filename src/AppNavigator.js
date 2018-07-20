import React from 'react';
import { StatusBar } from 'react-native';
import {
	createSwitchNavigator,
	createBottomTabNavigator,
	createStackNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//OPEN HOUSE
// import LoginOpenHouseScreen from './screens/OpenHouse/Login';
// import OpenHouseScreen from './screens/OpenHouse';
// import SplashOpenHouseScreen from './screens/OpenHouse/Splash';

//KESEHATAN
import LoginKesehatanScreen from './screens/Kesehatan/Login';
import KesehantanScreen from './screens/Kesehatan';
import SplashKesehatanScreen from './screens/Kesehatan/Splash';
import Main from './screens/Main';

// const OpenHouseNavigator = createSwitchNavigator(
// 	{
// 		Splash: SplashOpenHouseScreen,
// 		Login: LoginOpenHouseScreen,
// 		OpenHouse: OpenHouseScreen
// 	},
// 	{
// 		initialRouteName: 'Splash'
// 	}
// );

const KesehatanNavigator = createSwitchNavigator(
	{
		Splash: SplashKesehatanScreen,
		Login: LoginKesehatanScreen,
		Kesehatan: KesehantanScreen
	},
	{
		// initialRouteName: 'Splash'
	}
);

const RootNavigator = createStackNavigator(
	{
		Main: Main,
		// OpenHouseRoute: OpenHouseNavigator,
		KesehatanRoute: KesehatanNavigator
	},
	{
		headerMode: 'none',
		navigationOptions: {
			headerStyle: {
				height: 56 + StatusBar.currentHeight,
				paddingTop: StatusBar.currentHeight
			}
		},
		transitionConfig: () => ({
			transitionSpec: {
				duration: 0
				// easing: Easing
			}
		})
	}
);

export default RootNavigator;
