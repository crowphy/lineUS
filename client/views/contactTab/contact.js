'use strict';

var Util = require('../util');
var ContactDetail = require('./contactDetail');

import React, {
        StyleSheet,
        View,
        Text,
        Component,
        ListView,
        ActivityIndicatorIOS,
        TouchableHighlight,
        Image,
        ScrollView,
        TouchableOpacity,
        AsyncStorage,
} from 'react-native';

var styles = StyleSheet.create({
    listview: {
        backgroundColor: '#CCFFFF',
    },
    text: {
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 7,
        backgroundColor: '#F5FCFF',
        borderBottomWidth: 1,
        borderBottomColor: '#CCEEEE',
        paddingHorizontal: 10,
    },
    section: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#EEEEEE',
    },
});

var ContactList = React.createClass({
    getInitialState: function() {
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[rowID];
        };
        return {
            dataSource : new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        };
    },

    componentWillMount: function() {
        this.updateDataSource(this.props.userData);
    },

    componentWillReceiveProps: function() {
        this.updateDataSource(this.props.userData);
    },

    updateDataSource: function(data) {
        var contacts = data.contacts;
        var dataBlob = {matched: '已匹配', unmatched: '待匹配'};
        var sectionIDs = ['matched', 'unmatched'];
        var rowIDs = [[], []];
        var matched = [];
        var unmatched = [];

        contacts.forEach(function(item) {
            if(item) {
                if(item.isMatched) {
                    matched.push(item);
                    var rowName = item.contactName;
                    rowIDs[0].push(rowName);
                    dataBlob[rowName] = item;
                } else {
                    unmatched.push(item);
                    var rowName = item.contactName;
                    rowIDs[1].push(rowName);
                    dataBlob[rowName] = item;
                }
            }
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
        });
    },

    _onChildChanged: function(contacts) {
        this.props.callbackParent(contacts);
    },

    renderRow: function(rowData, sectionID, rowID) {
        return (
                <TouchableHighlight onPress={() => this.showDetail(rowData)} style={styles.row} underlayColor="#dddddd">
                    <View>
                     <Text>{rowData.contactName}</Text><Text>{rowData.contactPhoneNum}</Text>
                    </View>
                </TouchableHighlight>
        );
    },

    renderSectionHeader: function(sectionData, sectionID) {
        return (
                <View style={styles.section}>
                    <Text style={styles.text}>
                        {sectionData}
                    </Text>
                </View>
        );
    },

    showDetail: function(contactInfo) {
        this.props.navigator.push({
            title: '详情',
            component: ContactDetail,
            passProps: {
                userData: this.props.userData,
                contact: contactInfo,
                callbackParent: this._onChildChanged
            }
        });
    },

    render: function() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderSectionHeader={this.renderSectionHeader}
                renderRow={this.renderRow}
                initialListSize={20}
                pageSize={4}
                scrollRenderAheadDistance={500}
                style={styles.listView}
            />
        );
    },

});

module.exports = ContactList;