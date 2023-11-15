import React, { Component } from 'react';
import { Image, Text, View, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Colors from './views/primitives/Colors';
const App = require('./App').default;
import AsyncStorage from '@react-native-async-storage/async-storage';

class ServerUrlConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverUrl: '',
            submitted: false,
            isValidUrl: true,
        };
    }

    isUrlValid = (url) => {
        const urlRegex = /^(https?:\/\/)?(?!www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return urlRegex.test(url);
    };

    handleUrlChange = (text) => {
        this.setState({ serverUrl: text, isValidUrl: true });
    };

    handleSubmit = () => {
        if (this.isUrlValid(this.state.serverUrl)) {
            this.storeServerUrl();
            this.setState({ submitted: true });
        } else {
            this.setState({ isValidUrl: false });
        }
    };

    storeServerUrl = async () => {
        try {
            await AsyncStorage.setItem('serverUrl', this.state.serverUrl);
            console.log('Server URL stored successfully');
        } catch (error) {
            console.error('Error storing server URL:', error);
        }
    };

    render() {
        const { width, height } = Dimensions.get('window');

        return (
            this.state.submitted ? <App /> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: 'asset:/logo.png' }} style={{ height: 120, width: 120, alignSelf: 'center' }} resizeMode={'center'} />

                    <View style={{ paddingHorizontal: 48, marginTop: 20, width: '80%' }}>
                        <TextInput
                            value={this.state.serverUrl}
                            onChangeText={this.handleUrlChange}
                            placeholder="Enter Server URL"
                            style={{
                                borderBottomWidth: 1,
                                borderColor: Colors.primaryColor,
                                paddingVertical: 8,
                                fontSize: 16,
                            }}
                        />

                        {!this.state.isValidUrl && (
                            <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Please enter a valid server URL.</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => {
                                this.handleSubmit();
                            }}
                            style={{
                                marginTop: 20,
                                backgroundColor: this.state.serverUrl && this.state.isValidUrl ? "#009973" : "gray",
                                paddingVertical: 10,
                                borderRadius: 5,
                                alignItems: 'center',
                            }}
                            disabled={!this.state.serverUrl || !this.state.isValidUrl}
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        );
    }
}

export default ServerUrlConfiguration;
