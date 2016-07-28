'use strict';

var Util = require('../util');
var Service = require('../../service/service');
var ChatWindow = require('../newsTab/chatWindow');
import Storage from 'react-native-storage';
import React, {
        StyleSheet,
        View,
        Text,
        TouchableHighlight,
        Image,
        TouchableOpacity,
        AlertIOS
} from 'react-native';

var storage = new Storage({
    size: 1000,
    defaultExpires: null,
    enableCache: true
});

var styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: Util.size.width,
        height: Util.size.height
    },
    btn: {
        marginTop: 30,
        width: 240,
        height: 40,
        backgroundColor: '#3BC1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    }
});



var ContactDetail = React.createClass({
    getInitialState: function() {        
        return {
            avatar: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        }
    },
    componentDidMount: function() {
        var path = Service.host + Service.getPicture + '?contactphonenum=' + this.props.contact.contactPhoneNum;
        var _id = this.props.userData.userPhoneNum + this.props.contact.contactPhoneNum;
        var self = this;
        Util.get(path, function(data) {
            var source = {uri: data.avatarUri || 'https://facebook.github.io/react/img/logo_og.png', isStatic: true};
            storage.save({
                key: 'avatars',
                id: _id,
                rawData: source,
            });
            self.setState({
                avatar: source,
            });
        });
    },
    _deleteMatch: function() {
        var path = Service.host + Service.deleteContact;
        var params = {
            userID: this.props.userData._id,
            contactID: this.props.contact._id
        };
        var self = this;
        console.log(path);
        Util.post(path, params, function(data) {
            if(data.status) {
                self.props.navigator.pop();
                AlertIOS.alert('匹配', '删除成功!');
                console.log(data.msg.contacts);
                storage.remove({
                    key: 'chatRecords',
                    id: self.props.userData.userPhoneNum + self.props.contact.contactPhoneNum
                });
                self.props.callbackParent(data.msg.contacts);
            } else {
                AlertIOS.alert('匹配', data.msg);
            }
        });
    },

    _goChat: function() {
        this.props.navigator.push({
            title: this.props.contact.contactName,
            component: ChatWindow,
            passProps: {
                userData: this.props.userData,
                contact: this.props.contact
            }
        });
    },

    render: function() {
        return (
                <View style={styles.container}>
                    <Image style={styles.avatar} source={this.state.avatar}/>
                    <View>
                        <Text>{this.props.contact.contactName}</Text>
                    </View>
                    <View>
                        <Text>{this.props.contact.contactPhoneNum}</Text>
                    </View>
                    {this.props.contact.isMatched ?
                        <View>
                            <TouchableHighlight ref="nav" underlayColor="#fff" style={styles.btn} onPress={this._goChat}>
                                <Text style={{color:'#fff'}}>开始聊天</Text>
                            </TouchableHighlight>
                        </View> : null
                    }
                    <View>
                        <TouchableHighlight ref="nav" underlayColor="#fff" style={styles.btn} onPress={this._deleteMatch}>
                            <Text style={{color:'#fff'}}>{this.props.contact.isMatched ? '删除' : '取消匹配'}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
        )
    }
})

module.exports = ContactDetail;