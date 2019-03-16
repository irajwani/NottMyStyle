import React, { Component } from 'react'
import { Text, Dimensions, StyleSheet, ScrollView, View, Image, TouchableOpacity, Modal } from 'react-native'
import firebase from '../cloud/firebase';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {material} from 'react-native-typography';

import { lightGreen, coolBlack, highlightGreen, graphiteGray, treeGreen, profoundPink, rejectRed, logoGreen } from '../colors';
import {avenirNextText} from '../constructors/avenirNextText'

import NothingHereYet from '../components/NothingHereYet';
import { LoadingIndicator, CustomTouchableO, WhiteSpace } from '../localFunctions/visualFunctions';

import { withNavigation } from 'react-navigation';

// const express_app_uri = "http://localhost:5000/leaveYourRooms";
const express_app_uri = "https://calm-coast-12842.herokuapp.com/leaveYourRooms"
const noChatsText = "You have not initiated any chats 😳. Choose a product from the marketplace and then converse with the seller about your preferred method of payment (Cash or PayPal), and if whether you'd like the item posted to you or not.";
const DaysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const {width} = Dimensions.get('window');

const pictureWidth = 70, pictureHeight = 70;

const notificationHeaderText = "NottMyStyle";
const noNotificationsText = "The NottMyStyle team believes your products don't warrant any stats yet 👌, thus you have no notifications.";

function removeFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

class Chats extends Component {

  constructor(props) {
    super(props);
    this.state = { chats: [], isGetting: true, noChats: false };
  }

  componentWillMount() {
    var your_uid = firebase.auth().currentUser.uid;
    setTimeout(() => {
      this.getChats(your_uid);
    }, 1000);
  }

  getChats = (your_uid) => {
    firebase.database().ref().on('value', (snapshot) => {
      var d = snapshot.val();
      var chats = d.Users[your_uid].conversations ? d.Users[your_uid].conversations : false;
      chats = chats ? Object.values(chats) : false;
      // console.log(chats);
      this.leaveYourRooms(your_uid);
      this.setState({chats, yourUid: your_uid, noChats: chats ? true : false , isGetting: false});
    })
  }

  leaveYourRooms = (yourUid) => {
    // fetch(express_app_uri).then( res => console.log(res.json()))
    fetch(`${express_app_uri}/?user_id=${yourUid}`)
    .then( (response) => {
      if(response.ok) {
        console.log(response);
      }
      else {
        throw new Error("Failed to connect")
      }
      
      
    })
  }

  // componentDidMount() {

  //   var userIdentificationKey = firebase.auth().currentUser.uid

  //   setTimeout(() => {
  //     this.leaveYourRooms(userIdentificationKey);
  //     this.chatLeaveRoomsRefreshId = setInterval(() => {
  
  //       this.leaveYourRooms(userIdentificationKey);
        
  //       // this.getChats(userIdentificationKey);
  //     }, 60000); //20 seconds
  //   }, 1000);


  //   setTimeout(() => {
  //     this.getChats(userIdentificationKey);
  //     this.chatRefreshId = setInterval(() => {
  
  //       this.getChats(userIdentificationKey);
        
  //       // this.getChats(userIdentificationKey);
  //     }, 45000); //7 seconds
  //   }, 5000);

  //   //TODO: add refresh button so user may refresh chats manually

    
    
  // }

  // componentWillUnmount() {
  //   clearInterval(this.chatRefreshId);
  //   clearInterval(this.chatLeaveRoomsRefreshId);
  // }

  // leaveYourRooms(your_uid) {

  //   firebase.database().ref().once("value", (snapshot) => {
  //     var d = snapshot.val()
  //     //if a uid has a userId with pusher chat kit account
  //     var CHATKIT_USER_NAME = your_uid;
  //     const tokenProvider = new Chatkit.TokenProvider({
  //       url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
  //       query: {
  //         user_id: CHATKIT_USER_NAME
  //       }
  //     });

  //     // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
  //     // For the purpose of this example we will use single room-user pair.
  //     const chatManager = new Chatkit.ChatManager({
  //       instanceLocator: CHATKIT_INSTANCE_LOCATOR,
  //       userId: CHATKIT_USER_NAME,
  //       tokenProvider: tokenProvider
  //     });

