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
    register: {
        paddingTop: 150,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: Util.size.width,
        height: Util.size.height
    },
    inputRow: {
        marginTop: 10,
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
    nav: {
        backgroundColor: '#000',
        flex: 1
    },
    reg: {
        marginTop: 320,
    },
    cancel: {
        marginTop: -110,
        marginLeft: -180
    }
});

var Register = React.createClass({
    getInitialState: function() {
        return {
            isRegisterShow: false
        }
    },
    _getName: function(username) {
        this.setState({
            username: username
        })
    },
    _getPhoneNum: function(userPhoneNum) {
        this.setState({
            userPhoneNum: userPhoneNum
        })
    },
    _getPassword: function(password) {
        this.setState({
            password: password
        })
    },
    _getPasswordAgain: function(password) {
        this.setState({
            confirm_password: password
        })
    },
    _cancel: function() {
        var newState = false;
        this.props.callbackParent(newState);
    },
    _register: function() {
        var params = {
            username: this.state.username,
            userPhoneNum: this.state.userPhoneNum,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        };
        var path = Service.host + Service.register;
        var self = this;
        if(params.username && params.password && params.userPhoneNum) {
            if(params.confirm_password !== params.password) {
                AlertIOS.alert('注册', '两次密码不一致,请重新输入!');
            } else {
                Util.post(path, params, function(data) {
                    if(data.status) {
                        self.setState({
                            isRegisterShow: false
                        });
                        var newState = false;
                        self.props.callbackParent(newState);
                        console.log(params);
                        self.props.callbackLogin(params.username, params.password);
                        AlertIOS.alert('注册', data.msg);
                    } else {
                        AlertIOS.alert('注册', data.msg);
                    }
                });
            }
        } else {
            AlertIOS.alert('注册', '所有字段不能为空!');
        }
    },
    render: function() {
        return (
                <View style={styles.register}>
                    <View>
                        <TouchableHighlight underlayColor="#fff" style={styles.cancel} onPress={this._cancel}>
                            <Text style={{color:'#000'}}>取消</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.inputRow}>
                        <Text>姓名:</Text><TextInput style={styles.input} placeholder="请输入姓名" onChangeText={this._getName}/>
                    </View>
                    <View style={styles.inputRow}>
                        <Text>手机:</Text><TextInput style={styles.input} placeholder="请输入手机号码" onChangeText={this._getPhoneNum}/>
                    </View>
                    <View style={styles.inputRow}>
                        <Text>密码:</Text><TextInput style={styles.input} placeholder="请输入密码" onChangeText={this._getPassword} password={true}/>
                    </View>
                    <View style={styles.inputRow}>
                        <Text>确认密码:</Text><TextInput style={styles.input} placeholder="请再次输入密码" onChangeText={this._getPasswordAgain} password={true}/>
                    </View>

                    <View>
                        <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._register}>
                            <Text style={{color:'#fff'}}>注册并登录</Text>
                        </TouchableHighlight>
                    </View>
                </View>
        );
    }
});

module.exports = Register;