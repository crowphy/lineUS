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
    paddingTop: 150,
    alignItems: 'center',
    backgroundColor: '#CCFFFF',
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
});

var ChangePassword = React.createClass({
  _getOldPassword: function(oldPassword) {
    this.setState({
      oldPassword: oldPassword
    })
  },
  _getNewPassword: function(newPassword) {
    this.setState({
      newPassword: newPassword
    })
  },
  _confirmPassword: function(confirmPassword) {
    this.setState({
      confirmPassword: confirmPassword
    })
  },
  _confirm: function() {
    var path = Service.host + Service.changeInfo;
    var self = this;
    if(this.state.oldPassword && this.state.newPassword && this.state.confirmPassword) {
      if(this.state.newPassword !== this.state.confirmPassword) {
        AlertIOS.alert('修改密码', '两次密码不一致,请重新输入!');
      } else if(this.state.oldPassword !== this.props.userData.password) {
        AlertIOS.alert('修改密码', '原始密码错误!');
      } else {
        var params = {
          userID: this.props.userData._id,
          passKey: 'password',
          newValue: this.state.confirmPassword
        };
        Util.post(path, params, function(data) {
          if(data.status) {
            AlertIOS.alert('修改密码', '修改成功!');
            self.props.navigator.pop(); 
          } else {
            AlertIOS.alert('修改密码', '修改失败!');
          }
        });
      }
    } else {
      AlertIOS.alert('修改密码', '所有字段不能为空!');
    }
  },
  render: function() {
    return (
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <Text>原始密码:</Text><TextInput style={styles.input} placeholder="请输入原始密码" onChangeText={this._getOldPassword} password={true}/>
          </View>
          <View style={styles.inputRow}>
            <Text>新密码:</Text><TextInput style={styles.input} placeholder="请输入新密码" onChangeText={this._getNewPassword} password={true}/>
          </View>
          <View style={styles.inputRow}>
            <Text>确认密码:</Text><TextInput style={styles.input} placeholder="请再次输入新密码" onChangeText={this._confirmPassword} password={true}/>
          </View>

          <View>
            <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._confirm}>
              <Text style={{color:'#fff'}}>修改</Text>
            </TouchableHighlight>
          </View>
        </View>
    );
  }
});

module.exports = ChangePassword;