  //     chatManager.connect()
  //     .then( (currentUser) => {
  //       console.log('First Connect', currentUser.rooms.length)
  //       this.currentUser = currentUser;
  //       ////////
  //       ///// leave the rooms for which you've blocked Users
  //       ///// use the removeFalsyValues function because some uid keys could have falsy values if one decides to unblock user.
  //       var rawUsersBlocked = d.Users[CHATKIT_USER_NAME].usersBlocked ? d.Users[CHATKIT_USER_NAME].usersBlocked : {};
  //       var usersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
  //       // console.log(usersBlocked);
  //       ///////

  //       if(this.currentUser.rooms.length>1) {
  //         //if any room name has a blockedUser name in it, leave that room
  //         for(let i = 1; i < this.currentUser.rooms.length; i++) { 
  //           this.currentUser.subscribeToRoom({
  //             roomId: this.currentUser.rooms[i].id,
  //             // hooks: {
  //             //   onNewMessage: this.onReceive.bind(this)
  //             // }
  //           }).then( () => {
  //             var {users, id} = this.currentUser.rooms[i];
  //             console.log('BOOOGAAWOOWOWOWA FIRST' + id)
  //             console.log(users);
  //             var buyer = users[0,1].id;
  //             var seller = users[0,0].id;
  //             if(usersBlocked.includes(buyer) || usersBlocked.includes(seller)) {
  //               this.currentUser.leaveRoom({
  //                 roomId: id
  //               })
  //               .then( () => console.log(`user successfully removed from room with ID: ${id}`))
  //               .catch( (err) => console.log(err))
  //             }

  //           })  
            

            
  //         }

  //       }

  //     } )

  //   })
    
  

  // }

  // getChats(your_uid) {
  //   //first generate, and then retrieve chats for particular user
  //   firebase.database().ref().once('value', (snapshot) => {
  //     var d = snapshot.val(); //to get latest products database
  //     var chats = [];
      
  //     //if a uid has a userId with pusher chat kit account
  //     var CHATKIT_USER_NAME = your_uid;
  //     const tokenProvider = new Chatkit.TokenProvider({
  //       url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
  //       query: {
  //         user_id: CHATKIT_USER_NAME
  //       }
  //     });

  //     // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
  //     // For the purpose of this example we will use single room-user pair.
  //     const chatManager = new Chatkit.ChatManager({
  //       instanceLocator: CHATKIT_INSTANCE_LOCATOR,
  //       userId: CHATKIT_USER_NAME,
  //       tokenProvider: tokenProvider
  //     });



  //     chatManager.connect()
  //     .then( (currentUser) => {
  //       console.log('Second Connect', currentUser.rooms.length)
  //       this.currentUser = currentUser;
  //       //TODO: Construct an array of objects where each object contains:
  //       //pictures of product and users, buyer and seller names and Ids
  //       //messages from this room
  //       if(this.currentUser.rooms.length>1) {
  //         var count = 0;
  //         //perform the following process across all rooms currentUser is a part of except for the common Users Room
  //         for(let i = 1; i < this.currentUser.rooms.length; i++) {
            
  //           var {createdByUserId, name, id} = this.currentUser.rooms[i];
  //           console.log('Second BOOOGAAWOOWOWOWA' + this.currentUser.rooms[i]);
            

  //           this.currentUser.fetchMessages({
  //             roomId: id,
  //             direction: "newer",
  //             limit: 1
  //           })
  //           .then( (roomMessages) => {
  //             var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
  //             // console.log(roomMessages);
  //             // const messageIds = [...roomMessages.map(m =>  m.id)];

  //             //Math.max and .min don't accept arrays, but a list of arguments, so we use spread operator to spread values from array as such within the function
  //             // const newestMessageReceivedId = Math.max(...messageIds); 
              
