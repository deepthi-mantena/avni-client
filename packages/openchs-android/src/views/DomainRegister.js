import DeviceInfo from 'react-native-device-info';
import React from 'react';
import AbstractComponent from '../framework/view/AbstractComponent';
import Path from '../framework/routing/Path';
import {
    Alert,
    Text,
    TouchableNativeFeedback,
    View,
    BackHandler, Image, Dimensions
} from 'react-native';
import TextFormElement from './form/formElement/TextFormElement';
import StaticFormElement from './viewmodel/StaticFormElement';
import {LoginActionsNames as Actions} from '../action/LoginActions';
import {PrimitiveValue, ErrorCodes} from 'avni-models';
import Reducers from '../reducer';
import CHSNavigator from '../utility/CHSNavigator';
import CHSContainer from './common/CHSContainer';
import CHSContent from './common/CHSContent';
import Styles from './primitives/Styles';
import Colors from './primitives/Colors';
import _ from 'lodash';
import {Checkbox as CheckBox, ScrollView, Spinner} from "native-base";
import General from '../utility/General';
import AuthService from '../service/AuthService';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import Fonts from './primitives/Fonts';
import Config from '../framework/Config';
import DBRestoreProgress from './DBRestoreProgress';
import SyncService from '../service/SyncService';
import TypedTransition from '../framework/routing/TypedTransition';
import SetPasswordView from './SetPasswordView';
import LandingView from './LandingView';
import {IDP_PROVIDERS} from "../model/IdpProviders";
import EnvironmentConfig from "../framework/EnvironmentConfig";
import {EntityMappingConfig} from "openchs-models";
import EntityService from "../service/EntityService";

@Path('/domainRegister')
class DomainRegister extends AbstractComponent {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.dispatchAction(Actions.ON_LOAD);
    }

    viewName() {
        return 'DomainRegister';
    }

    render() {
        const {width, height} = Dimensions.get('window');
        return (
            <CHSContainer>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <DBRestoreProgress/>
                    <CHSContent>
                        <View style={{
                            minHeight: height,
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minHeight: height * 0.8,
                                paddingHorizontal: 48
                            }}>
                                <Image source={{uri: `asset:/logo.png`}}
                                       style={{height: 120, width: 120, alignSelf: 'center',}} resizeMode={'center'}/>

                                <View>
                                    <TextFormElement element={new StaticFormElement('Domain Name')}
                                                     multiline={false}
                                                     autoCapitalize={'none'}
                                                     keyboardType={'email-address'}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16}}>
                                <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}>
                                                    <View style={[Styles.basicPrimaryButtonView,
                                                        {minWidth: 144, width: '100%', flex: 1, flexDirection: "row", justifyContent: "center"}]}>
                                                        <Text style={{
                                                            color: Styles.whiteColor,
                                                            fontSize: 16
                                                        }}>{this.I18n.t('SUBMIT')}</Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                minHeight: height * 0.15,
                                paddingLeft: 16
                            }}>
                                <Text>Powered by Avni (Version {DeviceInfo.getVersion()}-{Config.COMMIT_ID})</Text>
                                {!EnvironmentConfig.isProd() &&
                                <>
                                    <Text style={{
                                        fontSize: Styles.normalTextSize,
                                        fontStyle: 'normal',
                                        color: Styles.blackColor,
                                        marginVertical: 0,
                                    }}>{Config.ENV}</Text>
                                    <Text style={Styles.textList}>Actual Schema Version : <Text
                                        style={{
                                            color: 'black',
                                            fontSize: Styles.normalTextSize
                                        }}>{this.getService(EntityService).getActualSchemaVersion()}</Text></Text>
                                    <Text style={Styles.textList}>Code Schema Version: <Text
                                        style={{
                                            color: 'black',
                                            fontSize: Styles.normalTextSize
                                        }}>{EntityMappingConfig.getInstance().getSchemaVersion()}</Text></Text>
                                </>
                                }
                            </View>
                        </View>
                    </CHSContent>
                </ScrollView>
            </CHSContainer>
        );
    }
}

export default DomainRegister;
