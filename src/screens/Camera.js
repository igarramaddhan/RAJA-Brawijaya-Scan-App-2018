import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { height, width } from '../libs/metrics';
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 5
  },
  instructionText: {
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center'
  }
});
type Props = {};
type State = {};
export default class Camera extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: ''
    };
  }
  render() {
    const { loading } = this.state;
    const greenBoxSize = height / 2;
    const scan = this.props.navigation.getParam('scan', () => {});
    return (
      <View style={styles.container}>
        <View style={styles.cameraView}>
          {!loading ? (
            <RNCamera
              style={{
                flex: 1,
                width,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3
              }}
              onBarCodeRead={async ({ data }) => {
                this.setState({ loading: true });
                await scan(data);
                this.setState({ loading: false });
                // this.props.navigation.goBack();
              }}
            >
              <View
                style={{
                  height: greenBoxSize * 0.8,
                  width: greenBoxSize * 0.8,
                  borderWidth: 2,
                  borderColor: '#00FF00',
                  backgroundColor: 'transparent'
                }}
              />
            </RNCamera>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
        <View style={styles.textView}>
          <Text style={styles.instructionText}>
            Silahkan scan barcode pada name-tag mahasiswa
          </Text>
        </View>
      </View>
    );
  }
}
