import React from 'react';
import { CameraRoll, StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      photos: []
    }
  }

  _handleButtonPress = () => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos',
    })
    .then(r => {
      this.setState({ photos: r.edges });
    })
    .catch((err) => {
        //Error Loading Images
    });
  };

   render() {
    return (
      <View>
        <Button title="Load Images" onPress={this._handleButtonPress} />
        <ScrollView>
          {this.state.photos.map((p, i) => {
          return (
            <Image
              key={i}
              style={{
                width: 500,
                height: 300,
              }}
              source={{ uri: p.node.image.uri }}
            />
          );
        })}
        </ScrollView>
      </View>
    );
  }   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
