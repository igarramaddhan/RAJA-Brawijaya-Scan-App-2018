import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Alert,
	DeviceEventEmitter,
	AsyncStorage,
	Image,
	TouchableOpacity
} from 'react-native';

import { withConsumer } from '../../store';
import ListCard from '../../components/ListCard';
import { color, tokens, width } from '../../libs/metrics';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#feffc6'
	},
	normalText: {
		color: 'black',
		fontFamily: 'Laila-Regular',
		fontSize: 18
	},
	item: {
		padding: 10,
		flexDirection: 'row'
	},
	smalllText: {
		color: 'black',
		fontFamily: 'Laila-Regular',
		fontSize: 15
	},
	itemContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		backgroundColor: color.red,
		borderRadius: 5,
		marginVertical: 5,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		width: width - 20
	}
});

const List = ({ title, subTitle }) => (
	<View style={{ marginBottom: 10 }}>
		<View
			style={{
				borderBottomColor: color.darkGray,
				borderBottomWidth: 0.5,
				marginBottom: 10,
				padding: 10
			}}
		>
			<Text style={[styles.normalText, { fontFamily: 'Laila-Bold' }]}>
				{title}
			</Text>
		</View>
		<Text style={[styles.smalllText, { marginLeft: 5, fontSize: 17 }]}>
			{subTitle}
		</Text>
	</View>
);

type Props = {
	navigation: {
		navigate: Function
	},
	store: {
		setStoreState: Function
	}
};
type State = {};
class Profile extends Component<Props, State> {
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
		this.state = {
			dataUKM: null
		};
	}
	componentWillMount() {
		this.setState({ dataUKM: this.props.store.dataUKM });
	}
	logout = async () => {
		Alert.alert(
			'Perhatian',
			'Anda yakin akan log out?',
			[
				{
					text: 'Tidak',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{
					text: 'Ya',
					onPress: async () => {
						try {
							await AsyncStorage.removeItem(tokens.OPEN_HOUSE);
							this.props.store.setStoreState({ dataUKM: null });
							this.props.navigation.navigate('Main');
							DeviceEventEmitter.emit('popAnimation');
						} catch (error) {
							Alert.alert('Error', 'Maaf, terjadi kesalahan');
						}
					}
				}
			],
			{ cancelable: false }
		);
	};
	render() {
		const { dataUKM } = this.state;
		return (
			<View style={styles.container}>
				<View style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
					<View style={{ margin: 20 }}>
						<Image
							resizeMode="contain"
							source={{
								uri: `https://rajabrawijaya.ub.ac.id/LogoUKM/${dataUKM.logo}`
							}}
							style={{ height: 200, width: 200 }}
						/>
					</View>
					<ListCard style={{ padding: 10 }}>
						<List title="Nama" subTitle={dataUKM.nama} />
						<List title="Username" subTitle={dataUKM.username} />
					</ListCard>
					<TouchableOpacity style={styles.button} onPress={() => this.logout()}>
						<Text
							style={{
								color: '#fff',
								fontSize: 18,
								fontFamily: 'Laila-Medium',
								alignSelf: 'center'
							}}
						>
							Log Out
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default withConsumer(Profile);
