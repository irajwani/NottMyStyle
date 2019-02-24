import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { avenirNextText } from '../constructors/avenirNextText';
import { LoadingIndicator } from '../localFunctions/visualFunctions';
import { lightPurple } from '../colors';
import firebase from '../cloud/firebase';

const emptyCartText = "Currently your cart is empty";

export default class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isGetting: true,
            cart: false,
        }
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.getCart()
        }, 1000);
    }

    getCart = () => {
        firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/cart`).once("value", (snapshot) => { 
            var cart = snapshot.val();
            this.setState({isGetting: false, cart});
        })
    }

    render() {
        var {cart, isGetting} = this.state;

        if(isGetting) {
            return (
                <View>
                    <LoadingIndicator isVisible={isGetting} color={lightPurple} type={'Wordpress'}/>
                </View>
            )
        }

        else {
            if(!cart) {
                return (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={new avenirNextText("black", 18, "300")}>{emptyCartText}</Text>
                    </View>
                )
            }
    
            else {
                return (
                    <View>
                        <Text>{JSON.stringify(cart)}</Text>
                    </View>
                )
            }
        }
        
        

    }
}

const styles = StyleSheet.create({

})
