import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { LoadingIndicator } from '../localFunctions/visualFunctions';
import { lightGreen } from '../colors';
import firebase from '../cloud/firebase';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
      super(props);
      
  }

  componentDidMount = () => {
    this.showAppOrAuth();
  }

  updateOnConnect = () => {
    var connectionRef = firebase.database().ref('.info/connected');
    // var disconnectionRef = firebase.database().ref().onDisconnect();
    connectionRef.on('value', (snap)=>{
      if(snap.val() === true) {
        this.updateStatus('online');
      }
      
    })

    // let update = {};
    // update['/Users/' + this.uid + '/status/'] = "offline";
    // disconnectionRef.update(update);


    // firebase.database().ref('/Users/' + this.uid + '/').onDisconnect( (connectionStatus) => {
    //   console.log('CONNECTION STATUS: ' + connectionStatus);
    //   let status = 'online';
    //   this.updateStatus(status);
    // })
  }

  updateStatus = (status) => {
    console.log("CONNECTION STATUS: " + status);
    var statusUpdate = {};
    statusUpdate['/Users/' + this.uid + '/status/'] = status;
    firebase.database().ref().update(statusUpdate);
    // if(!this.uid) {
    //   return
    // }
    // else {
    //   var statusUpdate = {};
    //   statusUpdate['/Users/' + this.uid + '/status/'] = status;
    //   firebase.database().ref().update(statusUpdate);
    // }
  }

  showAppOrAuth = () => {
    var unsubscribe = firebase.auth().onAuthStateChanged( async ( user ) => {
        unsubscribe();
        if(user) {
          console.log("USER IS: " + user);
          this.uid = await user.uid;
          await this.updateOnConnect();
          this.props.navigation.navigate('AppStack');
        }
        else {
          console.log("USER DISCONNECTED")
          await this.updateOnConnect();
          this.props.navigation.navigate('AuthStack');
        }
        // this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
        // if(user) {
          
        //   var unreadCount = false
          
        //   firebase.database().ref(`/Users/${user.uid}/`).once('value', (snap) => {
        //     var d = snap.val();

        //     if(d.notifications.priceReductions) {
        //       console.log("Notifications length: " + Object.keys(d.notifications.priceReductions).length)
        //       // unreadCount = Object.keys(d.notifications.priceReductions).length; 
        //       Object.values(d.notifications.priceReductions).forEach( (n) => {
        //         if(n.unreadCount) {
        //           unreadCount = true //in this case we only care if whether at least one notification has this property
        //         }
        //       })
              
        //     }

        //   })
        //   .then(() => {
        //     this.props.navigation.navigate('Profile', {unreadCount: unreadCount});
        //   })
        //   .catch( (e) => {
        //     console.log(e);
        //   })
          
        // }

        // else {
        //   this.props.navigation.navigate('AuthStack');
        // }
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', marginTop: Platform.OS == 'ios' ? 22 : 0, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingIndicator isVisible={true} color={lightGreen} type={'Wordpress'} />
      </View>
    )
  }
}

// const styles = StyleSheet.create({

// })
