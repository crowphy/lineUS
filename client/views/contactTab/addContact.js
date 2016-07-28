'use strict';

var React = require('react-native');
var Util = require('../util');
var Service = require('../../service/service');

var {
        StyleSheet,
        View,
        Text,
        TextInput,
        TouchableHighlight,
        AlertIOS
        } = React;

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#CCFFFF',
        width: Util.size.width,
        height: Util.size.height,
        paddingTop: 80,
    },
    inputRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    input: {
        marginLeft: 10,
        width: 220,
        height: 35,
        paddingLeft: 8,
        borderRadius: 5,
        borderColor: '#ccc'
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
});

var AddContact = React.createClass({
    componentDidMount: function() {
        this.setState({
            userData: this.props.userData
        });
    },

    _getName: function(contactName) {
        this.setState({
            contactName: contactName
        })
    },
    _getPhoneNum: function(contactPhoneNum) {
        this.setState({
            contactPhoneNum: contactPhoneNum
        })
    },

    _addContact: function() {
        console.log(this.props.userData);
        var path = Service.host + Service.addContact;
        var params = {
            userID: this.props.userData._id,
            userPhoneNum: this.props.userData.userPhoneNum,
            contactName: this.state.contactName,
            contactPhoneNum: this.state.contactPhoneNum,
            isMatched: false
        };
        var self = this;
        if(params.contactName && params.contactPhoneNum) {
            Util.post(path, params, function(data) {
                if(data.status) {
                    self.props.callbackParent(data.msg.contacts);
                    self.props.navigator.pop();
                } else {
                    AlertIOS.alert('添加联系人', data.msg);
                }
            });
        } else {
            self.props.navigator.pop();
        }

    },

    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.inputRow}>
                    <Text>姓名:</Text><TextInput style={styles.input} placeholder="请输入姓名" onChangeText={this._getName}/>
                </View>
                <View style={styles.inputRow}>
                    <Text>手机:</Text><TextInput style={styles.input} placeholder="请输入手机号码" onChangeText={this._getPhoneNum}/>
                </View>

                <View>
                    <TouchableHighlight ref="nav" underlayColor="#fff" style={styles.btn} onPress={this._addContact}>
                        <Text style={{color:'#fff'}}>添加并等待匹配</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
})

module.exports = AddContact;