import React, { Component } from 'react'
import { Dimensions, View, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import {withNavigation} from 'react-navigation'; // Version can be specified in package.json
import { Text,  } from 'native-base';
import { Hoshi } from 'react-native-textinput-effects'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { material, iOSUIKit, iOSColors } from 'react-native-typography'
import firebase from '../cloud/firebase.js';
// import {database} from '../cloud/database';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import SelectMultiple from 'react-native-select-multiple';

// import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
// import FacebookTabBar from './FacebookTabBar'

// import PushNotification from 'react-native-push-notification';
import { PacmanIndicator } from 'react-native-indicators';
import { graphiteGray, lightGreen, rejectRed, treeGreen, avenirNext, optionLabelBlue, almostWhite } from '../colors.js';
import NothingHereYet from './NothingHereYet.js';

const noProductsOfYourOwnText = "So far, you have not uploaded any items on the marketplace.\nTo make some cash 🤑 and free up closet space, upload an article of clothing on the Market\nfrom the 'Sell' screen.";
const emptyCollectionText = "Thus far, you have not liked any of the products on the marketplace 💔.";
const noResultsFromSearchText = "Your search does not match the description of any product on the marketplace 🙁.";
const noResultsFromSearchForSpecificCategoryText = "Your search does not match the description of any product for this specific category 🙁.";

const timeToRefresh = 2000;
var {height, width} = Dimensions.get('window');
const cardWidth = 145;
const cardHeight = 190;

function removeKeysWithFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

function extractValuesFrom(arr) {
  var values = [];
  arr.forEach( (obj, index, array) => {
    values.push(obj.value)
    console.log(values)
  } )
  return values;
}

const limeGreen = '#2e770f';
const profoundPink = '#c64f5f';

class Products extends Component {
  constructor(props) {
      super(props);
      this.state = {
        noProducts: false,
        emptyMarket: false,
        emptyCollection: false,
        refreshing: false,
        isGetting: true,
        activeSectionL: false,
        activeSectionR: false,
        collapsed: true,
        navToChatLoading: false,
        ///////
        ///////
        filters: '',
        showFilterModal: false,
        activeFilterSection: false,
        selectedBrand: '',
        brandSearchTerm: '',
        selectedBrands: [],
        selectedTypes: [],
        selectedSizes: [],
      };
      //this.navToChat = this.navToChat.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      console.log('Mounting Products Component')
      //TODO: Maybe this function is being called too many times which leads to way too many notifications?
      // this.initializePushNotifications();
    }, 1000);
    setTimeout(() => {
      this.getPageSpecificProducts([], [], []);
    }, 100);
  }

  // componentDidMount() {
  //   this.dataRetrievalTimerId = setInterval( 
  //     () => this.getPageSpecificProducts(), 
  //     300000) //approximately every 5 minutes
  // }

  // componentWillUnmount() {
  //   clearInterval(this.dataRetrievalTimerId);
  // }

  // initializePushNotifications = () => {
  //   PushNotification.configure({

  //     // (optional) Called when Token is generated (iOS and Android)
  //     onRegister: function(token) {
  //         console.log( 'TOKEN:', token );
  //     },
  
  //     // (required) Called when a remote or local notification is opened or received
  //     onNotification: function(notification) {
  //         const {userInteraction} = notification;
  //         console.log( 'NOTIFICATION:', notification, userInteraction );
  //         if(userInteraction) {
  //           //this.props.navigation.navigate('YourProducts');
  //           alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
  //         }
          
  //         //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
  //     },
  
  //     // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
  //     //senderID: "YOUR GCM SENDER ID",
  
  //     // IOS ONLY (optional): default: all - Permissions to register.
  //     permissions: {
  //         alert: true,
  //         badge: true,
  //         sound: true
  //     },
  
  //     // Should the initial notification be popped automatically
  //     // default: true
  //     popInitialNotification: true,
  
  //     /**
  //       * (optional) default: true
  //       * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //       * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //       */
  //     requestPermissions: true,
  // });


  // }
  
  // shouldSendNotifications(arrayOfProducts, your_uid) {
  //   for(var product of arrayOfProducts) {
  //     if(product.shouldReducePrice) {
  //       console.log('should reduce price');
  //       var date = new Date(Date.now() + (1200 * 1000)) // in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
  //       var message = `Nobody has initiated a chat with you about your product named, ${product.text.name}, since its submission on the market ${product.daysElapsed} days ago 🤔. Perhaps you should change it's selling price?`;

  //       PushNotification.localNotificationSchedule({
  //         message: message,// (required)
  //         date: date,
  //         vibrate: false,
  //       });

  //       var postData = {
  //         name: product.text.name,
  //         price: product.text.price,
  //         uri: product.uris[0],
  //         daysElapsed: product.daysElapsed,
  //         message: message,
  //         date: date,
  //       }
  //       var notificationUpdates = {};
  //       notificationUpdates['/Users/' + your_uid + '/notifications/' + product.key + '/'] = postData;
  //       firebase.database().ref().update(notificationUpdates);
  //     }
  //   }
  // }


  getPageSpecificProducts = (selectedBrands, selectedTypes, selectedSizes) => {
    
    const keys = [];
    firebase.database().ref().on("value", (snapshot) => {
      var d = snapshot.val();
      console.log('retrieving array of products')
      //Only pull the products that are in this user's collection for the WishList tab.
      const {showCollection, showYourProducts} = this.props;
      const uid = firebase.auth().currentUser.uid;

      var productKeys = d.Users[uid].products ? Object.keys(d.Users[uid].products) : [];
      var noProducts = false;
      if(productKeys.length == 0) {noProducts = true}
      //need to filter d.Users.uid.collection for only those keys that have values of true
      //get collection keys of current user
      var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      var rawCollection = collection ? collection : {}
      var collectionKeys = removeKeysWithFalsyValuesFrom(rawCollection);
      var emptyCollection = false;
      if(collectionKeys.length == 0) {emptyCollection = true}    
      var all = d.Products;

      //var filters = [{header: "Brand", values: []}, {header: "Type", values: []}, {header: "Size", values: []},];
      
      // all = selectedBrand == '' ? all : all.filter( (product) => product.text.brand == selectedBrand );


      //OF COURSE, the FIRST/TOP level of "filtering" that dictates what products are displayed is if whether:
      //Viewing all products, only liked products, or your products
      // var yourProducts = all.filter((product) => productKeys.includes(product.key) );
      //console.log(all, showCollection, showYourProducts);
      if(showCollection == true) {
        all = all.filter((product) => collectionKeys.includes(product.key) );
      }

      if(showYourProducts == true) {
        // setTimeout(() => {
        //   this.initializePushNotifications();
        // }, 200);

        // setTimeout(() => {
        //   this.shouldSendNotifications(yourProducts, uid);
        // }, 3000);
        //we need to identify which products have a notification set to True for a price reduction
        //loop over yourProducts and if you have a shouldReducePrice boolean of true, then schedule a notification for this individual for after thirty minutes
        
        all = all.filter((product) => productKeys.includes(product.key) );
      }

      //Second Level is to extract list of information to be displayed in the filterModal
      //first extract the list of current brands:
      var brands = [];
      var types = ['Formal Shirts', 'Casual Shirts', 'Jackets', 'Suits', 'Trousers', 'Jeans', 'Shoes', 'Watches', 'Bracelets', 'Jewellery', 'Sunglasses', 'Handbags', 'Tops', 'Skirts', 'Dresses', 'Coats'];
      var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Extra Extra Large'];

      all.forEach((product)=> {
        brands.push(product.text.brand);
      })
      //TODO: problematic search? right now results are strings that include your searched for string
      // brands = brands.filter( (brand) => brand.includes(brandSearchTerm) ) 
      brands = brands.filter(onlyUnique);

      //Third Level is optional and will be enforced when user has a selectedValue to filter products
      all = selectedBrands.length > 0 ? all.filter( (product) => selectedBrands.includes(product.text.brand)) : all;
      all = selectedTypes.length > 0 ? all.filter( (product) => selectedTypes.includes(product.text.type)) : all;
      all = selectedSizes.length > 0 ? all.filter( (product) => selectedSizes.includes(product.text.size)) : all;

      //After all this filtering, it could be the case that no results match your criteria,
      var emptyMarket = false;
      if(all.length == 0) {emptyMarket = true}

      //Final Level is to sort the products in descending order of the number of likes
      all = all.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
      var name = d.Users[uid].profile.name;
      var productsl = all.slice(0, (all.length % 2 == 0) ? all.length/2  : Math.floor(all.length/2) + 1 )
      var productsr = all.slice( Math.round(all.length/2) , all.length + 1);
      this.setState({ noProducts, emptyCollection, emptyMarket, types, sizes, brands, productsl, productsr, name, collectionKeys, productKeys, isGetting: false, });

    })
    
    
    
    // .then( () => { console.log('finished loading');this.setState( {isGetting: false} );  } )
    // .catch( (err) => {console.log(err) })
    
  }

  incrementLikes(likes, uid, key) {
    //func applies to scenario when heart icon is gray
    //add like to product, and add this product to user's collection; if already in collection, modal shows user
    //theyve already liked the product
      //add to current users WishList
      //add a like to the sellers likes count for this particular product
      //unless users already liked this product, in which case, dont do anything
      if(this.state.collectionKeys.includes(key) == true) {
        console.log('show modal that users already liked this product')
        alert("This product is already in your collection.")
      } 
      else {
        var userCollectionUpdates = {};
        userCollectionUpdates['/Users/' + firebase.auth().currentUser.uid + '/collection/' + key + '/'] = true;
        firebase.database().ref().update(userCollectionUpdates);
        //since we don't want the user to add another like to the product,
        //tack on his unique contribution to the seller's product's total number of likes
        var updates = {};
        likes += 1;
        var postData = likes;
        updates['/Users/' + uid + '/products/' + key + '/likes/'] = postData;
        firebase.database().ref().update(updates);
        //locally reflect the updated number of likes and updated collection of the user,
        // by re-pulling data from the cloud
        alert("This product has been added to your WishList 💕.");
        setTimeout(() => {
          this.getPageSpecificProducts([], [], []);  
        }, timeToRefresh);
        

        ////
        // const {productsl, productsr} = this.state;
        
        // productsl.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   } 
        //   return null;
        // })

        // productsr.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   }
        //   return null;
        // })
        // //need to also append it to your list of collection keys

        // this.setState({ productsl, productsr } );
        //////
        


      }
      
    
  }

  decrementLikes(likes, uid, key) {
    //this func applies when heart icon is red
    console.log('decrement number of likes');
    var userCollectionUpdates = {};
    userCollectionUpdates['/Users/' + firebase.auth().currentUser.uid + '/collection/' + key + '/'] = false;
    firebase.database().ref().update(userCollectionUpdates);
  //   firebase.database().ref('/Users/' + firebase.auth().currentUser.uid + '/collection/' + key)
  //   .remove( 
  //     ()=>{
  //     console.log('product has been deleted from collection Keys');
  // });
    //ask user to confirm if they'd like to unlike this product
    var updates = {};
    likes -= 1;
    var postData = likes;
    updates['/Users/' + uid + '/products/' + key + '/likes/'] = postData;
    firebase.database().ref().update(updates);
    alert("This product has been removed from your WishList 💔.");
    setTimeout(() => {
      this.getPageSpecificProducts([], [], []);  
    }, timeToRefresh);
    //locally reflect the updated number of likes and updated collection of the user,

    /////////
    // const {productsl, productsr} = this.state;
        
    // productsl.forEach( (product) => {
    //   if(product.key == key) {
    //     product.text.likes -= 1;
    //   } 
    //   return null;
    // })

    // productsr.forEach( (product) => {
    //   if(product.key == key) {
    //     product.text.likes -= 1;
    //   }
    //   return null;
    // })
    // //need to remove this products key from user's collection Keys
    // //var collectionKeys = this.state.collectionKeys.filter( (productKey) => productKey !== key)


    // this.setState({ productsl, productsr } );
    //////////
  }

  navToProductDetails(data, collectionKeys, productKeys) {
      this.props.navigation.navigate('ProductDetails', {data: data, collectionKeys: collectionKeys, productKeys: productKeys})
  }


  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSectionL = section => {
    this.setState({ activeSectionL: section });
  };

  setSectionR = section => {
    this.setState({ activeSectionR: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.card, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >

        <View style={styles.productImageContainer}>
            <View style={styles.likesRow}>
              {/* if this product is already in your collection, you have the option to dislike the product,
                  reducing its total number of likes by 1,
                  and remove it from your collection. If not already in your collection, you may do the opposite. */}
              {this.state.collectionKeys.includes(section.key) ? 
                <Icon name="heart" 
                          size={25} 
                          color='#800000'
                          onPress={() => {this.decrementLikes(section.text.likes, section.uid, section.key)}}
                          

                /> 
              :  
                <Icon name="heart-outline" 
                          size={25} 
                          color='#800000'
                          onPress={() => {this.incrementLikes(section.text.likes, section.uid, section.key)}}

                />
              }

              <Text style={styles.likes}>{section.text.likes}</Text>
            </View>
            {section.text.sold ? 
              <View style={styles.soldTextContainer}>
                <Text style={styles.soldText}>SOLD</Text>
                <Image 
                source={{uri: section.uris[0]}}
                style={styles.productImage} 
                />
              </View>
              
             :
             <Image 
                source={{uri: section.uris[0]}}
                style={styles.productImage}
             />
            }  
        </View>

        {section.text.original_price > 0 ?
          <View style= { styles.headerPriceMagnifyingGlassRow }>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Text style={styles.original_price} >
                £{section.text.original_price}
              </Text>
              <Text style={styles.price} >
                £{section.text.price}
              </Text>
            </View>

            {isActive? 
              <Icon name="chevron-up" 
                    size={30} 
                    color='black'
              />
            :
              <Icon name="chevron-down" 
                    size={30} 
                    color='black'
              />
            }
            

          </View>        
        :
          <View style= { styles.headerPriceMagnifyingGlassRow }>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Text style={styles.price} >
                £{section.text.price}
              </Text>
            </View>

            {isActive? 
              <Icon name="chevron-up" 
                    size={30} 
                    color='black'
              />
            :
              <Icon name="chevron-down" 
                    size={30} 
                    color='black'
              />
            }
            
            
          </View>
        }  

                

      </Animatable.View>
    );
  };

  renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.contentCard, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
          
        
        <Animatable.View style={styles.priceMagnifyingGlassRow} transition='backgroundColor'>
          <Animatable.Text style={styles.brand} animation={isActive ? 'bounceInRight' : undefined}>
            {section.text.brand}
          </Animatable.Text>
          <Icon name="magnify" 
                size={30} 
                color={limeGreen}
                onPress={ () => { 
                    console.log('navigating to full details');
                    this.navToProductDetails(section, this.state.collectionKeys, this.state.productKeys); 
                    }}  
          />
        </Animatable.View>  
        
        <Animatable.Text style={styles.size} animation={isActive ? 'bounceInLeft' : undefined}>
          Size: {section.text.size}
        </Animatable.Text>
        
      </Animatable.View>
    );
  }

  // setFilterSection = section => {
  //   this.setState({ activeFilterSection: section });
  // };

  // renderFilterHeader = (section, _, isActive) => {
  //   return (
  //     <Animatable.View
  //       duration={300}
  //       style={[styles.headerFilterCard, isActive ? styles.active : styles.inactive]}
  //       transition="backgroundColor"
  //     >

  //       <Text style={styles.headerFilterText}>
  //         {section.header}
  //       </Text>
  //       {isActive? 
  //         <Icon name="chevron-up" 
  //               size={30} 
  //               color='black'
  //         />
  //       :
  //         <Icon name="chevron-down" 
  //               size={30} 
  //               color='black'
  //         />
  //       }
  //     </Animatable.View>
  //   )
  // }

  // renderFilterContent = (section, _, isActive) => {

  //   if(section.header == "Brand") {
  //     return (
  //       <ScrollView contentContainerStyle={styles.contentContainerStyle}>
  //         <Animatable.View
  //         duration={300}
  //         style={[styles.contentFilterCard, isActive ? styles.active : styles.inactive]}
  //         transition="backgroundColor"
  //       >
  //         {section.values.map( (value, index) => (
  //           <Animatable.Text 
  //             onPress={()=>{this.getPageSpecificProducts(value, section.header); this.setState({showFilterModal: false})}} 
  //             style={styles.contentFilterText} animation={isActive ? 'bounceInDown' : undefined}
  //           >
  //             {value}
  //           </Animatable.Text>
  //         ))}
  //       </Animatable.View>
  //     </ScrollView>
  //     )
  //   }
  //   return (
  //     <Animatable.View
  //       duration={300}
  //       style={[styles.contentFilterCard, isActive ? styles.active : styles.inactive]}
  //       transition="backgroundColor"
  //     >
  //       {section.values.map( (value, index) => (
  //         <Animatable.Text 
  //           onPress={()=>{this.getPageSpecificProducts(value, section.header); this.setState({showFilterModal: false})}} 
  //           style={styles.contentFilterText} animation={isActive ? 'bounceInDown' : undefined}
  //         >
  //           {value}
  //         </Animatable.Text>
  //       ))}
  //     </Animatable.View>
  //   )
  // }

  renderFilterModal = () => {

    var {brands, types, sizes, brandSearchTerm, selectedBrands, selectedTypes, selectedSizes} = this.state
    
    brands = brands.filter( (brand) => brand.includes(brandSearchTerm) ); 
    brands = brands.filter(onlyUnique);
    types = types.filter( (type) => type.includes(brandSearchTerm) ); 
    sizes = sizes.filter( (size) => size.includes(brandSearchTerm) );

    return (
      
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showFilterModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}
      >
    
        <ScrollView style={{flex: 1, marginTop: 22, }} contentContainerStyle={[styles.filterModalContainer, {backgroundColor: '#fff'}]}>

            <View style={{padding: 5}}>
            <Button  
              buttonStyle={styles.hideModalButtonStyle}
              icon={{name: 'chevron-left', type: 'material-community'}}
              title='Back'
              onPress={() => {
                  this.setState( {showFilterModal: false} );
                }}
            />
            </View>

            <View style={styles.searchBarAndIconContainer}>

            <View style={styles.searchBarContainer}>
              <Hoshi
                      style={{ width: 250, backgroundColor: '#fff' }}
                      label={'What Brand, Type, or Size?'}
                      labelStyle={ {color: rejectRed} }
                      value={this.state.brandSearchTerm}
                      onChangeText={(brandSearchTerm)=>{this.setState({ brandSearchTerm })}}
                      borderColor={treeGreen}
                      inputStyle={{ color: 'black', fontWeight: '400', fontFamily: avenirNext }}
                      autoCorrect={false}
                      
              />
            </View> 

            <View style={styles.clearSearchIconContainer}>
            <Icon name="close" 
                            size={40} 
                            color={'#800000'}
                            onPress={ () => this.setState({brandSearchTerm: ''})}
              />
            </View>   


            
            </View>
          
          <Text style={[styles.headerText, {color: treeGreen}]}>Brands</Text>
          <ScrollView style={{flex: 1, backgroundColor: '#122021'}} contentContainerStyle={[styles.filterScrollContainer, {backgroundColor: '#122021'}]}>

            {brands.length > 0? 
              <SelectMultiple
                items={brands}
                selectedItems={this.state.selectedBrands}
                onSelectionsChange={(selectedBrands) => this.setState({ selectedBrands })} 
              />
            :
              <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
            }

          </ScrollView>
          <Text style={[styles.headerText, {color: 'black'}]}>Types</Text>
          <ScrollView contentContainerStyle={styles.filterScrollContainer}>

            {types.length > 0? 
              <SelectMultiple
                items={types}
                selectedItems={this.state.selectedTypes}
                onSelectionsChange={(selectedTypes) => this.setState({ selectedTypes })} 
              />
            :
              <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
            }

          </ScrollView>  
          <Text style={[styles.headerText, {color: optionLabelBlue}]}>Sizes</Text>
          <ScrollView contentContainerStyle={styles.filterScrollContainer}>

            {sizes.length > 0? 
              <SelectMultiple
                items={sizes}
                selectedItems={this.state.selectedSizes}
                onSelectionsChange={(selectedSizes) => this.setState({ selectedSizes })} 
              />
            :
              <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
            }

          </ScrollView>  

          

                      

            <View style={{padding: 5}}>
            <Button  
              buttonStyle={styles.confirmFiltersButtonStyle}
              icon={{name: 'filter', type: 'material-community'}}
              title='Confirm Selection'
              onPress={() => {
                  this.getPageSpecificProducts(extractValuesFrom(selectedBrands), extractValuesFrom(selectedTypes), extractValuesFrom(selectedSizes));
                  this.setState( {showFilterModal: false} );
                }}
            />
            </View>

            <View style={{padding: 5}}>
            <Button  
              buttonStyle={styles.removeFiltersButtonStyle}
              icon={{name: 'filter-remove', type: 'material-community'}}
              title='Remove Filters'
              onPress={() => {
                  this.getPageSpecificProducts([],[],[]);
                  this.setState( {selectedBrands: [], selectedTypes: [], selectedSizes: [], showFilterModal: false} );
                }}
            />
            </View>
            
            
        </ScrollView>
      
    </Modal>
    )
  }

  render() {
    const {showYourProducts, showCollection} = this.props;
    var {productsl, activeSectionL, productsr, activeSectionR, isGetting, noProducts, emptyMarket, emptyCollection, navToChatLoading, productKeys} = this.state;

    if(isGetting) {
      return ( 
        <View style={{flex: 1}}>
          <PacmanIndicator color={graphiteGray} />
        </View>
      )
    }

    if(emptyMarket && !emptyCollection) {
      return (
        <View style={{
          flexDirection: 'column',
          marginTop: 22,
          height: height/2.2,
          backgroundColor: lightGreen
        }}
        >
            <NothingHereYet specificText={noResultsFromSearchText}/>
            {this.renderFilterModal()}
            <View style={styles.filterButtonContainerNoMarket}>
              <Button  
                  buttonStyle={styles.filterButtonStyleNoMarket}
                  icon={{name: 'filter', type: 'material-community'}}
                  title='Filter'
                  onPress={() => this.setState({ showFilterModal: true }) } 
              />
            </View>
        </View>
      )
    }

    if(showCollection && emptyCollection && emptyMarket) {
        return (
          <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
            <NothingHereYet specificText={emptyCollectionText} />
          </View>
      )
      
        
    }

    if(showYourProducts && noProducts) {
      return (
        <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
          <NothingHereYet specificText={noProductsOfYourOwnText} />
        </View>
      )
    }
    
    return (

      
          <View style={styles.container}>
            <ScrollView
                  
                  contentContainerStyle={styles.contentContainerStyle}
            >

              <Accordion
                activeSection={activeSectionL}
                sections={productsl}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSectionL}
                containerStyle={styles.listOfProducts}
              />
              

              {this.renderFilterModal()}

            </ScrollView>
            <View style={styles.filterButtonContainer}>
              <Button  
                  buttonStyle={styles.filterButtonStyle}
                  icon={{name: 'filter', type: 'material-community'}}
                  title='Filter'
                  onPress={() => this.setState({ showFilterModal: true }) } 
              />
            </View>
          </View>

        
      
            
    )
  
  }
}

