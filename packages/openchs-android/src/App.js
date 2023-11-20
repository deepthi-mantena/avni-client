import {Alert, Clipboard, NativeModules, Text, View} from "react-native";
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import PathRegistry from './framework/routing/PathRegistry';
import './views';
import _ from "lodash";
import {RegisterAndScheduleJobs} from "./AvniBackgroundJob";
import ErrorHandler from "./utility/ErrorHandler";
import FileSystem from "./model/FileSystem";
import GlobalContext from "./GlobalContext";
import RNRestart from 'react-native-restart';
import AppStore from "./store/AppStore";
import RealmFactory from "./framework/db/RealmFactory";
import General from "./utility/General";
import EnvironmentConfig from "./framework/EnvironmentConfig";
import Config from './framework/Config';

const {TamperCheckModule} = NativeModules;

class App extends Component {
    static childContextTypes = {
        getService: PropTypes.func.isRequired,
        getDB: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        FileSystem.init();
        this.getBean = this.getBean.bind(this);
        this.handleError = this.handleError.bind(this);
        ErrorHandler.set(this.handleError);
        this.state = {error: '', isInitialisationDone: false};
    }

    handleError(error, stacktrace) {
        //It is possible for App to not be available during this time, so check if state is available before setting to it
        this.setState && this.setState({error, stacktrace});
    }

    getChildContext = () => ({
        getDB: () => GlobalContext.getInstance().db,
        getService: (serviceName) => {
            return GlobalContext.getInstance().beanRegistry.getService(serviceName);
        },
        getStore: () => GlobalContext.getInstance().reduxStore,
    });

    renderError() {
        const clipboardString = `${this.state.error.message}\nStacktrace:${this.state.stacktrace}`;
        General.logError("App", `renderError: ${clipboardString}`);

        if (EnvironmentConfig.inNonDevMode() && !Config.allowServerURLConfig) {
            Alert.alert("App will restart now", this.state.error.message,
                [
                    {
                        text: "Copy error and Restart",
                        onPress: () => {
                            Clipboard.setString(clipboardString);
                            RNRestart.Restart();
                        }
                    }
                ],
                {cancelable: false}
            );
        }
        return <View/>;
    }

    getBean(name) {
        return GlobalContext.getInstance().beanRegistry.getService(name);
    }

    async componentDidMount() {
        General.logDebug("App", "componentDidMount");
        try {
            if(!_.isNil(TamperCheckModule)) TamperCheckModule.validateAppSignature();


            const globalContext = GlobalContext.getInstance();
            if (!globalContext.isInitialised()) {
                await globalContext.initialiseGlobalContext(AppStore, RealmFactory);
                globalContext.routes = PathRegistry.routes();
            }

            const entitySyncStatusService = globalContext.beanRegistry.getService("entitySyncStatusService");
            entitySyncStatusService.setup();

            RegisterAndScheduleJobs();
            this.setState(state => ({...state, isInitialisationDone: true }));
        } catch (e) {
            console.log("App", e);
            this.setState(state => ({...state, error: e }));
        }
    }

    render() {
        if (this.state.error) {
            return this.renderError();
        }
        if (!_.isNil(GlobalContext.getInstance().routes) && this.state.isInitialisationDone) {
            return GlobalContext.getInstance().routes
        }
        return (
           <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Loading...</Text>
           </View>);
    }
}

export default App;
