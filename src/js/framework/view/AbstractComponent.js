import React, {Component, View, Text} from 'react';
import {ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {Map} from 'immutable';
import _ from "lodash";
import MessageService from "../../service/MessageService";
import General from '../../utility/General';

class AbstractComponent extends Component {
    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func
    };

    constructor(props, context, topLevelStateVariable) {
        super(props, context);
        this.topLevelStateVariable = topLevelStateVariable;
        this.I18n = context.getService(MessageService).getI18n();
    }

    static styles = StyleSheet.create({
        spinner: {
            justifyContent: 'center',
            alignSelf: 'center',
        },
        listRowSeparator: {
            height: 2,
            backgroundColor: '#14e4d5'
        },
    });

    dispatchAction(action, params) {
        console.log(`Dispatching action: ${JSON.stringify(action)}`);
        this.context.getStore().dispatch({"type": action, ...params});
    }

    getContextState(param) {
        return this.context.getStore().getState()[param];
    }

    showError(errorMessage) {
        Alert.alert(this.I18n.t("validationError"), errorMessage,
            [
                {
                    text: this.I18n.t('ok'), onPress: () => {}
                }
            ]
        );
    }

    static _renderSeparator(rowNumber, rowID, total) {
        if (rowNumber === (total - 1) || rowNumber === `${(total - 1)}` || total === 0 || total === undefined) {
            return (<View key={rowID}/>);
        }
        return (<Text key={rowID} style={AbstractComponent.styles.listRowSeparator}/>);
    }

    componentWillMount() {
        if (_.isNil(this.topLevelStateVariable)) return;
        this.unsubscribe = this.context.getStore().subscribe(this.refreshState.bind(this));
        this.refreshState();
    }

    refreshState() {
        const nextState = this.getContextState(this.topLevelStateVariable);
        if (!General.areEqualShallow(nextState, this.state)) {
            if (!_.isNil(nextState.error))
                this.showError(nextState.error.message);
            this.setState(nextState);
        }
    }

    componentWillUnmount() {
        if (_.isNil(this.topLevelStateVariable)) return;
        this.unsubscribe();
    }
}

export default AbstractComponent;
