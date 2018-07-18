import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { width, height } from '../libs/metrics';
const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		width: width - 20,
		elevation: 1,
		marginBottom: 10,
		borderRadius: 5
	}
});
type Props = {
	style: Object
};
type State = {};
export default class ListCard extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View style={[styles.container, { ...this.props.style }]}>
				{this.props.children}
			</View>
		);
	}
}