  //             // roomMessages.filter( m => m.id == newestMessageReceivedId )
  //             if(roomMessages.length > 0) {
  //               lastMessageText = (roomMessages['0'].text).substr(0,40);
  //               lastMessageDate = new Date(roomMessages['0'].updatedAt).getDay();
  //               lastMessageSenderIdentification = roomMessages['0'].senderId;
  //             }

  //             // console.log(lastMessageDate)
  //             var productSellerId, productText, productImageURL;
            
  //             d.Products.forEach( (prod) => {
  //                 //given the current Room Name, we need the product key to match some part of the room name
  //                 //to obtain the correct product's properties
  //                 //note that we only want the product's properties here so it doesn't matter if this loop
  //                 //comes across ProductKeyX.someBuyer1 or ProductKeyX.someBuyer2
  //                 if(name.includes(prod.key)) { productSellerId = prod.uid, productText = prod.text; productImageURL = prod.uris[0]; }
  //             })
  //             this.currentUser.subscribeToRoom({
  //               roomId: id,
  //               // hooks: {
  //               //   onNewMessage: this.onReceive.bind(this)
  //               // }
  //             })
  //             .then( () => {
  //               var {users} = this.currentUser.rooms[i]
  //               console.log(users);
  //               // console.log(name, id);
                
                
  //               var obj;
  //               // var chatUpdates = {};
  //               var buyerIdentification = users[0,1].id;
  //               var buyer = users[0,1].name;
  //               var buyerAvatar = users[0,1].avatarURL ? users[0,1].avatarURL : '';
  //               var sellerIdentification = users[0,0].id;
  //               var seller = users[0,0].name;
  //               var sellerAvatar = users[0,0].avatarURL ? users[0,0].avatarURL : '';
  //               obj = { 
  //                 productSellerId: productSellerId, productText: productText, productImageURL: productImageURL, 
  //                 createdByUserId: createdByUserId, name: name, id: id, 
  //                 buyerIdentification, sellerIdentification,
  //                 seller: seller, sellerAvatar: sellerAvatar, 
  //                 buyer: buyer, buyerAvatar: buyerAvatar,
  //                 lastMessageText, lastMessageDate, lastMessageSenderIdentification
  //               };
  //               chats.push(obj);
  //               if(count == this.currentUser.rooms.length - 2){
  //                 console.log(count, 'all done')
  //                 this.setState({chats, yourUid: your_uid, noChats: false, isGetting: false});
  //                 // return null
  //               }
    
  //               else {
  //                 count++;
  //               }
  
  //               //TODO: Perhaps no need for firebase update
  //               // chatUpdates['/Users/' + CHATKIT_USER_NAME + '/chats/' + i + '/'] = obj;
  //               // firebase.database().ref().update(chatUpdates);
  //               console.log(i, 'complete', this.currentUser.rooms.length)
  //             });  
              
  //           })
            
              
            
            
            

        

  //       }
  //       // console.log(chats);
        
  //       }

  //     else {
  //       // console.log('NO CHATS');
  //       this.setState({noChats: true, isGetting: false})
  //     }
      
  //     })


  //   })
  //   .catch( (err) => {console.log('error with getChats' + err) })
    
  // }

  navToChat(chat) {
    const {productSellerId, id, buyer, seller, buyerAvatar, sellerAvatar, buyerIdentification, sellerIdentification} = chat;
    this.props.navigationProperty.navigate('CustomChat', {productSellerId, id, buyer, buyerAvatar, seller, sellerAvatar, buyerIdentification, sellerIdentification })
  }

//   navToNotifications() {
//     this.props.navigation.navigate('Notifications')
//   }

  handleLongPress = (key) => {
    const state = {...this.state};
    state.chats[key].selected = !state.chats[key].selected;
    // console.log(state.chats[key].selected);
    this.setState(state);
    // const chat = state.chats.find( chat => chat.name == key);
    // state.chats.selected = !state.

    
  }

