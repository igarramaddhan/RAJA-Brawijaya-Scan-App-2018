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
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import { color, width, tokens } from '../../libs/metrics';
import ListCard from '../../components/ListCard';
import { withConsumer } from '../../store';
import ModalView from '../../components/Modal';
import FormInput from '../../components/FormInput';

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
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Laila-Medium',
    alignSelf: 'center'
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
              await AsyncStorage.removeItem(tokens.ABSENSI);
              this.props.store.setStoreState({ tokenAbsensi: null });
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
  getNIM = async nim => {
    try {
      let response = await fetch(
        `https://rajabrawijaya.ub.ac.id/labina/wid/decrypt?str=${nim}`
      );
      try {
        let responseJson = await response.json();
        return responseJson;
      } catch (err) {
        console.log(err);
        return 0;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  };
  scan = async scanData => {
    let scanDataArray = scanData.split(' ');
    const encryptedNIM = scanDataArray[0];
    // const nim =
    // encryptedNIM.substring(0, 3) === '185' ||
    // encryptedNIM.substring(0, 3) === '165'
    // 	? encryptedNIM
    // 	: await this.getNIM(encryptedNIM);
    scanDataArray.shift();
    try {
      console.log('fetching data');
      let response = await fetch(
        `https://rajabrawijaya.ub.ac.id/absenoh/${encryptedNIM}`
      );
      try {
        console.log('processing data');
        let responseJson = await response.json();
        console.log(responseJson);
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
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
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            this.props.navigation.navigate('Camera', {
              scan: this.scan
            });
            // this.scan('185020301111050 Lala');
          }}
          onLongPress={() => this.setModalVisible(true)}
        >
          <Icon
            name="camera"
            size={25}
            style={{ alignSelf: 'center' }}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.itemContent}>
          <Text style={styles.normalText}>
            Tekan tombol <Icon name="camera" size={20} color="black" /> untuk
            memindai
          </Text>
        </View>
        <ModalView
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: color.red,
                padding: 10,
                borderRadius: 3,
                marginHorizontal: 10
              }}
            >
              <Text style={styles.title}>Masukkan NIM</Text>
              <FormInput
                keyboardType="number-pad"
                placeholder="NIM"
                onChangeText={val => this.setState({ nim: val })}
                onSubmitEditing={() => {
                  this.scan(this.state.nim);
                  this.setModalVisible(false);
                }}
              />
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: color.primary,
                    elevation: 3,
                    margin: 3,
                    padding: 8,
                    borderRadius: 3
                  }}
                  onPress={() => {
                    this.setModalVisible(false);
                  }}
                >
                  <Text style={[styles.normalText, { color: 'white' }]}>
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: color.darkGreen,
                    elevation: 3,
                    margin: 3,
                    padding: 8,
                    borderRadius: 3
                  }}
                  onPress={() => {
                    this.scan(this.state.nim);
                    this.setModalVisible(false);
                  }}
                >
                  <Text style={[styles.normalText, { color: 'white' }]}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ModalView>
      </View>
    );
  }
}

export default withConsumer(Home);
