import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { withNavigation } from 'react-navigation';

class Settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

export default withNavigation(Settings);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10,
    }
})
