/*
* Frame
* */
'use strict';

import React, {
    Component,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    StatusBarIOS,
    TabBarIOS,
    NavigatorIOS,
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');
var Util = require('./util');
var News = require('./newsTab/newsList');
var ContactList = require('./contactTab/contact');
var AddContact = require('./contactTab/addContact');
var Center = require('./personalTab/center');

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#CCFFFF',
    width: Util.size.width,
    height: Util.size.height
  },
});

var Frame = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'news',
      isLoginShow: true,
      isRegisterShow: false,
      userData: this.props.userData
    };
  },

  _onChildChanged: function(contacts) {
    var userData = this.state.userData;
    userData.contacts = contacts;
    this.setState({
      userData: userData
    });
  },
  _onUserInfoChanged: function(newState, obj) {
    this.props.hideLogin(newState, obj);
  },

  _addNavigator: function(component, title){
    if(title !== '联系人') {
      return <NavigatorIOS
          style={{flex:1}}
          translucent={true}
          initialRoute={{
              component: component,
              title: title,
              passProps: {
                userData: this.state.userData,
                callbackParent: this._onUserInfoChanged
              }
            }}
      />;
    } else {
      return <NavigatorIOS
          ref="nav"
          style={{flex:1}}
          translucent={true}
          initialRoute={{
              component: component,
              title: title,
              rightButtonTitle: '添加联系人',
              passProps: {
                userData: this.state.userData,
                callbackParent: this._onChildChanged
              },
              onRightButtonPress: () => {
                this.refs.nav.navigator.push({
                    title: "添加联系人",
                    component: AddContact,
                    passProps: {
                      userData: this.state.userData,
                      callbackParent: this._onChildChanged
                    }
                });
              }
            }}
      />;
    }
  },

  render: function() {
    return (
        <TabBarIOS selectedTab={this.state.selectedTab} style={styles.container}>
            <Icon.TabBarItemIOS
              title="消息"
              iconName = "chatboxes"
              selected={this.state.selectedTab === 'news'}
              onPress={() => {
                        this.setState({
                            selectedTab: 'news'
                        });
                    }}>
            {this._addNavigator(News, '消息')}
            </Icon.TabBarItemIOS>
            <Icon.TabBarItemIOS
              title="联系人"
              iconName = "person-stalker"
              selected={this.state.selectedTab === 'contact'}
              onPress={() => {
                        this.setState({
                            selectedTab: 'contact'
                        });
                    }}>
            {this._addNavigator(ContactList, '联系人')}
            </Icon.TabBarItemIOS>
            <Icon.TabBarItemIOS
              title="个人中心"
              iconName = "person"
              selected={this.state.selectedTab === 'center'}
              onPress={() => {
                        this.setState({
                            selectedTab: 'center'
                        });
                    }}>
            {this._addNavigator(Center, '个人中心')}
            </Icon.TabBarItemIOS>
        </TabBarIOS>
    );
  }

});

module.exports = Frame;

