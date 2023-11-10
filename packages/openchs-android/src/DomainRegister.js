import React, { Component } from 'react';
import { Image, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Colors from './views/primitives/Colors';  // Import Colors if needed
const App = require('./App').default;
domainName="example.com";
import AsyncStorage from '@react-native-async-storage/async-storage';

class DomainRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainName: '',
            submitted: false,
        };
    }

    handleDomainNameChange = (text) => {
        this.setState({ domainName: text });
    };

    handleSubmit = () => {
        console.log('Submit button clicked');
        console.log('Submitted domain name:', this.state.domainName);
        this.storeDomainName();
        this.setState({ submitted: true });
    };

    storeDomainName = async () => {
      try {
        await AsyncStorage.setItem('domain', this.state.domainName);
        console.log('Domain name stored successfully');
      } catch (error) {
        console.error('Error storing domain name:', error);
      }
    };

    render() {
        const { width, height } = Dimensions.get('window');

        return (
        this.state.submitted ? <App />:
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: 'asset:/logo.png' }} style={{ height: 120, width: 120, alignSelf: 'center' }} resizeMode={'center'} />

                <View style={{ paddingHorizontal: 48, marginTop: 20, width: '80%' }}>
                    <TextInput
                        value={this.state.domainName}
                        onChangeText={this.handleDomainNameChange}
                        placeholder="Enter Domain name"
                        style={{
                            borderBottomWidth: 1,
                            borderColor: Colors.primaryColor,  // Change this color if needed
                            paddingVertical: 8,
                            fontSize: 16,
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            console.log('Button clicked');
                            this.handleSubmit();
                        }}
                        style={{
                            marginTop: 20,
                            backgroundColor: this.state.domainName ? "blue" : "gray",
                            paddingVertical: 10,
                            borderRadius: 5,
                            alignItems: 'center',
                        }}
                        disabled={!this.state.domainName}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

export default DomainRegister;
