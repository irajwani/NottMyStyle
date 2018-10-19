import React, { Component } from 'react'
import { Dimensions, Text, View, StyleSheet } from 'react-native'
import {withNavigation} from 'react-navigation'

const width = Dimensions.get('window').width;

class PrivacyPolicy extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hi</Text>
      </View>
    )
  }
}

export default withNavigation(PrivacyPolicy);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    pdf: {
        flex: 1,
        width: width,
    },

})