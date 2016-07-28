'use strict';

var Service = require('../../service/service');
var Util = require('../util');
var EditPage = require('./edit');

import React, {
                StyleSheet,
                View,
                Text,
                Component,
                TouchableHighlight,
                Image,
                ScrollView,
                TouchableOpacity,
                AlertIOS,
} from 'react-native';

var MyTag = React.createClass({
    getInitialState: function() {
        console.log(this.props.userData.tags.yourself);
        return {
            yourself: this.props.userData.tags.yourself,
            otherSide: this.props.userData.tags.otherSide
        }    
    },

    componentWillMount: function() {
        //this.updateDataSource(this.props.userData.tags);
    },

    componentWillReceiveProps: function() {
        //this.updateDataSource(this.props.userData.tags);
    },

    _onChildChanged: function(type, value) {
        console.log(type, value);
        
        this.setState({
            type: type,
            temp: value
        })
    },

    editTag: function(title, type) {
        this.props.navigator.push({
            title: title,
            component: EditPage,
            rightButtonTitle: '完成',
            passProps: {
                //userData: this.props.userData,
                callbackParent: this._onChildChanged,
                passKey: type,
                //oldValue: value
            },
            onRightButtonPress: () => {
                var tags = this.props.userData.tags;
                //console.log(tags);
                var type = this.state.type;
                var value = this.state.temp;
                tags[type].push(value);
                //console.log(tags[type]);

                var path = Service.host + Service.addTag;
                var params = {
                    userID: this.props.userData._id,
                    type: type,
                    newValue: value,
                    opt: 'add',
                };
                var self = this;
                Util.post(path, params, function(data) {
                    console.log(data);
                    if(data.status) {
                        AlertIOS.alert('添加标签', '添加成功!');
                        self.setState({
                            userData: data.msg
                        });
                        //self.props.callbackParent(data.msg);
                        self.props.navigator.pop();           
                    } else {
                        AlertIOS.alert('添加标签', '添加失败!');
                        self.props.navigator.pop();
                    }
                });
            }
        });
    },
    tagMatch: function() {
        AlertIOS.alert('匹配通知', '系统会每间隔一段时间匹配，匹配结果将出现在联系人列表中，请耐心等待!');
        /*
        var z = 0;  
        var s = x.length + y.length;;  
      
        x.sort();  
        y.sort();  
        var a = x.shift();  
        var b = y.shift();  
      
        while(a !== undefined && b !== undefined) {  
            if (a === b) {  
                z++;  
                a = x.shift();  
                b = y.shift();  
            } else if (a < b) {  
                a = x.shift();  
            } else if (a > b) {  
                b = y.shift();  
            }  
        }  
        return z/s * 200;  
         */
    },


    render: function() {
        var tags_1 = [], 
            tags_2 = [];
        //var tags = this.props.userData.tags;
        var selfTags = this.state.yourself || ['handsome', 'rich'];
        var otherTags = this.state.otherSide || ['beautiful'];
        for(var i in selfTags) {
            tags_1.push(
                <TouchableOpacity key={selfTags[i]}>
                    <View>
                        <Text style={styles.itemText}>{selfTags[i]}</Text> 
                    </View>
                </TouchableOpacity>
            )
            
        }
        for(var i in otherTags) {
            tags_2.push(
                <TouchableOpacity key={otherTags[i]}>
                    <View>
                        <Text style={styles.itemText}>{otherTags[i]}</Text> 
                    </View>
                </TouchableOpacity>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>我的标签</Text>
                <View style={styles.list}>                    
                    {tags_1}
                    <View>
                        <TouchableHighlight underlayColor="#fff" style={styles.addBtn} onPress={this.editTag.bind(this, '我的标签', 'yourself')}>
                            <Text style={{color:'#aaa', fontSize: 32,}}>+</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Text style={styles.title}>ta的标签</Text>
                <View style={styles.list}>
                    {tags_2}
                    <View>
                        <TouchableHighlight underlayColor="#fff" style={styles.addBtn} onPress={this.editTag.bind(this, 'ta的标签', 'otherSide')}>
                            <Text style={{color:'#aaa', fontSize: 32,}}>+</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableHighlight underlayColor="#fff" style={styles.matchBtn} onPress={this.tagMatch}>
                        <Text style={{color:'#fff', fontSize: 16,}}>匹配</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>         
        );
    },

});

var styles = StyleSheet.create({
    container: {

    },
    title: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 10,
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 10,
    },
    itemText: {
        fontSize: 15,
        padding: 6,
        margin: 6,
        backgroundColor: '#ccffff',
    },
    addBtn: {
        //padding: 6,
        marginLeft: 10,
    },
    matchBtn: {
        marginTop: 30,
        width: 300,
        height: 40,
        backgroundColor: '#3BC1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    btnContainer: {
        alignItems: 'center',
    }
});

module.exports = MyTag;