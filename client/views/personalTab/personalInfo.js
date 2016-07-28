var React = require('react-native');
var EditPage = require('./edit');
var Util = require('../util');
var Service = require('../../service/service');
var Icon = require('react-native-vector-icons/Ionicons');
var {
        View,
        Text,
        ScrollView,
        StyleSheet,
        TouchableOpacity,
        AsyncStorage,
        AlertIOS
        } = React;


var PersonalInfo = React.createClass({
    getInitialState: function() {
        return {
            userData: this.props.userData
        }
    },
    render: function(){
        var userData = this.state.userData;
        console.log(userData);
        var list = [];
        var titles = ['昵称', '电话', '性别', '年龄', '地区', '签名'];
        var keys = ['username', 'userPhoneNum', 'genders', 'age', 'district', 'sign'];
        var values = [userData.username, userData.userPhoneNum, userData.genders || '未填写',
            userData.age || '未填写', userData.district || '未填写', userData.sign || '未填写'];
        for(var i in titles){
            list.push(
                    <TouchableOpacity style={styles.item} key={titles[i]} onPress={this._loadPage.bind(this, titles[i], keys[i], values[i])}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.font,{flex:1}]}>{titles[i]}</Text>
                            <Text style={styles.value}>{values[i]}</Text>
                            <Icon style={styles.rightIcon} name="chevron-right" size={15} color="#aaa"/>
                        </View>
                    </TouchableOpacity>
            );
        }

        return (
                <ScrollView style={styles.container}>
                    <View style={styles.wrapper}>
                        {list}
                    </View>
                </ScrollView>
        );
    },

    _onChildChanged: function(key, value) {
        var userData = this.props.userData;
        userData.key = value;
        this.setState({
            userData: userData
        });
    },

    _loadPage: function(title, key, value){
        this.props.navigator.push({
            title: title,
            component: EditPage,
            rightButtonTitle: '完成',
            passProps: {
                userData: this.props.userData,
                callbackParent: this._onChildChanged,
                passKey: key,
                oldValue: value
            },
            onRightButtonPress: () => {
                var path = Service.host + Service.changeInfo;
                var params = {
                    userID: this.props.userData._id,
                    passKey: key,
                    newValue: this.state.userData.key
                };
                var self = this;
                Util.post(path, params, function(data) {
                    if(data.status) {
                        AlertIOS.alert('更改信息', '更改成功!');
                        self.setState({
                            userData: data.msg
                        });
                        self.props.callbackParent(data.msg);
                        self.props.navigator.pop();           
                    } else {
                        AlertIOS.alert('更改信息', '更改失败!');
                    }
                });
            }
        });
    },

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
    tag:{
        marginLeft:10,
        fontSize:16,
        fontWeight:'bold'
    }
});

module.exports = PersonalInfo;