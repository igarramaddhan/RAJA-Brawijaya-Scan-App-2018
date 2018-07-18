import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Home from './Home';
import Profile from './Profile';
import Camera from '../Camera';
import { color } from '../../libs/metrics';

const Kesehatan = createStackNavigator(
	{
		Home: Home,
		Profile: Profile,
		Camera: Camera
	},
	{
		cardStyle: {
			backgroundColor: '#f2f2f2'
		},
		headerMode: 'float',
		navigationOptions: {
			headerStyle: {
				backgroundColor: color.red,
				height: 56 + StatusBar.currentHeight,
				paddingTop: StatusBar.currentHeight
			},
			headerTitleStyle: {
				color: '#fff'
			},
			headerTintColor: '#fff'
		}
	}
);

export default Kesehatan;
