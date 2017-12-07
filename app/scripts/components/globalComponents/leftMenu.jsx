import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import {Color} from '../../theme/customTheme';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends React.Component {

        componentWillMount() {
            mainStore.setLeftNavIndex(this.props.router.location.pathname)
        }

        handleRequestChange = (event, index) => {
            this.props.router.replace(index)
        };

        render() {
            const { leftNavIndex } = mainStore;
            return (
                <ComposedComponent style={styles.listContainer} value={leftNavIndex} onChange={this.handleRequestChange}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}

SelectableList = observer(wrapState(SelectableList));

@observer
class LeftMenu extends React.Component {

    render() {
        const { screenSize, showSearch, toggleNav } = mainStore;
        const drawerWidth = screenSize.width >= 700 ? 240 : screenSize.width;

        return (
            <Drawer width={drawerWidth} open={toggleNav && !showSearch} zDepth={0} containerStyle={styles.drawer}>
                <Toolbar style={styles.toolbar}>
                    <ToolbarGroup firstChild={true} style={styles.toolbar.firstToolbarGroup}>
                        <a href="#" onTouchTap={()=>this.toggleNav()}><FontIcon className="material-icons" style={styles.openIcon}>menu</FontIcon></a>
                        <img src="/images/dukeDSVertical.png" style={styles.logo}/>
                    </ToolbarGroup>
                </Toolbar>
                <SelectableList router={this.props.router}>
                    <ListItem
                        value={'/'}
                        onClick={() => this.setNavIndex('/')}
                        leftIcon={<i className="material-icons" style={styles.navIcon}>home</i>}
                        primaryText="Home"
                    />
                    <ListItem
                        value={'/metadata'}
                        onClick={() => this.setNavIndex('/metadata')}
                        leftIcon={<i className="material-icons" style={styles.navIcon}>local_offer</i>}
                        primaryText="Advanced Metadata"
                    />
                    <ListItem
                        value={'/agents'}
                        onClick={() => this.setNavIndex('/agents')}
                        primaryText="Software Agents"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>build</i>}
                    />
                    <Divider/>
                    <ListItem
                        value={0}
                        onClick={() => this.linkToBlog('https://medium.com/@dukedataservice')}
                        primaryText="Duke DS Blog"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>rate_review</i>}
                    />
                    <ListItem
                        value={'/privacy'}
                        onClick={() => this.setNavIndex('/privacy')}
                        primaryText="Privacy Policy"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>lock</i>}
                    />
                    <Divider/>
                    <ListItem
                        value={1}
                        onClick={() => this.handleLogout()}
                        primaryText="Log Out"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>exit_to_app</i>}
                    />
                </SelectableList>
            </Drawer>
        );
    }

    linkToBlog(link) {
        const { screenSize } = mainStore;
        screenSize.width < 700 ? this.toggleNav() : null;
        const win = window.open(link, '_blank');
        win ? win.focus() : alert('Please allow popups for this website');
    }

    setNavIndex(index) {
        const { screenSize } = mainStore;
        mainStore.setLeftNavIndex(index);
        screenSize.width < 700 ? this.toggleNav() : null;
    }

    toggleNav() {
        mainStore.toggleNavDrawer();
    }

    handleLogout() {
        authStore.handleLogout();
        location.reload();
    }
}

const styles = {
    drawer: {
        backgroundColor: Color.ltGrey3,
        position: 'absolute'
    },
    logo: {
        width: '20%',
        maxWidth: '20%',
        minWidth: 58,
        minHeight: 46,
        marginBottom: 4
    },
    listContainer: {
        padding: '8px 4px'
    },
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    },
    openIcon: {
        fontSize: 24,
        color: Color.white,
        margin: '4px 10px 0px 10px'
    },
    toolbar: {
        height: 56,
        backgroundColor: Color.blue,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        firstToolbarGroup: {
            backgroundColor: Color.blue,
            justifyContent: 'flex-start'
        }
    }
};

export default LeftMenu;