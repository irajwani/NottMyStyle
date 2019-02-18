import { createStackNavigator } from 'react-navigation';
import { Animated, Easing } from 'react-native';
// import Chats from '../views/Chats';
import CustomChat from '../views/CustomChat';
// import Notifications from '../views/Notifications';
import OtherUserProfilePage from '../views/OtherUserProfilePage';
// import ProductComments from '../views/ProductComments';
import UserComments from '../views/UserComments';
import NotificationsAndChats from '../views/NotificationsAndChats';

export const ChatsToCustomChatStack = createStackNavigator({
    NotificationsAndChats: NotificationsAndChats,
    CustomChat: CustomChat,
    OtherUserProfilePage: OtherUserProfilePage,
    UserComments: UserComments

},{
    initialRouteName: 'NotificationsAndChats',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
})
