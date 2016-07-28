/**
 * Crowphy
 */

'use strict';
import React, {
    AppRegistry,
    View,
    StatusBarIOS,
} from 'react-native';

var Frame = require('./views/frame');
var Login = require('./views/login/login');

StatusBarIOS.setStyle(0);

var lineUS = React.createClass({
  getInitialState: function() {
    return {
      isLoginShow: true
    }
  },
  onChildChanged: function(newState, data) {
    this.setState({
      isLoginShow: newState,
      data: data ? data.userInfo[0] : data
    });
  },
  render: function() {
    return (
      <View>
        {this.state.isLoginShow ? <Login hideLogin={this.onChildChanged}/> : <Frame hideLogin={this.onChildChanged} userData={this.state.data}/>}
      </View>
    );
  }
});

AppRegistry.registerComponent('lineUS', () => lineUS);
