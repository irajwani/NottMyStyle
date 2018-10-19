import React, { Component } from 'react'
import { Dimensions, Text, ScrollView, View, StyleSheet } from 'react-native';
import {withNavigation} from 'react-navigation'
import { Button } from 'react-native-elements';


const width = Dimensions.get('window').width;

class TermsOfService extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
            buttonStyle={{
                backgroundColor: "green",
                width: 50,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 90,
                marginLeft: 200
            }}
            icon={{name: 'arrow-left', type: 'font-awesome'}}
            onPress={() => {
                            this.props.navigation.goBack(); 
                            } } 
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text>Hi</Text>
        </ScrollView>
      </View>  
    )
  }
}

export default withNavigation(TermsOfService);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 15
    },
    pdf: {
        flex: 1,
        width: width,
    },

})