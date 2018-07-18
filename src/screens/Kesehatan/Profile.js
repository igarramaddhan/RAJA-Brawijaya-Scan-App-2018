import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
type Props = {};
type State = {};
export default class Profile extends Component<Props, State> {
	static navigationOptions = {
		headerTitle: (
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontSize: 25,
						fontFamily: 'Laila-Bold',
						color: 'white',
						alignSelf: 'center'
					}}
				>
					Profile
				</Text>
			</View>
		),
		headerRight: <View />
	};
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View style={styles.container}>
				<Text>This is your Profile class</Text>
			</View>
		);
	}
}
