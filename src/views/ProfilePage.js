import React, { Component } from 'react'
import { AsyncStorage, Platform, Dimensions, Text, StyleSheet, ScrollView, View, Image, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';

import PushNotification from 'react-native-push-notification';

import ActionSheet from 'react-native-actionsheet'

import { iOSColors, iOSUIKit, human } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient'
import ReviewsList from '../components/ReviewsList.js';
import { PacmanIndicator } from 'react-native-indicators';
import { avenirNextText } from '../constructors/avenirNextText';

import { highlightGreen, graphiteGray, avenirNext, mantisGreen,darkGreen,lightGreen,treeGreen, limeGreen } from '../colors.js';
import { LoadingIndicator } from '../localFunctions/visualFunctions.js';
import ProgressiveImage from '../components/ProgressiveImage';
const {width, height} = Dimensions.get('window');

const resizeMode = 'center';

const noReviewsText = "No Reviews have been\n left for you thus far.";

class ProfilePage extends Component {

  static navigationOptions = {
    header: null
    // headerTitle: 'ProfileMyStyle',
    // headerStyle: {
    //   backgroundColor: 'red',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   fontFamily: 'Verdana'
    // },
  };

  constructor(props) {
    super(props);
    this.gradientColors = {
      0: ['#7de853','#0baa26', '#064711'],
      1: ['#7de853','#0baa26', '#064711'],
      2: ['#7de853','#0baa26', '#064711'],
      3: ['#7de853','#0baa26', '#064711'],
    }
    this.state = {
      name: '',
      email: '',
      insta: '',
      uri: '',
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      isGetting: true,
      noComments: false,
      gradient: this.gradientColors[0],
      isMenuActive: false

    }

  }

  componentWillMount() {
    setTimeout(() => {
      const uid = firebase.auth().currentUser.uid;
      this.uid = uid;
      this.getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(uid);
    }, 200);
    
  }

  updatePushToken = async (uid, token) => {
    var updates = {};
    updates[`/Users/${uid}/pushToken`] = token;
    firebase.database().ref().update(updates);
  }

  getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(your_uid) {
    console.log(your_uid);
    const keys = [];
    //read the value of refreshed cloud db so a user may seamlessly transition from registration to profile page
    firebase.database().ref().on("value", async (snapshot) => {
      var d = snapshot.val();
      let currentUser = d.Users[your_uid];
      // console.log(d.val(), d.Users, your_uid);
      var token = await AsyncStorage.getItem('token');
      if(currentUser.pushToken == undefined && token) {
        this.updatePushToken(your_uid, token);
      }

      if(currentUser.notifications && token) {
        //check if whether this person deserves Upload Item notification
        if(currentUser.profile.isNoob == true) {
          console.log('Send Upload item Notification')
          let message = `Hey ${currentUser.profile.name},\nStill haven't uploaded any items on the NottMyStyle Marketplace? Take the first step to detox your closet and making money by uploading something on the Marketplace today.`,
          notificationDate = new Date();
          notificationDate.setMinutes(notificationDate.getMinutes() + 3);
          PushNotification.localNotificationSchedule({
              message: message,// (required)
              date: notificationDate,
              vibrate: false,
          });
          
        }

        this.shouldSendNotifications(currentUser.notifications);
      }

      var soldProducts = 0;
      var numberProducts=0;
      //relies on fact that when user profile was initially created,
      //we appended a products: '' entry under a particular uid's branch
      //TODO: Make these values a part of the person's profile in case they delete products they've earlier sold.
      if(currentUser.products) {
        for(var p of Object.values(currentUser.products)) {
          if(p.sold) {
            soldProducts++
          }
        }
        
        numberProducts = Object.keys(currentUser.products).length
      }

      // else {
      //   soldProducts = 0;
      //   numberProducts = 0;
      // }
      
      
      var {country, insta, name, size, uri} = currentUser.profile

      var comments;
      if(currentUser.comments) {
        comments = currentUser.comments;
        this.setState({ name, country, uri, insta, numberProducts, soldProducts, comments, isGetting: false })
        // this.setState({comments})
      }
      else {
        this.setState({ name, country, uri, insta, numberProducts, soldProducts, noComments: true, isGetting: false })
      }
      
      // console.log(comments);
      
      // var name = d.Users[your_uid].profile.name;
      // var email = d.Users[your_uid].profile.email;
      // var insta = d.Users[your_uid].profile.insta;

      // console.log(name);
      
    })
    //TODO: line below is Major removal from NMS, uncommenting it may prove unwise
    // .then(() => this.setState({isGetting: false}))

    // ////////////////

    // database.then( (d) => {
      
    //   var soldProducts = 0;
    //   //relies on fact that when user profile was initially created,
    //   //we appended a products: '' entry under a particular uid's branch
    //   for(var p of Object.values(d.Users[your_uid].products)) {
    //     if(p.sold) {
    //       soldProducts++
    //     }
    //   }
      
    //   var numberProducts = Object.keys(d.Users[your_uid].products).length
      
    //   var {country, insta, name, size, uri} = d.Users[your_uid].profile
      
    //   // var name = d.Users[your_uid].profile.name;
    //   // var email = d.Users[your_uid].profile.email;
    //   // var insta = d.Users[your_uid].profile.insta;

    //   console.log(name);
    //   this.setState({ name, country, uri, insta, numberProducts, soldProducts })
    // })
    // .catch( (err) => {console.log(err) })


    //////
    
  }

  shouldSendNotifications(notificationsObj) {
    // var tasks = Object.keys(notificationsObj)
    // tasks.forEach
    var message;
    // var notificationData;
    if(notificationsObj.priceReductions) {
        for(var specificNotification of Object.values(notificationsObj.priceReductions)) {
            if(specificNotification.localNotificationSent == false) {
                let localNotificationProperty = {};
                localNotificationProperty[`/Users/${specificNotification.uid}/notifications/priceReductions/${specificNotification.key}/localNotificationSent/`] = true;
                let promiseToScheduleNotification = firebase.database().ref().update(localNotificationProperty);
                promiseToScheduleNotification.then( () => {
                    // var month = new Date().getMonth() + 1;
                    // var date= new Date().getDate();
                    // var year = new Date().getFullYear();
                    
                    //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                    // notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                    let d = new Date();
                    // notificationDate = d.setDate(d.getDate() + 4)
                    notificationDate = d.setMinutes(d.getMinutes() + 1);
                    // console.log(month, date)
    
                    //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                    // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                    // console.log(message);
                    PushNotification.localNotificationSchedule({
                        message: specificNotification.message,// (required)
                        date: notificationDate,
                        vibrate: false,
                    });
                })
                    
            }

            else {
                console.log('doing nothing')
            }
            
        }
    }

    //TODO: Mirror this for itemSold notification


}

  logOut = () => {
    firebase.auth().signOut().then(() => {
      // var statusUpdate = {};
      // statusUpdate['Users/' + this.uid + '/status/'] = "offline";
      // await firebase.database().ref().update(statusUpdate);
      this.props.navigation.navigate('SignIn');
    })
  }

//   getComments(uid) {
//     console.log(uid);
//     const keys = [];
//     database.then( (d) => {
//       //get name of current user to track who left comments on this persons UserComments component  
//       // var insaanKaNaam = d.Users[firebase.auth().currentUser.uid].profile.name;  
//       // console.log(insaanKaNaam);
//       //get list of comments for specific product
//       // var date = (new Date()).getDate();
//       // var month = (new Date()).getMonth();
//       // var year = (new Date()).getFullYear();
//       // var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: noReviewsText, name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
//       // console.log(comments, typeof month, month);

//     })
//     .then( () => { console.log('here');this.setState( {isGetting: false} );  } )
//     .catch( (err) => {console.log(err) })
    
// }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  showActionSheet = () => {
    // console.log('adding Item')
    this.ActionSheet.show()

  }

  setGradient = (index) => {
    this.setState({gradient: this.gradientColors[index]})
  }

  navToEditProfile = () => {
    this.props.navigation.navigate('CreateProfile', {editProfileBoolean: true})
  }

  toggleMenu = () => {
    this.setState({isMenuActive: !this.state.isMenuActive})
  }

  render() {
    var {isGetting, comments, gradient} = this.state;
    // console.log(comments, 'the user has no comments, perfectly harmless');
    // const gradientColors = ["#a2f76c", "#1c3a09"]
    //kinda like this one
    const gradientColors = ["#c8f966", "#307206", "#1c3a09"]; 
    
    // const gradientColors = [limeGreen,lightGreen, treeGreen];
    // const gradientColors2 = ['#0a968f','#6ee5df', ];

    if(isGetting){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
          <LoadingIndicator isVisible={isGetting} color={lightGreen} type={'Wordpress'}/>
        </View>
      )
    }
 

    return (
      <View style={[styles.mainContainer, {marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
      <View style={styles.headerContainer}>

        <LinearGradient style={styles.linearGradient} colors={gradientColors}>
        
        
        <View style={styles.header}>

         
          <View style={styles.iconColumn}>
            <Icon 
              name="settings" 
              size={30} 
              color={iOSColors.gray}
              onPress={() => this.props.navigation.navigate('Settings')}

            />
            
          </View>  

          <View style={styles.profileColumn}>
            {this.state.uri ?
            <TouchableOpacity onPress={this.navToEditProfile}>
              <ProgressiveImage 
              style= {styles.profilepic} 
              thumbnailSource={ require('../images/blank.jpg') }
              source={ {uri: this.state.uri} }
              
              />
            </TouchableOpacity> 
              : 
              <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
            }
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.pos}>{this.state.country}</Text>
            {this.state.insta ? 
              <Text style={styles.insta}>@{this.state.insta}</Text>
             : 
              null
            } 
          </View>  

          <View style={styles.iconColumn}>

            {this.state.isMenuActive ?
              <Icon 
              name={"chevron-down"} 
              size={40} 
              color={'#fff'}
              onPress={this.toggleMenu}
              
              />
            :
              <Icon 
                name={"logout"} 
                size={30} 
                color={'#020002'}
                onPress={this.toggleMenu}
                
              />
            }
            
            {this.state.isMenuActive ? 
              
              <TouchableOpacity
              underlayColor={'transparent'} 
              onPress={this.logOut}  
              style={styles.popDownMenu}>
              <Text
                  
                style={new avenirNextText('black', 13, "300")}>Log Out</Text>
                
                
              </TouchableOpacity>
              :
              null
              }
          </View>
              

          

        </View>
        

      </LinearGradient>
      </View>

      
      <View style={styles.midContainer}>
        
          <View style={[styles.numberCard, {borderRightWidth: 1}]}>
            <Text onPress={() => {this.props.navigation.navigate('YourProducts')}} style={styles.numberProducts}>{this.state.numberProducts}</Text>
            <Text onPress={() => {this.props.navigation.navigate('YourProducts')}} style={styles.subText}>ON SALE</Text>
          </View>

          {/* <Divider style={{  flex: 1, backgroundColor: graphiteGray, height: 80, marginVertical: 3 }} /> */}

          <View style={[styles.numberCard, {borderLeftWidth: 1}]}>
            <Text onPress={() => {this.props.navigation.navigate('SoldProducts')}} style={styles.numberProducts}>{this.state.soldProducts} </Text>
            <Text onPress={() => {this.props.navigation.navigate('SoldProducts')}} style={styles.subText}>SOLD</Text>
          </View>    
        
      </View>
      
      
      <View style={styles.footerContainer} >
      {/* Reviews Section contained within this flex-box */}
      <ScrollView style={styles.halfPageScrollContainer} contentContainerStyle={styles.halfPageScroll}>
          <View style={ {backgroundColor: '#fff'} }>
          <Text style={styles.reviewsHeader}>REVIEWS</Text>
          {this.state.noComments ? null : Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                        <TouchableHighlight
                        onPress={()=>this.navToOtherUserProfilePage(comments[comment].uid)}
                        style={styles.commentPic}>
                          <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
                        </TouchableHighlight>                          
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <TouchableOpacity onPress={()=>this.navToOtherUserProfilePage(comments[comment].uid)} style={styles.textContainer}>
                            <Text style={ styles.commentName }> {comments[comment].name} </Text>
                            <Text style={styles.comment}> {comments[comment].text}  </Text>
                        </TouchableOpacity>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                      </View>

                      

                      {/* {comments[comment].uri ? <View style={styles.separator}/> : null} */}
                      
                  </View>
                  
              )
                      
              )}
          </View>
        </ScrollView> 

      </View>

            

      </View>
      


    )


  }

}