  deleteConversation = (chat) => {
    const {id, buyerIdentification, sellerIdentification} = chat;
    var buyerRef = '/Users/' + buyerIdentification + '/conversations/' + id + '/';
    var sellerRef = '/Users/' + sellerIdentification + '/conversations/' + id + '/';
    let promiseToDeleteBuyerRef = firebase.database().ref(buyerRef).remove();
    let promiseToDeleteSellerRef = firebase.database().ref(sellerRef).remove();
    Promise.all([promiseToDeleteBuyerRef, promiseToDeleteSellerRef])
    .then( ()=>{
      // console.log('Done deleting conversations for both buyer and seller');
      setTimeout(() => {
        this.getChats(this.state.yourUid);
      }, 500);
    })
    .catch( err => console.log(err));
  }

  // r = () => {
  //   return (
  //     <View style={{flexDirection: 'row', flex: 0.15, }}>
  //       <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
  //         <Text style={styles.upperNavTabText}>Chats</Text>
  //       </View>
  //       <View style={{}}>

  //       </View>
  //     </View>
  //   )
  // }

  

  renderChats = (chats) => {

      return(chats.map( (chat, index) => 
        (
         <TouchableOpacity 
         key={index} style={styles.specificChatExpandedContainer}
         onPress={() => this.navToChat(chat)}
         >

          <View  style={styles.specificChatContainer}>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={styles.pictureContainer}>
              <Image 
              source={this.state.yourUid == chat.sellerIdentification ? chat.buyerAvatar ? {uri: chat.buyerAvatar } : require('../images/blank.jpg') : chat.sellerAvatar ? {uri: chat.sellerAvatar } : require('../images/blank.jpg')   } 
              style={[styles.picture, {borderRadius: 37}]} />
            </TouchableOpacity>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={styles.textContainer}>
              <Text style={styles.otherPersonName}>{this.state.yourUid == chat.sellerIdentification ? (chat.buyer.split(' '))[0] : (chat.seller.split(' '))[0] }</Text>
              <Text style={styles.lastMessageText}>
              {chat.lastMessage.lastMessageText ? this.state.yourUid == chat.sellerIdentification ? `${(chat.buyer.split(' '))[0]}: ${chat.lastMessage.lastMessageText.substring(0,60)}` : `${(chat.seller.split(' '))[0]}: ${chat.lastMessage.lastMessageText.substring(0,60)}` : "Empty conversation"}
              </Text>
              <Text style={styles.lastMessageDate}>{DaysOfTheWeek[chat.lastMessage.lastMessageDate]}</Text>
            </TouchableOpacity>

            <TouchableOpacity onLongPress={() => this.handleLongPress(index)} onPress={() => this.navToChat(chat)} style={styles.pictureContainer}>
              <Image source={ {uri: chat.productImageURL }} 
              style={styles.picture} />
            </TouchableOpacity>

          </View>

          {chat.selected ? 
              
            <CustomTouchableO extraStyles={styles.deleteConversationButton} color={rejectRed} text={"Delete Conversation"} textSize={22} textColor={'#fff'} 
              onPress={() => this.deleteConversation(chat)} 
              disabled={false} 
            />
            
          :
            null
          }

         </TouchableOpacity>

          

         
          
        )
      ))
    
      // chats.map( (chat) => {
      //   return(
      //     <View key={chat.name} style={{flexDirection: 'column', padding: 5}}>
      //       <View style={styles.separator}/>
      //       <View style={styles.rowContainer}>
              
      //         <Image source={ {uri: chat.productImageURL }} style={[styles.productprofilepic, styles.productcolor]} />
              
      //         <View style={styles.infoandbuttoncontainer}>
      //           <Text style={[styles.info, styles.productinfo]}>Chat Between:</Text>
      //           <Text style={[styles.info, styles.sellerinfo]}>{(chat.seller.split(' '))[0]} & {(chat.buyer.split(' '))[0]}</Text>
      //           <View style={styles.membersRow}>
                  
      //               <Image source={ chat.sellerAvatar ? {uri: chat.sellerAvatar } : require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
      //               <Image source={ chat.buyerAvatar ? {uri: chat.buyerAvatar } : require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
                  
      //           </View>   
      //         </View>

      //         <Button
      //               small
      //               buttonStyle={styles.messagebutton}
      //               icon={{name: 'forum', type: 'material-community'}}
      //               title="TALK"
      //               onPress={() => { this.navToChat(chat) } } 
      //         />  
                

      //       </View>
      //       <View style={styles.separator}/>
      //     </View>
          
      //   )
          
      //   })
    
  }
  
