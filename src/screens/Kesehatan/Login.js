import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	StatusBar,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	AsyncStorage,
	ActivityIndicator
} from 'react-native';

import Background from '../../../assets/main_bg.png';
import { color, tokens, getUrlKesehatan } from '../../libs/metrics';
import { withConsumer } from '../../store';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight,
		justifyContent: 'center'
	},
	formContainer: {
		elevation: 3,
		backgroundColor: color.red,
		padding: 10,
		marginHorizontal: 10
	},
	title: {
		color: '#fff',
		fontSize: 25,
		fontFamily: 'Laila-Medium',
		alignSelf: 'center'
	},
	inputContainer: {
		backgroundColor: '#fff',
		borderRadius: 5,
		marginVertical: 5
	},
	button: {
		backgroundColor: color.darkGray,
		borderRadius: 5,
		marginVertical: 5,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
type Props = {
	navigation: {
		navigate: Function
	}
};
type State = {
	username: String,
	password: String
};
class Login extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			isLoading: false
		};
	}
	async login(username: String, password: String) {
		this.setState({ isLoading: true });
		try {
			let response = await fetch(getUrlKesehatan(username, password));
			try {
				console.log('processing data');
				let responseJson = await response.json();
				if (responseJson.cek) {
					try {
						await AsyncStorage.setItem(
							tokens.KESEHATAN,
							JSON.stringify(responseJson.cek)
						);
						this.props.store.setStoreState({
							tokenKesehatan: responseJson.cek
						});
						this.props.navigation.navigate('Home');
					} catch (error) {
						this.setState({ isLoading: false });
						console.log(error);
						Alert.alert('Error', 'Maaf terjadi kesalahan');
					}
				} else {
					this.setState({ isLoading: false });
					Alert.alert('Perhatian', 'Username atau Password salah!');
				}
			} catch (err) {
				this.setState({ isLoading: false });
				console.log('error processing data');
				Alert.alert('Error', 'Anda tidak terdaftar');
			}
		} catch (error) {
			this.setState({ isLoading: false });
			console.log('unexpected format');
			console.error(error);
		}
	}
	render() {
		return (
			<ImageBackground
				style={{ width: '100%', height: '100%' }}
				source={Background}
			>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.formContainer}>
						<Text style={styles.title}>Kesehatan App</Text>
						<View style={styles.inputContainer}>
							<TextInput
								padding={10}
								placeholder="username"
								returnKeyType="next"
								blurOnSubmit={false}
								onChangeText={val => this.setState({ username: val })}
								onSubmitEditing={() => {
									this.secondTextInput.focus();
								}}
							/>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								padding={10}
								secureTextEntry
								placeholder="password"
								returnKeyLabel="Login"
								onChangeText={val => this.setState({ password: val })}
								ref={input => {
									this.secondTextInput = input;
								}}
								onSubmitEditing={() =>
									this.login(this.state.username, this.state.password)
								}
							/>
						</View>
						{this.state.isLoading ? (
							<View
								style={{
									padding: 10,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<ActivityIndicator color="white" size="large" />
							</View>
						) : (
							<TouchableOpacity
								style={styles.button}
								onPress={() => {
									this.state.username !== '' && this.state.password !== ''
										? this.login(this.state.username, this.state.password)
										: Alert.alert(
												'Perhatian',
												'Silahkan masukkan username dan password terlebih dahulu!'
										  );
									// this.props.navigation.navigate('Home');
								}}
							>
								<Text
									style={{
										color: '#fff',
										fontSize: 18,
										fontFamily: 'Laila-Medium',
										alignSelf: 'center'
									}}
								>
									Login
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</ScrollView>
			</ImageBackground>
		);
	}
}

export default withConsumer(Login);