export default ProfilePage;

// line 143 <Icon name="account-multiple" 
// style={styles.users}
// size={30} 
// color={'#189fe2'}
// onPress={() => this.props.navigation.navigate('Users')}

// />

{/* <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Color Gradient Scheme:'}
            options={['Green', 'Red', 'Blue', 'Black', 'cancel']}
            cancelButtonIndex={4}
            destructiveButtonIndex={4}
            onPress={(index) => { this.setGradient(index) }}
            
            /> */}

const styles = StyleSheet.create({
  
  halfPageScrollContainer: {
    flex: 1,
    width: width,
    backgroundColor: "#fff",
    
  },
  halfPageScroll: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
    justifyContent: 'space-evenly'
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    // marginTop: 18
  },
  headerContainer: {
    flex: 4, //4/7
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // backgroundColor: 'pink'
  },

  linearGradient: {
    flex: 1,
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 0, //maybe not enough padding to lower gear Icon row into view, but that solution would be bad practice
    // backgroundColor: 'white',
    // height: height/1.8,
  },

  iconColumn: {
    flex: 0.25,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    // marginVertical: 25,
    // backgroundColor: 'red'
    // height: 150,
  },

  profileColumn: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 20
  },

  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white'
  },

  popDownMenu: {
    width: 55,
    height: 35,
    borderRadius: 8,
    borderWidth: 0.3,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center'
  },

  gearAndPicColumn: {
    flex: 0.6818,
    flexDirection: 'column',
    // flex: 1.0,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    marginTop: 20,
    // width: width - 40,
    // paddingRight: 0,
    // backgroundColor: 'blue',
    // width: width
  },

  gearRow: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignContent: 'flex-start',
    // backgroundColor: 'white'
  },

  picRow: {
    width: 250,
    flex: 0.8,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignContent: 'flex-start',
    // height: height/5,
    // backgroundColor: 'yellow'
    // alignItems: 'flex-start',
  },

  profileTextColumn: {
    flex: 0.318,
    flexDirection: 'column',
    alignItems: 'center',
    // paddingTop: 15,
    // backgroundColor: 'red'

  },

  midContainer: {
    flex: 1,
    flexDirection: 'row',
    // width: width,
    // height: height/7.5,
    backgroundColor: '#cdcdd6',
    justifyContent: 'center'
  },

  numberCard: {
    flex: 79.5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: graphiteGray,
    // width: width/2 - 20,
    // height: 60,
    //55
    // paddingTop: 20,
    // paddingBottom: 5,
    // paddingLeft: 30,
    // paddingRight: 30,
    
    // borderRadius: 0,
  },

  subText: {
    fontFamily: 'Avenir Next',
    fontSize: 18,
    fontWeight: '400',
    color: graphiteGray,
  },

  footerContainer: {
    flex: 2,
    flexDirection: 'column',
    padding: 2,
    backgroundColor: '#fff'
  },

  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },

  gear: {
    flex: 0,
    paddingRight: 60
  },
  users: {
    flex: 0,
    paddingLeft: 60,
    paddingRight: 0,
    marginLeft: 0
  },
  
  profilepicWrap: {
    backgroundColor: 'black',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 0,
  },
  profilepic: {
    //flex: 1,
    width: 130,
    height: 130,
    alignSelf: 'center',
    borderRadius: 65,
    borderColor: '#fff',
    borderWidth: 0,
    // opacity: 0.1
  },
  name: {
    fontFamily: avenirNext,
    marginTop: 5,
    fontSize: 22,
    color: '#fff',
    fontWeight: 'normal',
    textAlign: 'center'
  },
  numberProducts: {
    fontFamily: avenirNext,
    fontSize: 28,
    color: graphiteGray,
    fontWeight: 'normal'
  },
  soldProducts: {
    fontFamily: avenirNext,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
  ,
  pos: {
    fontFamily: avenirNext,
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    // fontStyle: 'italic'
  },
  insta: {
    fontFamily: avenirNext,
    fontSize: 18,
    color: '#fff',
    fontWeight: '300',
    // fontStyle: 'italic'
  },

  companyLogoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#122021',
  },
  companyLogo: {
    //resizeMode: 'container',
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:0,
    borderWidth: 2,
    marginLeft: (width/4)-10,
    paddingLeft: 25,
    paddingRight: 25

}, 
// naam: {
//   ...iOSUIKit.caption2,
//   fontSize: 11,
//   color: '#37a1e8'