  render() {
    const {chats} = this.state
    if(this.state.isGetting) {
      return ( 
        <View style={styles.LoadingIndicatorContainer}>
          <LoadingIndicator isVisible={this.state.isGetting} color={'black'} type={'Wordpress'}/>
        </View>  
        
      )
    }

    if(this.state.chats == false) {
      return (
        
          <View style={[styles.screen, {padding: 10, }]}>
            
          </View>
        
      )
    }
    else {
      return (
        
          <ScrollView
            style={styles.screen} 
            contentContainerStyle={styles.cc}
          >
            {this.renderChats(chats)}
          </ScrollView>
        
      )
    }
    
  }
}

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state={isGetting:true, noNotifications: false, showDetails: false, details: false, notificationType: false};
    }
  
    componentWillMount() {
      setTimeout(() => {
        this.getNotifications();
      }, 1000);
    }
  
    // navToChats() {
    //     this.props.navigation.navigate('Chats');
    // }
  
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
  
    renderNotifications = () => {
      var {notifications} = this.state;
      //function executed if you have at least one notification of any variety
      //for each variety, similar UI but callbacks are different
      return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.cc}>
          {notifications.priceReductions ? this.r(notifications.priceReductions, 'Price Reduction Alert') : null}
          {notifications.purchaseReceipts ? this.r(notifications.purchaseReceipts, 'Purchase Receipt') : null}
          {notifications.itemsSold ? this.r(notifications.itemsSold, 'Item Sold!') : null}
          {this.renderDetailsModal()}
        </ScrollView>
        
      )
    }
  
    r = (notifs, notificationType) => {
        // console.log(notifs);
    //   console.log("OVER HEYAAAA" + notifs[0].uri);
      return Object.keys(notifs).map((notification, index) => (
            
            <View key={index} style={styles.specificChatContainer}>
  
              <TouchableOpacity onPress={() => this.showDetails(notifs[notification],notificationType)} style={styles.pictureContainer}>
                <Image 
                source={require("../images/nottmystyleLogo.png")} 
                style={[styles.picture, {borderRadius: 35}]} />
              </TouchableOpacity>
  
              <TouchableOpacity onPress={() => this.showDetails(notifs[notification],notificationType)} style={styles.textContainer}>
                <Text style={styles.otherPersonName}>{notificationHeaderText}</Text>
                <Text style={styles.lastMessageText}>{notificationType}</Text>
                
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.pictureContainer}>
                <Image source={{uri: notifs[notification].uri }} 
                style={styles.picture} />
              </TouchableOpacity>
  
            </View>
            ))
  
    }
  
    showDetails = (details, notificationType) => {
      //when one selects a specific notification, use the notificationType to determine what structure of details
      //to expect and use the details themselves of course, so set these 2 values in state
      console.log('show notification details');
      // let promiseToMarkRead = firebase.database
      this.setState({showDetails: true, details, notificationType, })
    }

    renderDetailsModal = () => {

      const {notificationType, details} = this.state;
      const {deliveryOptionBody} = styles
      
      if(notificationType=="Item Sold!"){
        return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showDetails}
        >
        <View style={styles.deliveryOptionModal}>

          <View style={styles.deliveryOptionHeader}>
                
            <FontAwesomeIcon
              name='arrow-left'
              size={1}
              color={logoGreen}
              />

            <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
            

            <FontAwesomeIcon
              name='close'
              size={28}
              color={'black'}
              onPress = { () => { 
                  this.setState({showDetails: false })
                  } }
              />

          </View>

          <View style={[deliveryOptionBody, {padding: 10}]}>
            <Image source={{uri: details.uri}} style={styles.detailsImage} />
            <Text style={new avenirNextText('black', 18, "300", "left")}>
            Congratulations! Your item, {details.name} has been sold successfully for £{details.price} to {details.buyerName}.
            </Text>
            <WhiteSpace height={10}/>
            {details.address ?
              <Text>
            The buyer's address is:
            {details.address.addressOne + ", " + details.address.addressTwo + ", " + details.address.city + ", " + details.address.postCode}
            </Text>
            :
            null
            }
            {details.address ? <WhiteSpace height={10}/> : null}
            <Text>
            We recommend you send the item over ASAP. after which your payment will be transferred via PayPal.
            </Text>
          </View>
              

          

        </View>
        </Modal>
      )
    }

      else if(notificationType=="Purchase Receipt") {
        
        return (
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showDetails}
          >
          <View style={styles.deliveryOptionModal}>
  
            <View style={styles.deliveryOptionHeader}>
                  
              <FontAwesomeIcon
                name='arrow-left'
                size={1}
                color={logoGreen}
                />
  
              <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.setState({showDetails: false })
                    } }
                />
  
            </View>
  
            <View style={[deliveryOptionBody, {padding: 10}]}>
              <Image source={{uri: details.uri}} style={styles.detailsImage} />
              <Text style={styles.detailsText}>
              Congratulations! You have successfully bought {details.name} for £{details.price}.
              </Text>
              <WhiteSpace height={10}/>
              <Text style={styles.detailsText}>
              Your item will be delivered to:
              {details.address.addressOne + ", " + details.address.addressTwo + ", " + details.address.city + ", " + details.address.postCode}.
              </Text>
              <WhiteSpace height={10}/>
              <Text style={styles.detailsText}>
              Please note that it may take up to 2 weeks for the item to arrive via postal delivery. In case your item doesn't arrive, send us an email at nottmystyle.help@gmail.com.
              </Text>
            </View>
                
  
            
  
          </View>
          </Modal>
        )
      }

      else {
        return (
          <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showDetails}
          >
          <View style={styles.deliveryOptionModal}>
  
            <View style={styles.deliveryOptionHeader}>
                  
              <FontAwesomeIcon
                name='arrow-left'
                size={1}
                color={logoGreen}
                />
  
              <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.setState({showDetails: false })
                    } }
                />
  
            </View>
  
            <View style={[deliveryOptionBody, {padding: 10}]}>
              
            </View>
                
  
            
  
          </View>
          </Modal>
        )
      }
      



    }
  
    render() {
      const {isGetting, noNotifications, notifications} = this.state;
      console.log(notifications);
      if(isGetting) {
          return (
            <View style={styles.LoadingIndicatorContainer}>
                <LoadingIndicator isVisible={isGetting} color={'black'} type={'Wordpress'}/>
            </View>
              
            
          )
      }
  
      if(noNotifications) {
        return (
        
            <View style={{flex: 0.85, padding: 10}}>
              <NothingHereYet specificText={noNotificationsText}/>
            </View>
              
        )
      }
  
      return this.renderNotifications()

    }
  }

