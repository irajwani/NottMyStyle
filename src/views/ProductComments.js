import React, {Component} from 'react'
import {Dimensions, Keyboard, Text, TextInput, TouchableHighlight, Image, View, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Kohana } from 'react-native-textinput-effects'
import {withNavigation} from 'react-navigation';
import {database} from '../cloud/database';
import firebase from '../cloud/firebase';
import { material, systemWeights, human, iOSUIKit, iOSColors } from 'react-native-typography'
import { PacmanIndicator } from 'react-native-indicators';
import { highlightGreen, treeGreen } from '../colors';
//for each comment, use their time of post as the key

const {width, height} = Dimensions.get('window')

class ProductComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
          comments: {},
          commentString: '',
          visibleHeight: Dimensions.get('window').height,
          isGetting: true,
        }
        this.height = this.state.visibleHeight
        
        
    }

    componentWillMount() {

        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

        const {params} = this.props.navigation.state;
        const {comments} = params;
        this.setState({comments});

    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
      }

    keyboardWillHide (e) {
       this.setState({visibleHeight: Dimensions.get('window').height})
    }

    onCommentTextChanged(event) {
        this.setState({ commentString: event.nativeEvent.text });
    }

    uploadComment(name, comment, uid, uri, productKey ) {
        
        var timeCommentedKey = Date.now();
        var date = (new Date()).getDate();
        var month = (new Date()).getMonth();
        var year = (new Date()).getFullYear();
        var timeCommented = `${year}/${month.length == 2 ? month : '0' + month }/${date}`;
        
        var updates = {}
        var postData = {text: comment, name: name, time: timeCommented, uri: uri }
        this.state.comments[timeCommentedKey] = postData;
        this.setState({ comments : this.state.comments });
        updates['/Users/' + uid + '/products/' + productKey + '/comments/' + timeCommentedKey + '/'] = postData
        //firebase.database().ref('Posts').set({posts: this.state.posts})
        console.log(postData, updates)
        firebase.database().ref().update(updates)
    }
    
    render() {

        const {params} = this.props.navigation.state;
        const {productInformation, key, yourProfile, profile, uid} = params;
        const {uris, text} = productInformation //For row containing product Information
        const {name, uri} = yourProfile; //To upload a comment, attach the current Users profile details, in this case their name and profile pic uri
        const {comments} = this.state;

        return (
            <ScrollView contentContainerStyle={styles.contentContainer} >
            
            <View style={styles.rowContainer}>
                {/* row containing picture, and details for product */}
               <Image source={ {uri: uris[0] }} style={styles.profilepic} />
               <View style={styles.productTextContainer}>
                 
                 <Text style={styles.name}>
                   {text.name}
                 </Text>
                 <Text style={styles.price}>
                   Price: £{text.price}
                 </Text>
                 <Text style={styles.brand}>
                   {text.brand.toUpperCase()}
                 </Text>
               </View>
               
             </View>
             <View style={styles.separator}/>
             
             {Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                          <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.png') }/>
                        }
                          
                        <View style={styles.textContainer}>
                            <Text style={ styles.commentName }> {comments[comment].name} </Text>
                            <Text style={styles.comment}> {comments[comment].text}  </Text>
                        </View>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                      </View>

                      {comments[comment].uri ? <View style={styles.separator}/> : null}
                      
                  </View>
                  
              )
                      
              )}
             
            <View style={{flexDirection : 'row', bottom : this.height - this.state.visibleHeight}} >
                <Kohana
                    style={{ backgroundColor: '#f9f5ed' }}
                    label={'Comment'}
                    value={this.state.commentString}
                    onChange={this.onCommentTextChanged.bind(this)}
                    iconClass={Icon}
                    iconName={'comment-multiple'}
                    iconColor={'#f4d29a'}
                    labelStyle={{ color: '#91627b' }}
                    inputStyle={{ color: '#91627b' }}
                    useNativeDriver
                />
                <Icon name="send" 
                        size={50} 
                        color={'#37a1e8'}
                        onPress={ () => {this.uploadComment(name, this.state.commentString, uid, uri, key);
                                     this.setState({commentString: ''}); 
                                     }}
                />
                
            </View>
           </ScrollView>
        )
    }
}

export default withNavigation(ProductComments)

const styles = StyleSheet.create({

    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
        marginTop: 5,
        marginBottom: 5
      },

    container: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    wrapper: {
        paddingTop: 10
      },
    scrollcontainer: {
        padding: 15,
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#32cd32',
        borderRadius: 8,
        color: '#32cd32'
    },

    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
      },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: "#800000",
        width: 100,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },

    productTextContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'flex-start',
        textAlign: 'justify'
    },

    name: {
        ...material.headline,
        fontSize: 18,
        color: '#207011',
        fontFamily: 'Times New Roman'
    },

    price: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18
    },

    brand: {
        fontFamily: 'Iowan Old Style',
        fontSize: 22,
        color: 'gray'
    },

    email: {
        ...material.caption,
        fontSize: 18,
        color: '#0394c0',
        fontStyle: 'italic'
      },  

    naam: {
        ...iOSUIKit.caption2,
        fontSize: 11,
        color: '#37a1e8'

    },

    title: {
        ...human.headline,
        fontSize: 20,
        color: '#656565'
      },

    comment: {
        ...iOSUIKit.bodyEmphasized,
        fontSize: 25,
        color: 'black',
    },  

    commentTime: {
        fontSize: 12,
        color: '#1f6010'
    },

    rowContainer: {
        marginTop: 15,
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
        alignContent: 'center',
        backgroundColor: iOSColors.lightGray2
      },

    profilepic: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderRadius: 50,
        borderColor: treeGreen,
        borderWidth: 1
    },
    
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#32cd32'
      },
    
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
      },

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

    commentContainer: {
    flexDirection: 'column',
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
    
    textContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 5,
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
    color: iOSColors.black
    },  

  });