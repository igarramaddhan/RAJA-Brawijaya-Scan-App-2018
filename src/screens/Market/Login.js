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
  ActivityIndicator,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions } from 'react-navigation';

import Background from '../../../assets/main_bg.png';
import { color, tokens, getUrlKesehatan } from '../../libs/metrics';
import { withConsumer } from '../../store';
import FormInput from '../../components/FormInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    backgroundColor: '#feffc6'
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
  },
  setStoreState: Function
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
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentDidMount() {
    this.view.bounceInUp(2000);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    this.exit();
    return true;
  };
  async login(username: String, password: String) {
    await this.button
      .rubberBand(300)
      .then(endState => this.setState({ isLoading: true }));
    try {
      let response = await fetch(getUrlKesehatan(username, password));
      try {
        console.log('processing data');
        let responseJson = await response.json();
        if (responseJson.cek) {
          try {
            await AsyncStorage.setItem(
              tokens.MARKETPLACE,
              JSON.stringify(responseJson.cek)
            );
            this.props.store.setStoreState({
              tokenMarket: responseJson.cek
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
  exit = () =>
    this.view.bounceOutDown(1000).then(endState => {
      if (endState.finished) {
        this.props.navigation.dispatch(NavigationActions.back());
        DeviceEventEmitter.emit('popAnimation');
      } else console.log('canceled');
    });
  render() {
    return (
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={Background}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Animatable.View
            ref={ref => (this.view = ref)}
            // animation="bounceInUp"
            style={styles.formContainer}
          >
            <Text style={styles.title}>Marketplace App</Text>
            <FormInput
              viewRef={ref => (this.usernameView = ref)}
              placeholder="username"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={val => this.setState({ username: val })}
              onSubmitEditing={() => {
                if (this.state.username === '') {
                  this.usernameView.shake(800);
                } else {
                  this.secondTextInput.focus();
                }
              }}
            />
            <FormInput
              viewRef={ref => (this.passwordView = ref)}
              secureTextEntry
              placeholder="password"
              returnKeyLabel="Login"
              onChangeText={val => this.setState({ password: val })}
              inputRef={input => {
                this.secondTextInput = input;
              }}
              onSubmitEditing={() => {
                if (this.state.password === '') {
                  this.passwordView.shake(800);
                } else {
                  this.login(this.state.username, this.state.password);
                }
              }}
            />
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
              <Animatable.View ref={ref => (this.button = ref)}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    // this.state.username !== '' && this.state.password !== ''
                    // 	? this.login(this.state.username, this.state.password)
                    // 	: Alert.alert(
                    // 			'Perhatian',
                    // 			'Silahkan masukkan username dan password terlebih dahulu!'
                    // 	  );
                    // this.props.navigation.navigate('Home');
                    if (
                      this.state.username === '' &&
                      this.state.password === ''
                    ) {
                      this.usernameView.shake(800);
                      this.passwordView.shake(800);
                      // Alert.alert(
                      // 	'Perhatian',
                      // 	'Silahkan masukkan username dan password terlebih dahulu!'
                      // );
                    } else if (this.state.username === '') {
                      this.usernameView.shake(800);
                    } else if (this.state.password === '') {
                      this.passwordView.shake(800);
                    } else {
                      this.login(this.state.username, this.state.password);
                    }
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
              </Animatable.View>
            )}
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

export default withConsumer(Login);
