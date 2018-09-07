import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	StatusBar,
	Image,
	Alert,
	DeviceEventEmitter,
	ImageBackground,
	ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import SplashScreen from 'react-native-splash-screen';

import Background from '../../assets/main_bg.png';
import Kesehatan from '../../assets/kesehatan.png';
import Marketplace from '../../assets/marketplace.jpg';
import OpenHouse from '../../assets/openhouse.png';
import Absensi from '../../assets/absensi.png';
import { height, width } from '../libs/metrics';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#feffc6'
	},
	content: {
		// flex: 1,
		marginTop: StatusBar.currentHeight,
		marginBottom: StatusBar.currentHeight,
		paddingBottom: StatusBar.currentHeight + 10
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

export default class Main extends Component<Props, State> {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		this.state = {};
		this.list = [];
	}
	data = [
		{
			image: Absensi,
			title: 'Absensi',
			color: '#eec619',
			onPress: () => {
				// this.soon();
				this.animateBack(() => this.navigate('AbsensiRoute'));
			}
		},
		{
			image: Kesehatan,
			title: 'Kesehatan',
			color: '#FF614B',
			onPress: () => {
				this.animateBack(() => this.navigate('KesehatanRoute'));
			}
		},

		// {
		// 	image: Marketplace,
		// 	title: 'Marketplace',
		// 	color: '#27BBFF',
		// 	onPress: () => {
		// 		this.soon();
		// 	}
		// },
		{
			image: OpenHouse,
			title: 'Open House',
			color: '#2F9E85',
			onPress: () => {
				this.soon();
				// this.animateBack(() => this.navigate('OpenHouseRoute'));
			}
		}
	];
	componentDidMount() {
		SplashScreen.hide();
		this.animate();
		DeviceEventEmitter.addListener('popAnimation', () => this.animate());
	}
	componentWillUnmount() {
		DeviceEventEmitter.removeAllListeners('popAnimation');
	}
	navigate(route: String) {
		this.props.navigation.navigate(route);
	}
	soon() {
		Alert.alert('Perhatian', 'Fitur ini masih dalam pengembangan');
	}
	animate() {
		let x = 0;
		for (let i = 0; i < this.list.length; i++) {
			const element = this.list[i];
			element.fadeInDownBig(1000, (x += 200));
		}
	}
	animateBack(cb) {
		let x = 200;
		let a = [...this.list].reverse();
		for (let i = 0; i < a.length; i++) {
			const element = a[i];
			if (i != a.length - 1) element.fadeOutUpBig((x += 300));
			else element.fadeOutUpBig((x += 300)).then(endState => cb());
		}
	}

	// animate() {
	// 	this.Absensi.fadeInDownBig(1000, 0);
	// 	this.Kesehatan.fadeInDownBig(1000, 200);
	// 	this.Marketplace.fadeInDownBig(1000, 400);
	// 	this.OpenHouse.fadeInDownBig(1000, 600);
	// }
	// animateBack(cb) {
	// 	this.OpenHouse.fadeOutUpBig(200);
	// 	this.Marketplace.fadeOutUpBig(500);
	// 	this.Absensi.fadeOutUpBig(800);
	// 	this.Kesehatan.fadeOutUpBig(1100).then(endState => cb());
	// }
	renderCard({ image, title, color, onPress, ref }) {
		return (
			<Animatable.View
				useNativeDriver={true}
				style={{ height: 250 }}
				ref={ref => this.list.push(ref)}
				// ref={ref => (this[title.replace(/\s/g, '')] = ref)}
				key={title}
			>
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
			</Animatable.View>
		);
	}
	render() {
		return (
			<ImageBackground
				style={{ width: '100%', height: '100%' }}
				source={Background}
			>
				<View style={styles.container}>
					<ScrollView contentContainerStyle={styles.content}>
						<StatusBar
							translucent
							barStyle="dark-content"
							backgroundColor="rgba(0, 0, 0, 0.1)"
						/>
						{this.data.map((item, index) =>
							this.renderCard({
								image: item.image,
								title: item.title,
								color: item.color,
								onPress: item.onPress
							})
						)}
					</ScrollView>
				</View>
			</ImageBackground>
		);
	}
}
