import PropTypes from 'prop-types';
import React from "react";
import AbstractComponent from "../framework/view/AbstractComponent";
import Path from "../framework/routing/Path";
import {Text, View, TouchableNativeFeedback} from "react-native";
import Styles from "./primitives/Styles";
import {Checkbox as CheckBox, Spinner} from "native-base";
import CHSContainer from "./common/CHSContainer";
import CHSContent from "./common/CHSContent";
import AuthService from "../service/AuthService";
import CHSNavigator from "../utility/CHSNavigator";
import Colors from "./primitives/Colors";
import General from "../utility/General";
import {SecureTextInput} from "./common/SecureTextInput";

@Path('/changePasswordView')
class ChangePasswordView extends AbstractComponent {
    static propTypes = {
        user: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
    }

    forgotPassword() {
        CHSNavigator.navigateToForgotPasswordView(this);
    }

    UNSAFE_componentWillMount() {
        this.setState(() => {
            return {showPassword: false, showSpinner: false, password: '', newPassword: '', userId: ''}
        });
        let authService = this.context.getService(AuthService);
        authService.getAuthProviderService().getAuthToken().then(
            () => {
                authService.getAuthProviderService().getUserName().then(
                    (username) => {
                        this.setState(() => {
                            return {userId: username}
                        })
                    })
            },
            () => {
                CHSNavigator.navigateToLoginView(this, (source) => CHSNavigator.navigateToChangePasswordView(source, true));
            }
        )
    }

    errorMessage() {
        const error = this.state.errorMessage || '';
        return this.I18n.t(error.slice(error.indexOf(":") + 1).trim());
    }

    changePassword() {
        this.setState(() => {
            return {showSpinner: true}
        });

        this.context.getService(AuthService).getAuthProviderService()
            .changePassword(this.state.password, this.state.newPassword)
            .then(
                () => {
                    this.setState(() => {
                        showSpinner: false
                    });
                    CHSNavigator.navigateToLandingView(this, true, {tabIndex: 1, menuProps: {startSync: false}})
                },
                (error) => {
                    this.setState(() => {
                        return {errorMessage: error.message, showSpinner: false}
                    });
                }
            );
    }

    spinner() {
        return this.state.showSpinner ? (
            <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backgroundColor: Colors.defaultBackground
            }}>
                <Spinner/>
            </View>
        ) : <View/>
    }

    onToggleShowPassword() {
        this.setState((oldState) => {
            return {showPassword: !oldState.showPassword}
        });
    }

    viewName() {
        return "ChangePasswordView";
    }

    render() {
        General.logDebug(this.viewName(), 'render');
        return (
            <CHSContainer>
                <CHSContent>
                    <View style={{
                        padding: 72,
                        paddingTop: 144,
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                    }}>

                        <Text
                            style={Styles.formLabel}>{`${this.I18n.t("changePasswordFor", {userId: this.state.userId})}`}</Text>
                        <Text style={{
                            color: Colors.ValidationError,
                            justifyContent: 'center'
                        }}>{this.errorMessage()}</Text>

                        <SecureTextInput placeholder={this.I18n.t("currentPassword")} value={this.state.password}
                                         onChangeText={(password) => this.setState({password})}
                                         secureTextEntry={!this.state.showPassword}
                        />

                        <SecureTextInput placeholder={this.I18n.t("newPassword")} value={this.state.newPassword}
                                         onChangeText={(newPassword) => this.setState({newPassword})}
                                         secureTextEntry={!this.state.showPassword}
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingBottom: 16,
                            alignItems: 'center',
                            paddingTop: 8
                        }}>
                                    <TouchableNativeFeedback onPress={() => {
                                        this.onToggleShowPassword()
                                    }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <CheckBox isChecked={this.state.showPassword} onChange={() => {
                                                this.onToggleShowPassword()
                                            }}/>
                                            <Text style={[Styles.formLabel, {paddingLeft: 12}]}>{this.I18n.t("showPasswords")}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback onPress={() => {
                                        this.forgotPassword()
                                    }} background={TouchableNativeFeedback.SelectableBackground()}>
                                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                            <Text style={{
                                                color: Styles.accentColor,
                                                fontSize: 16
                                            }}>{this.I18n.t("forgotPassword")}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                        </View>

                        <TouchableNativeFeedback onPress={() => {
                            this.changePassword()
                        }} background={TouchableNativeFeedback.SelectableBackground()}>
                            <View style={[Styles.basicPrimaryButtonView, {flexDirection: "row", justifyContent: "center", alignSelf: 'flex-start', marginTop: 16, paddingHorizontal: 10, paddingVertical: 8}]}>
                                <Text style={{color: Styles.whiteColor, fontSize: 16}}>{this.I18n.t('changePassword')}</Text>
                            </View>
                        </TouchableNativeFeedback>

                        {this.spinner()}
                    </View>
                </CHSContent>
            </CHSContainer>
        )

    }
}

export
default
ChangePasswordView;
