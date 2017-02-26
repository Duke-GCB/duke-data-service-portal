import React from 'react';
import { observer, inject } from 'mobx-react';
import Header from '../components/globalComponents/header.jsx';
//import MainActions from '../actions/mainActions.js';
//import mainStore from '../stores/mainStore.js';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {UrlGen} from '../../util/urlEnum';

@inject('authStore', 'mainStore') @observer
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.authStore = this.props.authStore;
    }

    componentDidMount() {
        if(this.props.location.pathname !== '/404' && this.authStore.appConfig.apiToken ) this.props.router.push('/');
    }

    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== '/login' && !this.authStore.authServiceLoading) this.authStore.setLoadingStatus();
        if(this.authStore.appConfig.apiToken) {
            if (localStorage.getItem('redirectTo') !== null) {
                let redUrl = localStorage.getItem('redirectTo');
                document.location.replace(redUrl);
            } else {
                this.props.router.push('/');
            }
        }
    }

    createLoginUrl = () => {
        return this.authStore.appConfig.authServiceUri+'&state='+this.authStore.appConfig.serviceId+'&redirect_uri='+window.location.href;
    }
s
    render() {
        let content = '';
        const {error} = this.props.mainStore;
        const {appConfig, authServiceLoading} = this.props.authStore;
        if (!appConfig.apiToken) {
            let url = window.location.hash.split('&');
            let accessToken = url[0].split('=')[1];
            content = (
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.loginWrapper}>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                        <img src="images/dukeDSLogo.png" style={styles.logo}/>
                        <h2 style={{fontWeight: '100'}}>Duke Data Service</h2>
                        {!authServiceLoading ? <a href={this.createLoginUrl()} className="external">
                            <RaisedButton
                                label="Log In" labelStyle={{fontWeight: '400'}} labelColor={'#f9f9f9'}
                                backgroundColor={'#0680CD'} style={{marginBottom: 40, width: 150}}
                                onClick={() => this.handleLoginBtn()}>
                            </RaisedButton>
                        </a> : <CircularProgress size={70} thickness={5} color="#fff"/>}
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                            <a href={UrlGen.routes.publicPrivacy()} className="external mdl-color-text--white" style={{float: 'right', fontSize: 10, margin: -10}}>
                                <i className="material-icons" style={styles.privacyIcon}>lock</i>Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            );
            if (accessToken && appConfig.serviceId !== null) this.authStore.getApiToken(accessToken);
            if (error !== null) content = error
        }
        return (
            <div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }

    handleLoginBtn() {
        this.authStore.isLoggedInHandler();
    }
}

var styles = {
    loginWrapper: {
        maxWidth: 600,
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        padding: 20,
        overflow: 'auto',
        backgroundColor: '#235F9C',
        fontColor: '#f9f9f9'
    },
    logo: {
        maxWidth: '26.333%'
    },
    privacyIcon: {
        fontSize: 16,
        verticalAlign: -2
    }
};

export default Login;
