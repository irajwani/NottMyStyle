import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import { darkGray, bgGray } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';

const GrayLine = ({height}) => (
    <View style={{backgroundColor: bgGray, height: height ? height : 2.5}}/>
)

const WhiteSpace = ({height}) => (
    <View style={{backgroundColor: '#fff', height: height}}/>
)

const DismissKeyboardView = ({children}) => (
    <TouchableWithoutFeedback 
    onPress={() => {
        Keyboard.dismiss();
        console.log('dismiss keyboard');
        }}>
        {children}
    </TouchableWithoutFeedback>
  )

const LoadingIndicator = ({isVisible, type, color}) => (
    <Spinner style={{}} isVisible={isVisible} size={50} type={type} color={color}/>    
) 

const CustomTouchableO = ({onPress, disabled, flex, color, text, textSize, textColor, extraStyles}) => {
    return(
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[{justifyContent: 'center', alignItems: 'center', backgroundColor: color, flex: flex}, extraStyles]}>
            <Text style={new avenirNextText(textColor, textSize, "300")}>{text}</Text>
        </TouchableOpacity>
    )
    
}

export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO}