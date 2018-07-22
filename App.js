import React from 'react';
import { Alert, CameraRoll, StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera, Permissions, ImagePicker } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      hideCamera: 'none',
      openCameraText: 'Open Camera',
      type: Camera.Constants.Type.back,
      image: 'http://via.placeholder.com/1000x1000?text=please%20choose%20an%20image'
    }
  }

  async componentWillMount() {
    // Camera Permissions
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({ base64: true });

      CameraRoll.saveToCameraRoll(photo.uri)
        .then(Alert.alert('Success', 'Photo added to camera roll!'));

      this.setState({ image: photo.uri });
    }
  }

  flipCamera = () => {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  _handleButtonPress = () => {
    this.setState({
      hideCamera: this.state.hideCamera === 'none'
        ? 'flex'
        : 'none',
    });

    this.setState({
      openCameraText: this.state.openCameraText === 'Open Camera'
        ? 'Close Camera'
        : 'Open Camera',
    });
  };

  _pickImage = async () => {
    // Camera Roll Permissions
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });

    if (this.state.hasCameraRollPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    }

  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {/* Toggle Camera Open */}
          <TouchableOpacity style={styles.openCamera} onPress={this._handleButtonPress}>
            <Text style={styles.openCameraText}> {this.state.openCameraText} </Text>
            <Ionicons name="md-camera" size={32} color='white' position='absolute' />
          </TouchableOpacity>
          {/* Camera Component */}
          <Camera ref={ref => { this.camera = ref; }} style={{ flex: 1, height: 300, display: this.state.hideCamera }} type={this.state.type}>
            <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row', }}>
              <TouchableOpacity style={styles.cameraButton} onPress={this.flipCamera}>
                <Text>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={this.snap}>
                <Text>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </Camera>
          {/* View the chosen image */}
          <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200, alignSelf: 'center' }} />}
          {/* Camera Roll*/}
          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openCamera: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'black',
    borderColor: 'white',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openCameraText: {
    fontSize: 18,
    paddingTop: 10,
    color: 'white',
  },
  cameraButton: {
    flex: 0.5,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  }
});