class NotificationsAndChats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChats: true
        }
    }

    renderUpperNavTab = () => {
        return (
          <View style={styles.upperNavTab}>
    
            <TouchableOpacity disabled={this.state.showChats ? true : false} onPress={()=>this.setState({showChats: true})} style={[styles.upperNavTabButton, this.state.showChats ? {borderBottomColor: highlightGreen, borderBottomWidth: 1} : null]}>
              <Text style={[styles.upperNavTabText, this.state.showChats ? {color: highlightGreen} : null]}>Chats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity disabled={this.state.showChats ? false : true} onPress={()=>this.setState({showChats: false})} style={[styles.upperNavTabButton, !this.state.showChats ? {borderBottomColor: highlightGreen, borderBottomWidth: 1} : null]}>
              <Text style={[styles.upperNavTabText, !this.state.showChats ? {color: highlightGreen} : null]}>Notifications</Text>
            </TouchableOpacity>
            
          </View>
        )
      }

    render() {
        return (
            <View style={styles.container}>
                {this.renderUpperNavTab()}
                {this.state.showChats ?
                  <Chats navigationProperty={this.props.navigation}/>
                :
                  <Notifications/>
                }
            </View>
        )
    }
}

export default withNavigation(NotificationsAndChats);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 22,
  },
  upperNavTab: {
    flex: 0.15,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  upperNavTabButton: {
    // backgroundColor: ,
    // width: navTabButtonWidth,
    // height: 50,
    
    // borderWidth: 1.3,
    // borderRadius: 30,
    // borderColor: "#fff",
    flex: 0.5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  upperNavTabText: new avenirNextText('black', 18, "300"),
  ////////////////
  screen: { flex: 0.85, backgroundColor: '#fff' },

  cc: {
    paddingHorizontal: 6, alignItems: 'center'
  },

  specificChatExpandedContainer: {
    flexDirection: 'column',
  },

  specificChatContainer: {
    flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 0,
    borderBottomColor: graphiteGray, borderBottomWidth: 0.6,
    width: width - 8,

  },

  pictureContainer: {
    flex: 0.25,
    alignItems: 'center'
  },

  picture: {
    width: pictureWidth,
    height: pictureHeight,
  },

  textContainer: {
    flex: 0.5,
  },

  otherPersonName: new avenirNextText(false, 15, '500', 'left'),

  lastMessageText: new avenirNextText(graphiteGray, 13, '400'),

  lastMessageDate: new avenirNextText(treeGreen, 11, '300'),

  deleteConversationButtonContainer: {
    flexDirection: 'row',
    borderBottomColor: graphiteGray,
    borderBottomWidth: 0.5,

  },

  deleteConversationButton: {
    padding: 10,
    alignItems: 'center'
    // position: 'absolute'
  },

  ////////
  ////Notification Details Modal
  deliveryOptionModal: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: 22
  },
  
  deliveryOptionHeader: {
    flex: 0.1,
    //TODO: find nottGreen hex code
    backgroundColor: logoGreen,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },

  deliveryOptionBody: {
    flex: 0.75,
    padding: 10,
    alignItems: 'center'
    // backgroundColor: ''
  },

  logo: {
    width: 45,
    height: 45,
  },

  detailsImage: {
    width: 120,
    height: 120,
  },

  detailsText: new avenirNextText("black", 18, "300", "left"),



  ///////


  LoadingIndicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff'},

  // rowContainer: {
  //   flexDirection: 'row',
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   paddingLeft: 5,
  //   paddingRight: 5,
  //   justifyContent: 'space-evenly',
  //   alignItems: 'center',
  //   backgroundColor: '#fff'
  // },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  productprofilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:95,
    height:95,
    backgroundColor:'#fff',
    borderRadius: 48,
    borderWidth: 2
  },
  profilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:35,
    height:35,
    backgroundColor:'#fff',
    borderRadius: 18,
    borderWidth: 0.4

},
  profilecolor: {
    borderColor: '#187fe0'
  },
  productcolor: {
    borderColor: '#86bb71'
  },
