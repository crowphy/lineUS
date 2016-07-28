'use strict';

var Util = require('../util');
var ChatWindow = require('./chatWindow');
var Service = require('../../service/service');
var Swipeout = require('react-native-swipeout');
import Storage from 'react-native-storage';
import React, {
    StyleSheet,
    View,
    Text,
    Component,
    ListView,
    ActivityIndicatorIOS,
    TouchableHighlight,
    Image
} from 'react-native';

var storage = new Storage({
    size: 1000,
    defaultExpires: null,
    enableCache: true
});


var News = React.createClass({
    getInitialState: function() {
        var dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            });
        return ({
            isLoading: true,
            userData: this.props.userData,
            dataSource: dataSource,
        })
    },
    getCacheData: function (chatRecords) {
        this.chatRecords = [];
        this.displayPhoneNums = [];
        var avatars = {};
        var contacts = this.props.userData.contacts;
        console.log(contacts);
        var self = this;
        contacts.forEach(function(contact) {
            var path = Service.host + Service.getPicture + '?contactphonenum=' + contact.contactPhoneNum;
            var _id = self.props.userData.userPhoneNum + contact.contactPhoneNum;
            Util.get(path, function(data) {
                var source = {uri: data.avatarUri || 'https://facebook.github.io/react/img/logo_og.png', isStatic: true};
                storage.save({
                    key: 'avatars',
                    id: _id,
                    rawData: source,
                });
            });
            
            storage.getBatchData([
                {key: 'chatRecords', id: _id,},
                {key: 'avatars', id: _id}
            ]).then(chatRecord => {
                var record = {};
                console.log(chatRecord[1]);
                record.displayName = contact.contactName || contact.contactPhoneNum;
                record.displayPhoneNum = contact.contactPhoneNum;
                record.chatRecord = chatRecord[0];
                record.avatar = chatRecord[1];
                self.chatRecords.push(record);
                self.displayPhoneNums.push(contact.contactPhoneNum);
                self.setState({
                    chatRecords: self.chatRecords,
                    displayPhoneNums: self.displayPhoneNums,
                });
            }).catch(err => {
                console.log(err);
            });
        });
        setTimeout(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(chatRecords || this.state.chatRecords || []),
                isLoading: false
            });
        }, 100);
    },
    deleteChatRecord: function(contactPhoneNum, chatRecords) {
        console.log(chatRecords);
        /*this.chatRecords = [];
        this.displayPhoneNums = [];*/
        var contacts = this.props.userData.contacts;
        var self = this;
        contacts.forEach(function(contact) {
            console.log(contact);
            storage.load({
                key: 'chatRecords',
                id: self.props.userData.userPhoneNum + contact.contactPhoneNum
            }).then(chatRecord => {
                /*var record = {};
                console.log('test');
                record.displayName = contact.contactName || contact.contactPhoneNum;
                record.displayPhoneNum = contact.contactPhoneNum;
                record.chatRecord = chatRecord;
                self.chatRecords.push(record);
                self.displayPhoneNums.push(contact.contactPhoneNum);*/
                self.setState({
                    //chatRecords: self.chatRecords,
                    //displayPhoneNums: self.displayPhoneNums
                    //dataSource: self.state.dataSource.cloneWithRows(chatRecords || [])
                });
            }).catch(err => {
                console.log(err);
            });
        });
        /*storage.remove({
          key: 'chatRecords',
          id: self.props.userData.userPhoneNum + contactPhoneNum
        });*/
        setTimeout(() => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(chatRecords || [])
            });
        }, 100);
    },

    componentDidMount: function() {
        this.getCacheData();
    },
    componentWillReceiveProps: function() {
        this.getCacheData();
    },
    componentWillUpdate: function() {
        
    },

    render: function() {
        if (this.state.isLoading) {
            //return this.renderLoadingView();
        }
        return (
            <ListView style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this.renderNews}
                style={styles.listView}
            />
        );
    },
    renderNews: function(record) {
        var self = this;
        var swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: '#CC3300',
                underlayColor: '#fff',
                onPress: function() {
                    var displayPhoneNums = self.state.displayPhoneNums;
                    var index = displayPhoneNums.indexOf(record.displayPhoneNum);
                    console.log(index);
                    var chatRecords = self.state.chatRecords;
                    chatRecords.splice(index, 1);
                    displayPhoneNums.splice(index, 1);
                    console.log(chatRecords);
                    self.deleteChatRecord(record.displayPhoneNum, chatRecords);
                }
            }
        ];
        
        return (
            <Swipeout right={swipeoutBtns} autoClose={true} backgroundColor='#fff' >
                <TouchableHighlight onPress={() => this.goChat(record)} underlayColor='#dddddd'>            
                    <View>
                        <View  style={styles.item}>
                            <Image style={styles.avatar} source={record.avatar}/>
                             {/*: <Text style={styles.textAvatar}>{record.displayName[0]}</Text>}*/}
                            <View style={styles.rightContainer}>
                                <Text style={styles.title}>{record.displayName}</Text>
                                <Text style={styles.author}>{record.chatRecord[record.chatRecord.length-1].text}</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                    </View>            
                </TouchableHighlight>
            </Swipeout>
        );
    },
    goChat: function(chatRecord) {
        var contact = {
            contactName: chatRecord.displayName,
            contactPhoneNum: chatRecord.displayPhoneNum,
            avatar: chatRecord.avatar,
        };
        this.props.navigator.push({
            title: contact.contactName || contact.contactPhoneNum,
            component: ChatWindow,
            passProps: {
                contact: contact,
                userData: this.props.userData
            }
        });
    },

    renderLoadingView: function() {
        return (
            <View style={styles.loading}>
                <ActivityIndicatorIOS
                        size='large'/>
                <Text>
                    加载中...
                </Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#CCFFFF',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    author: {
        color: '#656565'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    listView: {
        backgroundColor: '#F5FCFF'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    avatar: {
        borderRadius: 25,
        width: 50,
        height: 50,

    },
    textAvatar: {
        color: '#000',
        borderRadius: 25,
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#eee'
    },
    rightContainer: {
        marginLeft: 10,
    },
});

module.exports = News;