// },

// title: {
//   ...human.headline,
//   fontSize: 20,
//   color: '#656565'
// },

reviewsHeader: {
  fontFamily: 'Avenir Next',
  fontSize: 24,
  fontWeight: "normal",
  textAlign: 'left'
  // paddingLeft: 10
},

commentContainer: {
  flexDirection: 'column',
  borderWidth: 0,
  borderRadius: 10,
  // width: width - 15,
  backgroundColor: "#fff",
  shadowOpacity: 0.5,
  shadowRadius: 1.3,
  shadowColor: 'black',
  shadowOffset: {width: 0, height: 0},
  padding: 5,
  marginVertical: 4

},

commentPicAndTextRow: {
  flexDirection: 'row',
  width: width - 20,
  padding: 10
},

commentPic: {
  //flex: 1,
  width: 70,
  height: 70,
  alignSelf: 'center',
  borderRadius: 35,
  borderColor: '#fff',
  borderWidth: 0
},

commentName: {
  color: highlightGreen,
  fontSize: 16,
  fontWeight: "500",
  textAlign: "left"
},

comment: {
  fontSize: 16,
  color: 'black',
  textAlign: "center",
},  

commentTimeRow: {
  justifyContent: 'flex-end',
  alignContent: 'flex-end',
  alignItems: 'flex-end',
},

commentTime: {
  textAlign: "right",
  fontSize: 16,
  color: 'black'
},

rowContainer: {
  flexDirection: 'column',
  padding: 14
},

textContainer: {
flex: 1,
flexDirection: 'column',
padding: 5,
},

separator: {
width: width,
height: 2,
backgroundColor: '#111110'
},  

});

{/* <TouchableHighlight onPress={() => {firebase.auth().signOut()
                          .then(() => {console.log('sccessfully signed out'); this.props.signOut })
                          .catch((err) => console.log(err)); }}>
              <View>
              <Icon name="exit-to-app" 
                    style={ styles.gear }
                            size={20} 
                            color={'#800000'}

              />
              <Text>Sign Out</Text>
              </View>
            </TouchableHighlight> */}


