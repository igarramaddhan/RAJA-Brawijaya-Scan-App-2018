import React from 'react';
import { Dimensions } from 'react-native';

const color = {
	primary: '#f4511e',
	darkGray: '#404040',
	red: '#c42228',
	darkGreen: '#1e4346'
};
const tokens = {
	OPEN_HOUSE: 'OPEN_HOUSE_TOKEN',
	MARKETPLACE: 'MARKETPLACE_TOKEN',
	KESEHATAN: 'KESEHATAN_TOKEN'
};
const { width, height } = Dimensions.get('screen');

const BASE_URL = 'https://18a59e85.ngrok.io/graphql';

export { color, BASE_URL, width, height, tokens };
