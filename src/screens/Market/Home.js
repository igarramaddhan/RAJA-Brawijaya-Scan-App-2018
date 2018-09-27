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
  Modal,
  TouchableHighlight
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

type Props = {
  setStoreState: Function
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
            Marketplace
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
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      modalVisible: false,
      nim: ''
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
              await AsyncStorage.removeItem(tokens.MARKETPLACE);
              this.props.store.setStoreState({ tokenMarket: null });
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
    // 377949593030235
    this.props.navigation.goBack();
    let scanDataArray = scanData.split(' ');
    const encryptedNIM = scanDataArray[0];
    const nim =
      encryptedNIM.length === 15
        ? encryptedNIM
        : await this.getNIM(encryptedNIM);
    scanDataArray.shift();
    try {
      console.log('fetching data');
      let response = await fetch(
        `https://rajabrawijaya.ub.ac.id/api/getPemesanan?nim=${nim}`
      );
      console.log('nim', nim);
      try {
        console.log('processing data');
        let responseJson = await response.json();
        this.setState({ data: responseJson.data });
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
    console.log(data);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            this.props.navigation.navigate('Camera', {
              scan: this.scan,
              back: true
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
                <List title="Status" subTitle={data.status} />
              </ListCard>
              <ListCard style={{ padding: 10, marginBottom: 70 }}>
                <View
                  style={[
                    styles.item,
                    {
                      borderBottomColor: color.darkGray,
                      borderBottomWidth: 0.5,
                      marginBottom: 10,
                      padding: 10
                    }
                  ]}
                >
                  <Text
                    style={[styles.normalText, { fontFamily: 'Laila-Bold' }]}
                  >
                    Pesanan
                  </Text>
                </View>
                {data.pesanan.map((val, id) => (
                  <View
                    key={id}
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      justifyContent: 'space-between'
                    }}
                  >
                    <Text style={styles.normalText}>{val.barang}</Text>
                    <Text style={styles.normalText}>
                      {val.jumlah + ' x ' + val.harga}
                    </Text>
                  </View>
                ))}
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    justifyContent: 'space-between',
                    borderTopColor: color.darkGray,
                    borderTopWidth: 0.5,
                    marginTop: 10
                  }}
                >
                  <Text
                    style={[styles.normalText, { fontFamily: 'Laila-Bold' }]}
                  >
                    Total
                  </Text>
                  <Text style={styles.normalText}>{data.totalHarga}</Text>
                </View>
              </ListCard>
            </ScrollView>
          </View>
        )}
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
