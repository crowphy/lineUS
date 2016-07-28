'use strict';

var React = require('react-native');
var Util = require('../util');
var Service = require('../../service/service');
var Register = require('../register/register');
import Storage from 'react-native-storage';

var {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    AlertIOS,
    } = React;

var styles = StyleSheet.create({
  login: {
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
  }
});

var Login = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'news',
      isLoginShow: true,
      isRegisterShow: false
    }
  },
  _getAccount: function(account) {
    this.setState({
      account: account
    })
  },
  _getPassword: function(password) {
    this.setState({
      password: password
    })
  },
  _login: function(account, password) {
    /*var params = {
      account: this.state.account || account ,
      password: this.state.password || password
    };*/

    var params = {
      account: this.state.account || account,
      password: this.state.password || password
    };
    console.log('ot:', params.account, params.password);
    console.log(params);
    var path = Service.host + Service.login;
    //if(params.account && params.password) {
      var self = this;
      Util.post(path, params, function(data) {
        if(data.status === 1) {
          self.props.hideLogin(false, data);
        } else {
          AlertIOS.alert('登录', data.msg);
        }
      });
    /*} else {
      AlertIOS.alert('登录', '所有字段不能为空');
    }*/
  },
  _showRegister: function() {
    this.setState({
      isRegisterShow: true
    });
  },
  onChildChanged: function (newState) {
    this.setState({
      isRegisterShow: newState
    });
  },
  render: function() {
    return (
        <View>
          {!this.state.isRegisterShow ?
              <View style={styles.login}>
                <View style={styles.inputRow}>
                  <Text>帐号:</Text><TextInput style={styles.input} placeholder="请输入帐号" onChangeText={this._getAccount}/>
                </View>
                <View style={styles.inputRow}>
                  <Text>密码:</Text><TextInput style={styles.input} placeholder="请输入密码" onChangeText={this._getPassword} password={true}/>
                </View>

                <View>
                  <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login}>
                    <Text style={{color:'#fff'}}>登录</Text>
                  </TouchableHighlight>
                </View>
                <View >
                  <TouchableOpacity style={styles.reg} underlayColor="#fff" onPress={this._showRegister} >
                    <View>
                      <Text style={{color:'#000'}}>注册</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              :
              <Register
                  isLoginShow={this.props.isLoginShow}
                  isRegisterShow={this.props.isRegisterShow}
                  callbackParent={this.onChildChanged}
                  callbackLogin={this._login}
              />
          }
        </View>
    );
  }
});

module.exports = Login;