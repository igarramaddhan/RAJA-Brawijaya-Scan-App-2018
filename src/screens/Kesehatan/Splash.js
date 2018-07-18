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
// import { observer, inject } from 'mobx-react';
import { color, tokens } from '../../libs/metrics';
import Logo from '../../../assets/logo.png';
import { withConsumer } from '../../store';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

type Props = {};
type State = {};
// @inject('userStore')
// @observer
class Splash extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {};
	}
	async componentDidMount() {
		console.log('getting token');
		try {
			const token = await AsyncStorage.getItem(tokens.KESEHATAN);
			if (token) {
				this.props.store.setStoreState({ tokenKesehatan: JSON.parse(token) });
				this.props.navigation.navigate('Kesehatan');
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
				<StatusBar backgroundColor="#fff" />
			</View>
		);
	}
}

export default withConsumer(Splash);
