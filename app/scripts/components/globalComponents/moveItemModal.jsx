import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { Kind, Path } from '../../util/urlEnum';
import { List, ListItem } from 'material-ui/List';
import Archive from 'material-ui/svg-icons/content/archive.js';
import CircularProgress from 'material-ui/CircularProgress';
import ContentPaste from 'material-ui/svg-icons/content/content-paste.js';
import Folder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';
import KeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-backspace.js';
import Paper from 'material-ui/Paper';

let MoveItemModal = observer(React.createClass({

    getInitialState() {
        return {
            goBack: false,
            openChildren: false,
            projectChildren: false,
            showWarning: false
        };
    },

    render(){
        const { entityObj, moveItemLoading, moveToObj, moveItemList, selectedEntity } = mainStore;
        let ancestors = [];
        let children = [];
        let projectChildren = [];
        let openItem = <span></span>;
        let itemId = selectedEntity && selectedEntity !== null ? selectedEntity.id : entityObj.id;

        if (!this.state.projectChildren && moveToObj) {
            if (itemId === moveToObj.id) {
                openItem = <span></span>
            }
            if (itemId != moveToObj.id && !this.state.openChildren) {
                openItem = <span></span>;
            }
            if (itemId != moveToObj.id && this.state.openChildren) {
                openItem = <ListItem
                    style={styles.listItem}
                    value={moveToObj.id}
                    primaryText={moveToObj.name}
                    leftIcon={<Folder />}
                    onTouchTap={() => this.selectedLocation(moveToObj.id, moveToObj.kind)}
                    rightIconButton={<IconButton tooltip="move here" tooltipPosition="bottom"><Archive style={styles.rightIcon} color={Color.pink} onTouchTap={() => this.handleMove(moveToObj.id, moveToObj.kind)}/></IconButton>}/>
            }
        }

        if (moveToObj && moveToObj.ancestors) {
            ancestors = moveToObj.ancestors.map((item) => {
                if (item.id === itemId) {
                    return (
                        <span key={item.id}></span>
                    )
                }
                if (item.kind === 'dds-project') {
                    return (
                        <ListItem key={item.id}
                                  style={styles.listItem}
                                  value={item.id}
                                  primaryText={item.name}
                                  leftIcon={<ContentPaste />}
                                  onTouchTap={() => this.getProjectChildren(item.id)}
                                  rightIconButton={<IconButton tooltip="move here" tooltipPosition="bottom"><Archive style={styles.rightIcon} color={Color.pink} onTouchTap={() => this.handleMove(item.id, item.kind)}/></IconButton>}/>
                    )
                } else {
                    return (
                        <span key={item.id}></span>
                    )
                }
            });
        }

        if (moveItemList && this.state.openChildren) {
            children = moveItemList.map((children) => {
                if (children.id === itemId || children.parent.id === itemId) {
                    return (
                        <span key={children.id}></span>
                    )
                }
                if (children.kind === 'dds-folder' && !this.state.projectChildren) {
                    return (
                        <ListItem key={children.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 20}}
                                  value={children.id}
                                  primaryText={children.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(children.id, children.kind)}
                                  rightIconButton={<IconButton tooltip="move here" tooltipPosition="bottom"><Archive style={styles.rightIcon} color={Color.pink} onTouchTap={() => this.handleMove(item.id, item.kind)}/></IconButton>}/>
                    )
                } else {
                    return (
                        <span key={children.id}></span>
                    )
                }
            });
        }

        if (moveItemList && this.state.projectChildren) {
            projectChildren = moveItemList.map((children) => {
                if (children.id === itemId || children.parent.id === itemId) {
                    return (
                        <span key={children.id}></span>
                    )
                }
                if (children.kind === 'dds-folder') {
                    return (
                        <ListItem key={children.id + children.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 20}}
                                  value={children.id}
                                  primaryText={children.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(children.id, children.kind)}
                                  rightIconButton={<IconButton tooltip="move here" tooltipPosition="bottom"><Archive style={styles.rightIcon} color={Color.pink} onTouchTap={() => this.handleMove(item.id, item.kind)}/></IconButton>}/>
                    )
                } else {
                    return (
                        <span key={children.id}></span>
                    )
                }
            });
        }

        return (
            <div>
                <div style={styles.backButtonWrapper}>
                    {this.state.goBack ? <a href="" onTouchTap={() => this.goBack()}>
                        <IconButton tooltip="Previous" style={{float: 'left'}}>
                            <KeyboardBackspace />
                        </IconButton>
                        <div className="mdl-color-text--grey-800"
                             style={styles.backButton}>Back
                        </div>
                    </a> : null}
                </div>
                {this.state.showWarning ? <Paper className="mdl-cell mdl-cell--12-col" style={styles.warning} zDepth={1}>
                        <span>The item you're trying to move is already located here. Please pick another
                            location to move to</span>
                </Paper> : null}
                {!moveItemLoading ? <List value={3}>
                    {ancestors}
                    {projectChildren}
                    {openItem}
                    {children}
                </List> : <CircularProgress size={60} thickness={5} style={styles.loading}/>}
            </div>
        )
    },

    handleMove(destinationId, destinationKind) {
        const {parent, selectedEntity} = mainStore;
        let id = selectedEntity && selectedEntity !== null ? selectedEntity.id : this.props.params.id;
        let kind = selectedEntity && selectedEntity !== null ? selectedEntity.kind : this.props.entityObj.kind;
        let transitionToParent = (root, parentId) => {
            setTimeout(()=>{this.props.router.push(root + parentId)}, 500)
        };
        if (destinationId === parent.id || destinationId === id) {
            this.setState({showWarning: true});
        } else {
            mainStore.moveItem(id, kind, destinationId, destinationKind);
            if (parent.kind === Kind.DDS_FOLDER) {
                transitionToParent('/folder/', parent.id);
            } else {
                transitionToParent('/project/', parent.id);
            }
            this.setState({showWarning: false});
            mainStore.toggleModals('moveItem');
        }
    },

    openListItem(id, parentKind){
        let requester = 'moveItemModal';
        mainStore.getEntity(id, Path.FOLDER, requester);
        mainStore.selectMoveLocation(id, parentKind);
        mainStore.getMoveItemList(id, Path.FOLDER);
        this.setState({
            goBack: true,
            openChildren: true,
            projectChildren: false,
            showWarning: false
        })
    },

    goBack(){
        const {moveToObj} = mainStore;
        let requester = 'moveItemModal';
        let parentKind = moveToObj.parent.kind;
        let parentId = moveToObj.parent.id;
        mainStore.selectMoveLocation(parentId, parentKind);
        if (parentKind === 'dds-folder') {
            mainStore.getEntity(parentId, Path.FOLDER, requester);
            mainStore.getChildren(parentId, Path.FOLDER);
        } else {
            mainStore.getChildren(parentId, Path.PROJECT);
            this.setState({
                goBack: false,
                openChildren: false,
                showWarning: false
            })
        }
    },

    getProjectChildren(id){
        mainStore.getMoveItemList(id, Path.PROJECT);
        this.setState({
            openChildren: false,
            projectChildren: true,
            showWarning: false
        })
    },

    selectedLocation(parentId, parentKind){
        mainStore.selectMoveLocation(parentId, parentKind)
    }
}));

const styles = {
    backButton: {
        float: 'left',
        marginLeft: -10,
        marginTop: 14
    },
    backButtonWrapper: {
        float: 'left',
        marginLeft: 4,
        marginTop: -30
    },
    listItem: {
        textAlign: 'left'
    },
    loading: {
        position: 'absolute',
        margin: '0 auto',
        left: 0,
        right: 0
    },
    rightIcon: {
        position: 'absolute',
        top: 10,
        right: 4
    },
    warning: {
        backgroundColor: Color.ltRed,
        color: '#EEEEEE',
        height: 40,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        textAlign: 'center'
    }
};

MoveItemModal.propTypes = {
    entityObj: object,
    selectedEntity: object,
    moveItemList: array,
    moveToObj: object,
    moveItemLoading: bool
}

export default MoveItemModal;