import React from 'react';
import { StatusBar } from 'react-native';
import {
	createSwitchNavigator,
	createBottomTabNavigator,
	createStackNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Main from './screens/Main';

//OPEN HOUSE
import LoginOpenHouseScreen from './screens/OpenHouse/Login';
import OpenHouseScreen from './screens/OpenHouse';
import SplashOpenHouseScreen from './screens/OpenHouse/Splash';

//KESEHATAN
import LoginKesehatanScreen from './screens/Kesehatan/Login';
import KesehantanScreen from './screens/Kesehatan';
import SplashKesehatanScreen from './screens/Kesehatan/Splash';

//ABSENSI
import LoginAbsensiScreen from './screens/Absensi/Login';
import AbsensiScreen from './screens/Absensi';
import SplashAbsensiScreen from './screens/Absensi/Splash';

const OpenHouseNavigator = createSwitchNavigator(
	{
		Splash: SplashOpenHouseScreen,
		Login: LoginOpenHouseScreen,
		OpenHouse: OpenHouseScreen
	},
	{
		initialRouteName: 'Splash'
	}
);

const AbsensiNavigator = createSwitchNavigator({
	Splash: SplashAbsensiScreen,
	Login: LoginAbsensiScreen,
	Absensi: AbsensiScreen
});

const KesehatanNavigator = createSwitchNavigator({
	Splash: SplashKesehatanScreen,
	Login: LoginKesehatanScreen,
	Kesehatan: KesehantanScreen
});

const RootNavigator = createStackNavigator(
	{
		Main: Main,
		OpenHouseRoute: OpenHouseNavigator,
		AbsensiRoute: AbsensiNavigator,
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
