import React, { Component } from 'react';
import {
	View,
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	AsyncStorage,
	ImageBackground,
	Image
} from 'react-native';
import { color, tokens } from '../../libs/metrics';
import Logo from '../../../assets/logo.png';
import { withConsumer } from '../../store';
import Background from '../../../assets/main_bg.png';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#feffc6'
	}
});

type Props = {
	store: {
		setStoreState: Function
	},
	navigation: {
		navigate: Function
	}
};
type State = {};
class Splash extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {};
	}
	async componentDidMount() {
		console.log('getting token');
		try {
			const token = await AsyncStorage.getItem(tokens.OPEN_HOUSE);
			if (token) {
				this.props.store.setStoreState({ dataUKM: JSON.parse(token) });
				this.props.navigation.navigate('OpenHouse');
			} else {
				this.props.navigation.navigate('Login');
			}
		} catch (err) {
			console.log(err);
			this.props.navigation.navigate('Login');
		}
	}
	render() {
		return (
			<ImageBackground
				style={{ width: '100%', height: '100%' }}
				source={Background}
			>
				<View style={styles.container}>
					<Image
						source={Logo}
						style={{
							resizeMode: 'cover',
							height: 300,
							width: 500
						}}
					/>
					<ActivityIndicator size="large" />
				</View>
			</ImageBackground>
		);
	}
}

export default withConsumer(Splash);
