import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	StatusBar,
	Image,
	Alert
} from 'react-native';
import Background from '../../assets/main_bg.png';
import Kesehatan from '../../assets/kesehatan.png';
import Marketplace from '../../assets/marketplace.png';
import OpenHouse from '../../assets/openhouse.png';
import { height, width } from '../libs/metrics';
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1,
		marginTop: StatusBar.currentHeight,
		marginBottom: StatusBar.currentHeight
	},
	button: {
		flex: 1,
		borderRadius: 5,
		marginTop: 20,
		marginRight: 20,
		marginLeft: 20,
		marginBottom: 10,
		justifyContent: 'center'
	},
	title: {
		fontSize: 20,
		// fontWeight: 'bold',
		color: '#fff',
		fontFamily: 'Laila-Bold'
	},
	imageBG: {
		resizeMode: 'cover',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	},
	titleView: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
type Props = {
	navigation: {
		navigate: Function
	}
};
type State = {};

const Card = ({ image, title, color, onPress }) => (
	<TouchableOpacity
		onPress={onPress ? onPress : () => {}}
		style={[styles.button, { backgroundColor: color }]}
	>
		<View style={{ flex: 1, flexDirection: 'column' }}>
			<View style={{ flex: 10, position: 'relative' }}>
				<Image
					source={image}
					style={[
						styles.imageBG,
						{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }
					]}
				/>
			</View>
			<View style={styles.titleView}>
				<Text style={styles.title}>{title}</Text>
			</View>
		</View>
	</TouchableOpacity>
);

export default class Main extends Component<Props, State> {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		this.state = {};
	}
	navigate(route: String) {
		this.props.navigation.navigate(route);
	}
	soon() {
		Alert.alert('Perhatian', 'Fitur ini masih dalam pengembangan');
	}
	render() {
		return (
			<View style={styles.container}>
				<Image source={Background} style={styles.imageBG} />
				<View style={styles.content}>
					<StatusBar
						translucent
						barStyle="dark-content"
						backgroundColor="rgba(0, 0, 0, 0.1)"
					/>
					<Card
						title="Kesehatan"
						image={Kesehatan}
						color="#FF614B"
						onPress={() => {
							this.navigate('KesehatanRoute');
						}}
					/>
					<Card
						title="Marketplace"
						image={Marketplace}
						color="#27BBFF"
						onPress={() => {
							this.soon();
						}}
					/>
					<Card
						title="Open House"
						image={OpenHouse}
						color="#2F9E85"
						onPress={() => {
							// this.navigate('OpenHouseRoute');
							this.soon();
						}}
					/>
				</View>
			</View>
		);
	}
}
