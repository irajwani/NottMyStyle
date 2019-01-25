import React, { Component } from 'react'
import { Dimensions, Text, Image, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from '../cloud/firebase';
// import { database } from '../cloud/database';
import { withNavigation } from 'react-navigation';
import { material } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Button } from 'react-native-elements';

import { lightGreen, coolBlack, highlightGreen, mantisGreen } from '../colors';
import NothingHereYet from '../components/NothingHereYet';
import { avenirNextText } from '../constructors/avenirNextText';
import { LoadingIndicator } from '../localFunctions/visualFunctions';

const noNotificationsText = "The NottMyStyle team believes your products don't warrant any stats yet 👌, thus you have no notifications."

const {width} = Dimensions.get('window');
const navTabButtonWidth = 115;

class Notifications extends Component {
  constructor(props) {
      super(props);
      this.state={isGetting:true, noNotifications: false};
  }

  componentWillMount() {
    setTimeout(() => {
      this.getNotifications();
    }, 1000);
  }

  navToChats() {
      this.props.navigation.navigate('Chats');
  }

  getNotifications() {
    //get chats for particular user
    firebase.database().ref().once("value", (snapshot) => {
      var d = snapshot.val();
      const uid = firebase.auth().currentUser.uid;
      if(d.Users[uid].notifications) {
        const notifications = d.Users[uid].notifications 
        this.setState({notifications});
      } 
      else {
        this.setState({noNotifications: true})
      }
      
      
    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  renderUpperNavTab = () => {
    return (
      <View style={styles.upperNavTab}>

        <TouchableOpacity onPress={()=>this.navToChats()} style={[styles.upperNavTabButton, {borderColor: '#fff', }]}>
          <Text style={styles.upperNavTabText}>Chats</Text>
        </TouchableOpacity>
        
        <View style={[styles.upperNavTabButton, {backgroundColor: highlightGreen}]} >
          <Text style={styles.upperNavTabText}>Notifications</Text>
        </View>
        
      </View>
    )
  }

  render() {
    const {isGetting, noNotifications, notifications} = this.state;
    console.log(notifications);
    if(isGetting) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
            <LoadingIndicator isVisible={isGetting} color={'black'} type={'Bounce'}/>
          </View>
        )
    }

    if(noNotifications) {
      return (
        <View style={styles.container}>
          {this.renderUpperNavTab()}
          <View style={{flex: 0.85, padding: 10}}>
            <NothingHereYet specificText={noNotificationsText}/>
          </View>
          
        </View>
      )
    }

    return (
      <View style={styles.container}>

        {this.renderUpperNavTab()}
      
        <ScrollView style={{flex: 0.85}} contentContainerStyle={styles.cc}>
          {Object.keys(notifications).map( (productKey) => (
              <View key={productKey} style={{flexDirection: 'column', padding: 5}}>
                <View style={styles.separator}/>
                <View style={styles.rowContainer}>
                  <View syle={styles.daysElapsedColumn}>
                      <Text style={styles.daysOnMarket}>Days on market:</Text>
                      <Text style={styles.daysElapsed}>{notifications[productKey].daysElapsed}</Text>
                      <Text>Suggested Price Reduction:</Text>
                      <View style={styles.priceReduction}>
                          <Text>£{notifications[productKey].price}</Text>
                          <Icon
                              name="arrow-right" 
                              size={15}  
                              color={'#800000'}
                          />
                          <Text>£{Math.floor(0.80*notifications[productKey].price)}</Text>
                      </View>
                  </View>    

                  
                  <Image source={ {uri: notifications[productKey].uri }} style={[styles.profilepic, styles.productcolor]} />
                  
                </View>
                <View style={styles.separator}/>
              </View>
          ))
          }
            
        </ScrollView>
      </View>
    )
  }
}

export default withNavigation(Notifications);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 22,
  },

  cc: {
    paddingHorizontal: 6, alignItems: 'center'
  },

  scrollContainer: {
    flex: 9
  },

  upperNavTab: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: coolBlack,
  },
  upperNavTabButton: {
    // backgroundColor: ,
    width: navTabButtonWidth,
    height: 50,
    
    borderWidth: 1.3,
    borderRadius: 30,
    borderColor: "#fff",

    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  upperNavTabText: new avenirNextText('#fff', 16, "400"),

  ////////



  chatsbutton: {
    backgroundColor: lightGreen,
    width: width/2 - 30,
    height: 50,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
  notifsbutton: {
    backgroundColor: "#fff",
    width: width/2 - 30,
    height: 50,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
    daysElapsedColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    daysOnMarket: {
        ...material.display1,
        fontFamily: 'Verdana',
        fontSize: 10,
        color: 'black'
    },
    daysElapsed: {
        ...material.display2,
        fontSize: 16,
        color: '#0d7259',
    },
    priceReduction: {
        flexDirection: 'row',
        padding: 5
    },
    rowContainer: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    profilepic: {
      borderWidth:1,
      alignItems:'center',
      justifyContent:'center',
      width:70,
      height:70,
      backgroundColor:'#fff',
      borderRadius: 35,
      borderWidth: 2
  
  },
    profilecolor: {
      borderColor: '#187fe0'
    },
    productcolor: {
      borderColor: '#86bb71'
    },
  infoandbuttoncontainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  info: {
    ...material.subheading,
  },  
  productinfo: {
    color: "#800000",
    fontSize: 15
  },
  sellerinfo: {
    fontSize: 12,
    color: "#07686d"
  },
  messagebutton: {
    backgroundColor: "#86bb71",
    width: 75,
    height: 45,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#187fe0"
  },
  separator: {
    backgroundColor: '#86bb71',
    width: width,
    height: 2
  },  
  })
  
  
  