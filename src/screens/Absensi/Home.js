import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	Image,
	ScrollView,
	Alert,
	AsyncStorage,
	BackHandler,
	DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import { color, width } from '../../libs/metrics';
import ListCard from '../../components/ListCard';
import { withConsumer } from '../../store';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#feffc6'
	},
	floatingButton: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: color.darkGreen,
		position: 'absolute',
		bottom: 10,
		right: 10,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5,
		zIndex: 100
	},
	itemContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
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

type Props = {};
type State = {
	data: Object
};
class Home extends Component<Props, State> {
	static navigationOptions = ({ navigation }) => {
		return {
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
						Absensi
					</Text>
				</View>
			),
			headerRight: (
				<Icon
					name="power"
					size={25}
					style={{ marginRight: 20 }}
					color="#fff"
					onPress={navigation.getParam('logout')}
				/>
			),
			headerLeft: <View />
		};
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}
	componentDidMount() {
		this.props.navigation.setParams({
			logout: this.logout
		});
		BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
		// this.getDataMahasiswa();
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
	}
	onBackPress = () => {
		this.exit();
		return true;
	};
	exit = () => {
		this.props.navigation.dispatch(NavigationActions.back());
		DeviceEventEmitter.emit('popAnimation');
	};
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
							await AsyncStorage.clear();
							this.props.store.setStoreState({ tokenKesehatan: null });
							this.props.navigation.dispatch(NavigationActions.back());
							DeviceEventEmitter.emit('popAnimation');
							// this.props.navigation.navigate('Main');
						} catch (error) {
							Alert.alert('Error', 'Maaf, terjadi kesalahan');
						}
					}
				}
			],
			{ cancelable: false }
		);
	};
	scan = async scanData => {
		let scanDataArray = scanData.split(' ');
		const nim = scanDataArray[0];
		scanDataArray.shift();
		try {
			console.log('fetching data');
			let response = await fetch(
				`https://rajabrawijaya.ub.ac.id/api/getDataMahasiswaBaru2018?nim=${nim}`
			);
			try {
				console.log('processing data');
				let responseJson = await response.json();
				this.setState({ data: responseJson });
				console.log(responseJson);
			} catch (err) {
				console.log('error processing data');
				Alert.alert('Error', 'NIM tidak terdaftar');
			}
		} catch (error) {
			console.log('unexpected format');
			console.error(error);
		}
	};
	render() {
		const { data } = this.state;
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				<TouchableOpacity
					style={styles.floatingButton}
					onPress={() => {
						// this.props.navigation.navigate('Camera', {
						// 	scan: this.scan
						// });
						this.scan('185020301111050 Lala');
					}}
				>
					<Icon
						name="camera"
						size={25}
						style={{ alignSelf: 'center' }}
						color="#fff"
					/>
					{/* <Text style={{ fontSize: 25, color: 'white' }}>+</Text> */}
				</TouchableOpacity>
				{!data ? (
					<View style={styles.itemContent}>
						<Text style={styles.normalText}>
							Tekan tombol <Icon name="camera" size={20} color="black" /> untuk
							memindai
						</Text>
					</View>
				) : (
					<View style={{ flex: 1, alignItems: 'center', paddingTop: 10 }}>
						<ListCard>
							<View style={styles.item}>
								<View style={styles.itemContent}>
									<Text style={styles.normalText}>{data.nim}</Text>
									<Text style={styles.normalText}>{data.nama}</Text>
								</View>
								{/* <View style={styles.itemContent}>
									<Image
										source={{
											uri: `http://siakad.ub.ac.id/siam/biodata.fotobynim.php?nim=${
												data.nim
											}&key=MzIxZm90b3V5ZTEyMysyMDE4LTA3LTAzIDIxOjE3OjM4`
										}}
										style={{ height: 199, width: 132 }}
									/>
								</View> */}
							</View>
						</ListCard>
						<ScrollView
							contentContainerStyle={{
								width: width,
								alignItems: 'center'
							}}
						>
							<ListCard style={{ padding: 10 }}>
								<List title="Fakultas" subTitle={data.fakultas} />
								<List title="Cluster" subTitle={data.cluster} />
								<List title="Gerbang" subTitle={data.gerbang} />
								<List
									title="Riwayat Penyakit"
									subTitle={data.riwayat_penyakit}
								/>
								<List title="Alergi Obat" subTitle={data.alergi_obat} />
								<List title="Alergi Makanan" subTitle={data.alergi_makanan} />
							</ListCard>
						</ScrollView>
					</View>
				)}
			</View>
		);
	}
}

export default withConsumer(Home);