{/* <Accordion
                activeSection={activeSectionL}
                sections={productsl}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSectionL}
              />

              <Accordion
                activeSection={activeSectionR}
                sections={productsr}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSectionR}
              /> */}

// Products.PropTypes = {
//     showCollection: PropTypes.bool,
//     showYourProducts: PropTypes.bool,
// }

// Products.defaultProps = {
//     showCollection: false,
//     showYourProducts: false,
// }

export default withNavigation(Products);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 22
    // width: 320,
    // height: height,
    // flexDirection: 'column',
    //alignItems: 'center',
    // justifyContent: 'center',
    
  },

  contentContainerStyle: {
    flexGrow: 4,   
    flexDirection: 'column',
    // flexWrap: 'wrap',
    // paddingTop: 20,
      },

  listOfProducts: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },    

  filterScrollContainer: {
    flexDirection: 'column',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: graphiteGray,
    borderWidth: 2,
    // backgroundColor: '#122021'
  },    

  headerPriceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0 
  },    

  priceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5 
  },    

  likesRow: {
    flexDirection: 'row',
    //backgroundColor: iOSColors.lightGray2,
    marginRight: 95,
  },
  
  buyReviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginRight: 30
  },

  boldText: {fontFamily: 'verdana', fontSize: 9, fontWeight: 'bold', color: 'blue'},  

  soldText: {
    fontFamily: 'Iowan Old Style', 
    fontSize: 25, 
    fontWeight: 'bold',
    color: 'black',
    transform: [{ rotate: '-45deg'}],
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'dashed'
  },
  
  likes: {
    fontFamily: 'Avenir Next',
    color: profoundPink,
    padding: 2,
    marginLeft: 4,
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },

  productImageContainer: { 
    flex: 1, 
    position: 'relative' 
  },

  soldTextContainer: {
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    justifyContent: 'center', alignItems: 'center'
  },
  productImage: { 
    height: cardHeight - 37, width: cardWidth,  position: 'absolute',
    zIndex: -1,
    //  top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover' 
   },
  headerText: {
    fontFamily: avenirNext,
    color: rejectRed,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: '#fff',
    width: cardWidth,
    //width/2 - 10
    height: 70,
    //200
    //marginLeft: 2,
    //marginRight: 2,
    marginTop: 2,
    paddingTop: 3,
    // paddingRight: 7,
    paddingLeft: 7,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    //width/2 - 0
    height: cardHeight,
    //200
    //marginLeft: 2,
    //marginRight: 2,
    marginTop: 2,
    padding: 0,
    // justifyContent: 'space-between'
  } ,
  //controls the color of the collapsible card when activated
  active: {
    backgroundColor: almostWhite,
    // backgroundColor: '#fff',
    //#96764c
    //#f4d29a
    //#b78b3e
    //#7c5d34
    //#c99f68
  },
  inactive: {
    backgroundColor: '#fff',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },

  original_price: {
    fontFamily: avenirNext,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'line-through',
  },

  price: {
    // ...material.display3,
    fontFamily: avenirNext,
    fontSize: 17,
    fontWeight: 'bold',
    color: limeGreen
  },

  brand: {
      // ...material.display1,
      fontFamily: avenirNext,
      fontSize: 18,
      fontStyle: 'normal',
      color: iOSColors.black
  },

  size: {
      fontFamily: avenirNext,
      fontStyle: 'normal',
      fontSize: 13,
      color: iOSColors.black
  },

  
  ////////////////////////////////// 
  ////////////////////// Partition between marketplace styles and modal styles

  filterModal: {flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 22},

  filterModalContainer: {
    // flexGrow: 1, 
    // padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterButtonStyle : {
    backgroundColor: 'black',
    width: 80,
    // height: 15,
    borderRadius: 20,
    alignItems: 'center',
    alignContent: 'center',
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
    position: 'absolute',
    bottom: 60,
  },

  filterButtonContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: width/3.6,
    // position: 'absolute',
    // bottom: 30
  },

  filterButtonStyleNoMarket : {
    backgroundColor: 'black',
    width: 80,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
    
  },

  filterButtonContainerNoMarket: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: width/3.6,
    // position: 'absolute',
    // bottom: 30
  },

  headerFilterCard: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0, 
    height: 40
  },

  contentFilterCard: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: 200,
    padding: 10,
  },
  headerFilterText: {
    ...material.headline,
    fontSize: 20
  },
  contentFilterText: {
    ...material.body1,
    color: limeGreen,
    fontSize: 20
  },

  filterOptionRow: {
    flexDirection: 'row',
    width: width/1.2,
    justifyContent: 'space-between',
  },

  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },

  tabContent: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },

  searchBarAndIconContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  searchBarContainer: {
    flex: 1, 
    paddingHorizontal: 10
    // backgroundColor: 'blue'
  },

  clearSearchIconContainer: {
    flex: 0.2, 
    // backgroundColor: 'red'
  },

  removeFiltersButtonStyle : {
    backgroundColor: rejectRed,
    width: width/3 + 40,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  confirmFiltersButtonStyle : {
    backgroundColor: lightGreen,
    width: width/3 + 40,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  hideModalButtonStyle : {
    backgroundColor: optionLabelBlue,
    width: 100,
    // height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  

});



// brands.map((brand, index,) => (
//   <View style={styles.filterOptionRow} key={index}>
  
//     <Text onPress={() => {
//       this.getPageSpecificProducts(brand, chosenType = '', chosenSize = '');
//       this.setState({showFilterModal: false})}}
//     >
//       {brand}
//     </Text>
//   </View>
// ))

//now that we have the actual list of products we'd like to work with:
        //extract the values which shall represent the filter choices only for the brands,
        //provide all values for type and size
        //TODO: screen to show 'no products match your search'
        // console.log(all);
        // for(var i = 1; i < all.length ; i++) {
        //   filters[0].values.push(all[i].text.brand);
        //   filters[1].values.push(all[i].text.type);
        //   filters[2].values.push(all[i].text.size);
        //   if(i == all.length - 1) {
        //     //remove all duplicate values from these categories
        //     filters[0].values = filters[0].values.filter(onlyUnique);
        //     filters[1].values = filters[1].values.filter(onlyUnique);
        //     filters[2].values = filters[2].values.filter(onlyUnique);
        //   }
        // }

        // if(selectedValue && category) {
        //   //filter for a specific value based on the category selected.
        //   switch(category) {
        //     case "Brand":
        //       all = all.filter( (product) => product.text.brand == selectedValue )
        //       break;
        //     case "Type":
        //       all = all.filter( (product) => product.text.type == selectedValue )
        //       break;
        //     case "Size":
        //       all = all.filter( (product) => product.text.size == selectedValue )
        //       break;
        //     default:
        //       break;
        //   }
          
        // }


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}
            // <Button
            
            // buttonStyle={{
            //     backgroundColor: "#000",
            //     width: 100,
            //     height: 40,
            //     borderColor: "transparent",
            //     borderWidth: 0,
            //     borderRadius: 5
            // }}
            // icon={{name: 'credit-card', type: 'font-awesome'}}
            // title='BUY'
            // onPress = { () => { navigate('CustomChat', {key: '-LLEL8jZIaK_AmjuXhUb'}) } }

            // />


            // <Accordion
            //   activeSection={this.state.activeFilterSection}
            //   sections={filters}
            //   touchableComponent={TouchableOpacity}
            //   renderHeader={this.renderFilterHeader}
            //   renderContent={this.renderFilterContent}
            //   duration={100}
            //   onChange={this.setFilterSection}
            // />


            // <SearchBar
              
            //   clearIcon={{ color: 'gray' }}
            //   searchIcon={{ size: 20 }}
            //   onChangeText={(brandSearchTerm)=>{this.setState({ brandSearchTerm })}}
            //   onClearText={()=>this.setState({brandSearchTerm: ''})}
            //   placeholder='What Brand, Type, or Size?'
            // />