'use strict';
var React = require('react-native');
var ImagePickerManager = require('NativeModules').ImagePickerManager;

var Util = require('../util');
var Icon = require('react-native-vector-icons/Ionicons');
var PersonalInfo = require('./personalInfo');
var MyTag = require('./myTag');
var Setting = require('./setting');
var Login = require('../login/login');
var Service = require('../../service/service');

var {
        View,
        Text,
        ScrollView,
        StyleSheet,
        TouchableOpacity,
        AsyncStorage,
        Image,
        Platform,
        PixelRatio
        } = React;

var Center = React.createClass({
    getInitialState: function() {
        var source = this.props.userData.avatarUri ? {uri: this.props.userData.avatarUri, isStatic: true} : null;
        return {
            userData: this.props.userData,
            avatarSource: source
        }
    },
    selectPhotoTapped() {
        const options = {
            title: '选取头像',
            takePhotoButtonTitle: '照相',
            chooseFromLibraryButtonTitle: '从相册选取',
            cancelText: '取消',
            quality: 0.5,
            maxWidth: 300,
            maxHeight: 300,
            storageOptions: {
                skipBackup: true
            },
            allowsEditing: true
        };
        ImagePickerManager.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either:
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                var path = Service.host + Service.uploadPicture;
                var params = {
                    userID: this.props.userData._id,
                    uri: source.uri
                };
                Util.post(path, params, function(data) {
                    //console.log(data);
                });
                //console.log(source);
                this.setState({
                    avatarSource: source
                });
            }
        });
    },

    render: function(){
        var colors = ['#F4000B', '#17B4FF', '#FFD900'];
        var tags = ['P', 'M', 'S'];
        var titles = ['个人信息', '我的标签', '设置'];
        var components = [PersonalInfo, MyTag, Setting];

        var JSXDOM = [];
        for(var i in titles){
            JSXDOM.push(
                    <TouchableOpacity key={titles[i]} onPress={this._loadPage.bind(this, components[i], titles[i])}>
                        <View style={[styles.item, {flexDirection:'row'}]}>
                            <Text style={[styles.tag, {color: colors[i]}]}>{tags[i]}</Text>
                            <Text style={[styles.font,{flex:1}]}>{titles[i]}</Text>
                            <Icon style={styles.rightIcon} name="chevron-right" size={15} color="#aaa"/>
                        </View>
                    </TouchableOpacity>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <Image  source={require('image!avatarBgPic')} style={{width: 414, height: 160}}>
                    <View style={[styles.wrapper, {flexDirection:'row'}]}>
                        <TouchableOpacity onPress={this.selectPhotoTapped}>
                            {<View style={[styles.avatar, styles.avatarContainer, {marginTop: 20, marginBottom: 10}]}>
                                { this.state.avatarSource === null ? <Text style={{backgroundColor: 'transparent'}}>Select a Photo</Text> :
                                    <Image style={styles.avatar} source={this.state.avatarSource} />
                                }
                            </View>}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.wrapper, {flexDirection:'row', backgroundColor: 'transparent', marginBottom: 10}]}>
                        <Text style={{color:'#fff'}}>{this.props.userData.username}</Text>
                    </View>
                </Image>
                
                <View>
                    {JSXDOM}
                </View>

                <View style={{marginTop:30}}>
                    <TouchableOpacity onPress={this._clear} onPress={this._logout}>
                        <View style={[styles.item, {flexDirection:'row'}]}>
                            <Text style={[styles.font, styles.logout, {flex:1}]}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },

    _onChildChanged: function(userData) {
        //this.props.callbackParent(data);
        this.setState({
            userData: userData
        });
    },

    _loadPage: function(component, title){
        this.props.navigator.push({
            title: title,
            component: component,
            passProps: {
                userData: this.state.userData,
                callbackParent: this._onChildChanged
            }
        });
    },
    _logout: function() {
        this.props.callbackParent(true, null);
    }

});

var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#F5F5F5',
    },
    item: {
        height:40,
        justifyContent: 'center',
        borderTopWidth: Util.pixel,
        borderTopColor: '#ddd',
        backgroundColor:'#fff',
        alignItems:'center',
    },
    logout: {
        textAlign:'center',
    },
    font: {
        fontSize:15,
        marginLeft:5,
        marginRight:10,
    },
    rightIcon: {
        marginRight:10,
    },
    wrapper: {
        justifyContent: 'center',
    },
    tag: {
        marginLeft:10,
        fontSize:16,
        fontWeight:'bold'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 50,
        width: 100,
        height: 100
    }
});

module.exports = Center;