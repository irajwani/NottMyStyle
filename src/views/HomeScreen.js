import React, {Component} from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json

import { profileToEditProfileStack } from '../stackNavigators/profileToEditProfileStack';
import { marketToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/marketToProductDetailsOrChatOrCommentsStack';
import { multipleAddButtonToMultiplePictureCameraToCreateItemStack } from '../stackNavigators/createItemToPictureCameraStack';
import { wishListToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/wishListToProductDetailsOrChatOrCommentsStack';
import { ChatsToCustomChatStack } from '../stackNavigators/chatsToCustomChatStack';
import { highlightGreen, tabPurple, tabIconYellow, actualTabIcon } from '../colors';

const HomeScreen = TabNavigator(
            {

              
              Profile: profileToEditProfileStack,
              
              Market: marketToProductDetailsOrChatOrCommentsStack,
              
              Sell: multipleAddButtonToMultiplePictureCameraToCreateItemStack,
              
              Chats: ChatsToCustomChatStack,
              
              WishList: wishListToProductDetailsOrChatOrCommentsStack,
              
            },
            {
              navigationOptions: ({ navigation }) => ({
                
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  let iconName;
                  let iconSize = 25;
                  if (routeName === 'Profile') {
                    iconName = 'account-circle';
                  } else if (routeName === 'Market') {
                    iconName = 'shopping';
                  } else if (routeName === 'Sell') {
                      iconName = 'plus-circle-outline';
                      iconSize = 35;
                    }

                    else if (routeName === 'Chats') {
                      iconName = 'forum';
                    }

                    else if (routeName === 'WishList') {
                      iconName = 'basket';
                    }
          
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  return <Icon name={iconName} size={iconSize} color={tintColor} />;
                },
              }),
              tabBarComponent: TabBarBottom,
              tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: actualTabIcon,
                inactiveTintColor: '#fff',
                style: {
                  backgroundColor: tabPurple
                }
              },
              animationEnabled: false,
              swipeEnabled: false,
            }
          ); 
        
    
export default HomeScreen;