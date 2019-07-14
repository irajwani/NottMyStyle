import React from 'react';
import { View, StyleSheet, Image } from "react-native";
import { logoGreen } from "../colors";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const HeaderBar = ({navigation}) => (
    <View style={styles.headerContainer}>
        
        <FontAwesomeIcon
        name='arrow-left'
        size={28}
        color={"black"}
        onPress={()=>navigation.goBack()}
        />

        <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
        <FontAwesomeIcon
        name='close'
        size={28}
        color={'black'}
        onPress={()=>navigation.goBack()}
        />
          
    </View>
)

export {HeaderBar}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 0.1,
        backgroundColor: logoGreen,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },

    logo: {
        width: 50,
        height: 50,
    }
})