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
	DeviceEventEmitter,
	ToastAndroid,
	FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import { color, width, tokens } from '../../libs/metrics';
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

type Props = {
	store: {
		setStoreState: Function
	},
	navigation: {
		navigate: Function
	}
};
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
						Open House
					</Text>
				</View>
			),
			headerRight: (
				<Icon
					name="account"
					size={25}
					style={{ marginRight: 20 }}
					color="#fff"
					onPress={navigation.getParam('goToProfile')}
				/>
			),
			headerLeft: <View />
		};
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			isRefreshing: false
		};
	}
	componentDidMount() {
		this.props.navigation.setParams({
			goToProfile: this.goToProfile
		});
		BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
		this.getListMahasiswa();
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
	goToProfile = () => {
		this.props.navigation.navigate('Profile');
	};
	async getListMahasiswa() {
		try {
			let response = await fetch(
				`https://rajabrawijaya.ub.ac.id/api/getUKM?ukm=${
					this.props.store.dataUKM.id
				}`
			);
			try {
				let responseJson = await response.json();
				if (responseJson.listMahasiswa) {
					this.setState({ data: responseJson.listMahasiswa });
				}
			} catch (error) {
				console.log(error);
			}
		} catch (error) {
			console.log(error);
		}
	}
	scan = async scanData => {
		let scanDataArray = scanData.split(' ');
		const nim = scanDataArray[0];
		scanDataArray.shift();
		try {
			console.log('fetching data');
			let response = await fetch(
				`https://rajabrawijaya.ub.ac.id/api/scanUKM?nim=${nim}&ukm=${
					this.props.store.dataUKM.id
				}&akses=pit18digoyang`
			);
			try {
				console.log('processing data');
				let responseJson = await response.json();
				ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
				this.getListMahasiswa();
			} catch (err) {
				console.log('error processing data');
				Alert.alert('Failed', 'Maaf, insert data gagal');
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
						this.scan('185020301111043 Lala');
					}}
				>
					<Icon
						name="camera"
						size={25}
						style={{ alignSelf: 'center' }}
						color="#fff"
					/>
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
						<FlatList
							onRefresh={() => this.getListMahasiswa()}
							refreshing={this.state.isRefreshing}
							data={this.state.data}
							renderItem={({ item }) => (
								<ListCard>
									<View style={styles.item}>
										<View style={styles.itemContent}>
											<Text style={styles.normalText}>{item.nim}</Text>
											<Text style={styles.normalText}>{item.nama}</Text>
										</View>
									</View>
								</ListCard>
							)}
							keyExtractor={item => item.nim}
						/>
					</View>
				)}
			</View>
		);
	}
}

export default withConsumer(Home);
