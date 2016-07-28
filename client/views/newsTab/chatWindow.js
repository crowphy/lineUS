'use strict';

import React, {
    Linking,
    Platform,
    ActionSheetIOS,
    Dimensions,
    View,
    Text,
    Navigator,
    Component,
} from 'react-native';
import Storage from 'react-native-storage';
var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');
var Service = require('../../service/service');
var socket = require('socket.io-client/socket.io')(Service.host + Service.chat,
    {
    'transports':['websocket']
});


var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
var storage = new Storage({
    size: 1000,
    defaultExpires: null,
    enableCache: true
});

socket.on('connect', function() {
    console.log('connecting successfully');
});
socket.on('error', function(error) {
    console.log(error);
});

socket.on('connect_failed', function() {
    console.log('connect_failed');
});

class GiftedMessengerContainer extends Component {
    
    constructor(props) {
    super(props);
    console.log(this.props.contact);
    storage.load({
        key: 'chatRecords',
        id: this.props.userData.userPhoneNum + this.props.contact.contactPhoneNum
    }).then(chatRecord => {
        console.log(chatRecord);
        this.setState({
            chatRecord: chatRecord
        });
    }).catch(err => {
        console.log(err);
        this.setState({
            chatRecord: []
        });
    });

    this._isMounted = false;

    this.state = {
        //messages: this._messages,
        isLoadingEarlierMessages: false,
        typingMessage: '',
        allLoaded: false,
    };
    
    }
    
    componentDidMount() {
        this.handleReceive();
        setTimeout(() => {
            console.log(this.state.chatRecord);
            this._messages = this.state.chatRecord;
            this.setState({
                messages: this.state.chatRecord
            });
        }, 500);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    getInitialMessages() {
        storage.load({
            key: this.props.contact.contactPhoneNum
        }).then(chatRecord => {
            this.setState({
            chatRecord: chatRecord
            });
        }).catch(err => {
            console.log(err);
        });

        return [];
    }
    
    setMessageStatus(uniqueId, status) {
        let messages = [];
        let found = false;
        
        for (let i = 0; i < this._messages.length; i++) {
            if (this._messages[i].uniqueId === uniqueId) {
                let clone = Object.assign({}, this._messages[i]);
                clone.status = status;
                messages.push(clone);
                found = true;
            } else {
                messages.push(this._messages[i]);
            }
        }
        
        if (found === true) {
            this.setMessages(messages);
        }
    }
    
    setMessages(messages) {
        this._messages = messages;
        
        // append the message
        this.setState({
            messages: messages,
        });
    }
    
    handleSend(message = {}) {

        var userData = this.props.userData;
        message.from = userData.userPhoneNum;
        message.sendName = userData.username;
        message.to = this.props.contact.contactPhoneNum;
        message.receiveName = this.props.contact.contactName;
        message.image = {uri: userData.avatarUri};

        message.uniqueId = Math.round(Math.random() * 100000);

        this.setMessages(this._messages.concat(message));
        socket.emit('postMsg', message);
        console.log(message);
        storage.save({
            key: 'chatRecords',
            id: message.from + message.to,
            rawData: this._messages
        });

        setTimeout(() => {
            this.setMessageStatus(message.uniqueId, 'Seen'); 
        }, 1000);
    }
    
    onLoadEarlierMessages() {

    // display a loader until you retrieve the messages from your server
    this.setState({
        isLoadingEarlierMessages: true,
    });
    
    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Oldest messages have to be at the begining of the array

    setTimeout(() => {
        this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
        this.setState({
        isLoadingEarlierMessages: false, // hide the loader
        allLoaded: true, // hide the `Load earlier messages` button
        });
    }, 1000); // simulating network
    
    }
    
    handleReceive(message = {}) {
        // make sure that your message contains :
        // text, name, image, position: 'left', date, uniqueId
        var userData = this.props.userData;
        //var id = userData.id;
        var self = this;
        console.log(self.props.contact.contactPhoneNum);
        socket.on(userData.userPhoneNum, function(message) {
            if( message.from === self.props.contact.contactPhoneNum) {
                message.position = 'left';
                self._messages = self._messages;
                var avatar = self.props.contact.avatar;
                var defaultAvatar = {uri: 'https://facebook.github.io/react/img/logo_og.png'};
                message.image = avatar.uri ? avatar : defaultAvatar;
                self.setMessages(self._messages.concat(message));
                console.log(message);
                storage.save({
                    key: 'chatRecords',
                    id: message.to + message.from,
                    rawData: self._messages
                });
            }

        });    
    }

    onErrorButtonPress(message = {}) {
        // Your logic here
        // re-send the failed message

        // remove the status
        this.setMessageStatus(message.uniqueId, '');
    }
    
    // will be triggered when the Image of a row is touched
    onImagePress(message = {}) {
        // Your logic here
        // Eg: Navigate to the user profile
    }
    
    render() {
        return (
            <GiftedMessenger
                ref={(c) => this._GiftedMessenger = c}
            
                styles={{
                    bubbleRight: {
                    marginLeft: 70,
                    backgroundColor: '#007aff',
                    },
                }}
                
                autoFocus={true}
                messages={this.state.messages}
                handleSend={this.handleSend.bind(this)}
                onErrorButtonPress={this.onErrorButtonPress.bind(this)}
                maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT + 60}

                /*loadEarlierMessagesButton={!this.state.allLoaded}
                onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}*/

                senderName={this.props.userData.username}
                senderImage={null}
                onImagePress={this.onImagePress}
                displayNames={true}
                
                parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
                handlePhonePress={this.handlePhonePress}
                handleUrlPress={this.handleUrlPress}
                handleEmailPress={this.handleEmailPress}
                
                isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
                
                typingMessage={this.state.typingMessage}
            />
        );
    }
    
    handleUrlPress(url) {
        Linking.openURL(url);
    }

    // TODO
    // make this compatible with Android
    handlePhonePress(phone) {
        if (Platform.OS !== 'android') {
            var BUTTONS = [
            'Text message',
            'Call',
            'Cancel',
            ];
            var CANCEL_INDEX = 2;
        
            ActionSheetIOS.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX
            },
            (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                Communications.phonecall(phone, true);
                break;
                case 1:
                Communications.text(phone);
                break;
            }
            });
        }
    }
    
    handleEmailPress(email) {
        Communications.email(email, null, null, null, null);
    }
    
}


module.exports = GiftedMessengerContainer;