infoandbuttoncontainer: {
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  padding: 10,
  //paddingTop: 5,
  //paddingBottom: 5,
},
info: {
  ...material.subheading,
},  
productinfo: {
  color: "black",
  fontSize: 11,
  fontFamily: 'Iowan Old Style',
},
sellerinfo: {
  fontSize: 13,
  color: "#185b10",
  fontFamily: 'Times New Roman'
},
messagebutton: {
  backgroundColor: "#185b10",
  width: 75,
  height: 45,
  borderWidth: 2,
  borderRadius: 5,
  borderColor: "#185b10"
},
separator: {
  backgroundColor: 'black',
  width: width,
  height: 4
},  
})


{/* <View style={styles.infoandbuttoncontainer}>
                    <Text style={[styles.info, styles.productinfo]}>{chat.productText.name}</Text>
                    <Text style={[styles.info, styles.sellerinfo]}>From: {(chat.seller.split(' '))[0]}</Text>
                    <Button
                      small
                      buttonStyle={styles.messagebutton}
                      icon={{name: 'email', type: 'material-community'}}
                      title="TALK"
                      onPress={() => { this.navToChat(chat.id) } } 
                    />
                  </View>

                {chat.sellerAvatar ?
                  <Image source={ {uri: chat.sellerAvatar } } style={[styles.profilepic, styles.profilecolor]} />
                  :
                  <Image source={ require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
                }   */}

