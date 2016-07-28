var React = require('react-native');

var {
        View,
        Text,
        StyleSheet,
        TouchableOpacity,
        TextInput,
        } = React;


var EditPage = React.createClass({
    getInitialState: function() {
        return {
            oldValue: this.props.oldValue
        }
    },
    render: function(){
        return (
            <View style={styles.container}>
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        autoFocus={true} 
                        defaultValue={this.state.oldValue || ''} 
                        onChangeText={this._getValue}
                    />
                </View>
            </View>
        );
    },
    _getValue: function(value) {
        this.props.callbackParent(this.props.passKey, value);
    }
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    inputRow: {
        marginTop: 90,
        width: 300,
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
        borderColor: '#777'
    }
});

module.exports = EditPage;