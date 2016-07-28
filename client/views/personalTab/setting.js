var React = require('react-native');
var Util = require('../util');
var ChangePassword = require('./changePassword');
var Icon = require('react-native-vector-icons/Ionicons');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    } = React;


var Setting = React.createClass({
  render: function(){
    return (
        <ScrollView style={styles.container}>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.item} onPress={this._changePassword}>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.font,{flex:1}]}>修改密码</Text>
                <Icon style={styles.rightIcon} name="chevron-right" size={15} color="#aaa"/>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
    );
  },

  _changePassword: function(){
    this.props.navigator.push({
      title: '修改密码',
      component: ChangePassword,
      passProps: {
        userData: this.props.userData
      }
    });
  }

});

var styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#F5F5F5',
  },
  item:{
    justifyContent: 'center',
    height:40,
    marginTop: 10,
    borderTopColor: '#ddd',
    backgroundColor:'#fff',
  },
  font:{
    fontSize:15,
    marginLeft:5,
    marginRight:10,
  },
  value: {
    marginRight:3,
    color: '#aaa'
  },
  rightIcon: {
    marginRight:10,
  },
  wrapper:{
    marginTop:15,
  },
});

module.exports = Setting;