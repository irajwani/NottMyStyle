import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput, Platform, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { darkGray, lightGray, rejectRed, almostWhite, flagRed, highlightGreen, mantisGreen } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';
import {shadow} from '../constructors/shadow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../cloud/firebase';

const GrayLine = () => (
    <View style={{backgroundColor: darkGray, height: 0.5}}/>
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

const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize, maxLength, secureTextEntry}) => (
    <View style={styles.inputContainer}>
      <View style={styles.input}>
          <TextInput
          secureTextEntry={secureTextEntry ? true : false}
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={lightGray}
          onChangeText={onChangeText}
          value={value}
          multiline={false}
          maxLength={maxLength}
          autoCorrect={false}
          autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
          clearButtonMode={'while-editing'}
          underlineColorAndroid={"transparent"}
          
          returnKeyType={'next'}
          />         
      </View>
    </View>
)

const SignInTextInput = ({width, placeholder, onChangeText, value, secureTextEntry, keyboardType, returnKeyType, onSubmitEditing, ref}) => (
    <View style={{width: width, height: 40, borderRadius: 30, backgroundColor: '#fff', }}>
        <View style={{position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
            <Text style={new avenirNextText(lightGray, 20, "200")}>{placeholder}</Text>
        </View>
        <TextInput
        secureTextEntry={secureTextEntry ? true : false}
        style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
        placeholder={''}
        placeholderTextColor={'#fff'}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        
        autoCorrect={false}
        
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        keyboardType={keyboardType ? 'email-address' : 'default'}
        ref={ref ? ref : null}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing ? onSubmitEditing : null}
        />         
    </View>
)

const MarketplaceIcon = ({strokeWidth, focused}) => (
    <View style={{width: 25, height: 25, alignItems: 'center'}}>
      <Svg height={"100%"} width={"100%"} fill={!focused ? "black" : highlightGreen} viewBox="0 0 400 400">
          
          <Path 
          d="M71.967 0.400 C 58.991 0.685,58.422 0.809,52.763 4.589 C 46.732 8.617,47.929 6.695,17.842 60.685 L 0.647 91.539 0.629 123.547 C 0.608 162.621,0.659 163.156,5.321 172.590 C 7.793 177.591,10.158 181.156,13.769 185.321 L 16.597 188.583 16.855 282.773 L 17.114 376.962 19.668 379.326 L 22.222 381.690 197.961 381.504 C 383.252 381.306,378.872 381.358,380.865 379.363 C 383.532 376.695,383.661 371.755,383.677 271.623 L 383.690 188.710 386.823 184.977 C 399.341 170.061,399.801 167.886,399.782 123.751 L 399.768 91.539 382.409 60.347 C 352.709 6.978,352.583 6.789,343.672 2.230 L 339.311 0.000 211.348 0.075 C 140.968 0.116,78.247 0.263,71.967 0.400 M334.885 17.007 C 339.799 18.020,339.943 18.243,364.403 62.589 C 377.410 86.171,379.328 89.718,379.158 89.874 C 379.072 89.953,362.297 90.183,341.881 90.384 L 304.761 90.750 303.252 92.368 C 299.996 95.858,299.397 98.974,301.274 102.652 C 303.169 106.364,300.940 106.174,350.018 106.811 C 368.165 107.046,383.094 107.321,383.195 107.422 C 383.801 108.028,383.418 154.497,382.782 157.460 C 375.285 192.401,328.001 190.549,323.743 155.148 C 322.897 148.113,320.489 145.124,315.447 144.852 C 310.222 144.570,307.883 147.240,306.606 154.944 C 303.702 172.456,292.742 182.687,276.860 182.711 C 261.109 182.735,249.978 172.444,247.079 155.179 C 245.672 146.800,243.650 144.487,238.061 144.862 C 232.882 145.209,231.244 147.256,229.940 155.011 C 227.820 167.625,222.712 175.129,213.048 179.829 C 194.184 189.002,173.439 176.987,170.433 155.148 C 169.219 146.326,165.214 142.913,158.818 145.248 C 155.512 146.454,154.232 148.903,153.130 156.126 C 149.871 177.496,129.108 188.892,110.296 179.636 C 100.940 175.033,96.130 167.701,93.559 154.128 C 92.179 146.841,88.968 143.722,83.953 144.798 C 79.892 145.668,77.843 148.138,77.063 153.100 C 74.912 166.776,69.744 174.939,60.347 179.501 C 41.988 188.414,22.078 178.143,17.623 157.460 C 16.976 154.453,16.612 108.023,17.231 107.403 C 17.340 107.295,64.196 107.021,121.355 106.795 L 225.280 106.384 226.431 105.078 C 229.864 101.181,229.708 94.276,226.134 91.934 C 224.833 91.082,191.083 90.658,93.884 90.273 C 53.909 90.114,21.203 89.833,21.203 89.647 C 21.203 89.033,49.918 37.249,56.783 25.484 C 61.686 17.081,61.335 17.239,76.249 16.716 C 89.330 16.258,332.578 16.531,334.885 17.007 M90.322 185.107 C 111.019 204.903,136.946 204.614,157.897 184.356 L 161.870 180.515 166.256 184.592 C 187.255 204.109,212.721 204.797,232.211 186.373 C 234.230 184.464,236.471 182.363,237.191 181.703 L 238.501 180.502 242.521 184.361 C 263.624 204.615,289.885 204.897,310.092 185.085 L 315.026 180.247 318.471 183.733 C 322.778 188.089,327.004 191.531,330.690 193.684 L 333.537 195.347 333.537 251.394 L 333.537 307.441 200.204 307.441 L 66.871 307.441 66.871 251.422 L 66.871 195.402 71.662 192.231 C 75.153 189.921,77.614 187.870,80.734 184.667 C 83.089 182.250,85.061 180.261,85.116 180.248 C 85.171 180.235,87.514 182.421,90.322 185.107 M38.562 198.754 C 40.788 199.078,44.307 199.469,46.381 199.622 L 50.153 199.901 50.176 237.260 C 50.189 257.807,50.346 282.984,50.526 293.210 L 50.852 311.803 51.907 314.108 C 55.144 321.178,58.687 322.911,70.832 323.366 C 82.705 323.810,317.712 323.822,329.685 323.379 C 341.514 322.940,344.995 321.238,348.419 314.217 L 349.588 311.818 349.892 293.218 C 350.059 282.988,350.209 257.807,350.225 237.260 L 350.255 199.901 354.027 199.618 C 356.101 199.462,359.711 199.072,362.049 198.750 C 364.386 198.428,366.359 198.165,366.432 198.165 C 366.505 198.165,366.565 235.780,366.565 281.753 L 366.565 365.341 200.204 365.341 L 33.843 365.341 33.843 281.753 C 33.843 235.780,33.994 198.165,34.179 198.165 C 34.364 198.165,36.336 198.430,38.562 198.754 M240.853 204.048 C 235.529 205.479,233.353 211.680,236.591 216.193 C 238.305 218.582,250.919 231.331,253.320 233.101 C 257.351 236.073,263.316 234.955,265.419 230.834 C 267.935 225.901,267.024 224.160,256.285 213.372 C 246.327 203.370,245.418 202.821,240.853 204.048 M285.943 206.048 L 283.588 208.311 283.442 211.853 L 283.296 215.396 289.151 221.292 C 298.912 231.123,314.932 246.467,317.307 248.260 C 321.728 251.598,327.840 249.401,329.494 243.879 C 330.719 239.791,329.315 237.926,311.954 220.565 C 296.077 204.689,295.411 204.154,291.243 203.938 L 288.297 203.785 285.943 206.048 M271.735 236.450 C 268.319 238.001,266.078 242.298,267.029 245.474 C 267.862 248.255,308.064 289.164,311.624 290.853 C 316.081 292.969,321.394 290.037,322.562 284.818 C 323.521 280.535,322.587 279.405,297.601 254.588 C 277.547 234.670,276.802 234.148,271.735 236.450 "
          stroke="black"
          strokeWidth={strokeWidth}
          />
          
      </Svg>
    </View>
 
)

class BadgeIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            unreadCount: false,
            isGetting: true
        }
    }

    componentWillMount = () => {
        if(this.props.unreadCount) {
            setTimeout(() => {
                
                this.setState({uid: firebase.auth().currentUser.uid}, () => {
                    this.getNotificationsCount(this.state.uid);
                    setInterval(() => {
                      this.getNotificationsCount(this.state.uid);
                    }, 20000);
                });

                
            }, 1);
        }
        
    }

    // componentDidMount = () => {
    //     this.getNotificationsCountInterval = setInterval(() => {
    //         this.getNotificationsCount(this.state.uid);
    //     }, 20000);
    // }

    componentWillUnmount = () => {
        // clearInterval(this.getNotificationsCountInterval);
    }

    getNotificationsCount = (uid) => {
        this.setState({isGetting: true});
        firebase.database().ref(`/Users/${uid}`).on("value", (snapshot) => {
          var d = snapshot.val();
          let unreadCount = 0
  
          if(d.notifications) {
            if(d.notifications.priceReductions) {
            
              Object.values(d.notifications.priceReductions).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
            
            }
          
            if(d.notifications.itemsSold) {
              
              Object.values(d.notifications.itemsSold).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }
  
            if(d.notifications.purchaseReceipts) {
              
              Object.values(d.notifications.purchaseReceipts).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }}
  
          this.setState({unreadCount, isGetting: false})
          
          
          
        })
        // .catch( (err) => { 
        //   this.setState({unreadCount: 0, isGetting: false})
        //  })
        
      }

    render() {
        return (
          
            <View style={{ width: 35, height: 35, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
                {/* Now just for chats icon */}
                { this.state.unreadCount > 0 ?
                    
                  <View style={Platform.OS == 'ios' ? {
                    
                    position: 'absolute',
                    right: -4,
                    top: -3,
                    backgroundColor: flagRed,
                    borderRadius: 9,
                    width: 18,
                    height: 18,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  } : {
                    
                    position: 'absolute',
                    right: 3,
                    top: 2,
                    backgroundColor: flagRed,
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {this.state.isGetting ?
                        <LoadingIndicator isVisible={this.state.isGetting} type={'Circle'} color={'#fff'}/>
                        :
                        <Text style={{color: almostWhite, fontWeight: "300", fontSize: Platform.OS == 'ios' ? 12:8}}>{this.state.unreadCount}</Text>
                    }
                  </View>
                
                :
                null
                }
            </View>
          
        )
    } 
}



export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO, CustomTextInput, SignInTextInput, MarketplaceIcon, BadgeIcon}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 7,
    marginHorizontal: 5,
    justifyContent: 'center'
  //   alignItems: 'center'
},

//   placeholderContainer: {
//     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
//   },

input: {
  height: 38, borderRadius: 19, backgroundColor: '#fff', 
  padding: 10, 
  // justifyContent: 'center', alignItems: 'flex-start',
  ...new shadow(2,2, color = mantisGreen, -1, 1)
},

inputText: { fontFamily: 'Avenir Next', fontSize: 14, fontWeight: "500", color: highlightGreen},
})