import React from 'react';
import { observer } from 'mobx-react';
import ProjectActions from '../../actions/projectActions';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import {Kind, Path} from '../../../util/urlEnum';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

@observer
class FolderOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: ''
        }
    }

    render() {
        const {entityObj, selectedEntity, toggleModal} = this.props.projectStore;
        const {screenSize} = this.props.mainStore;
        let dltOpen = toggleModal && toggleModal.id === 'dltFile' ? toggleModal.open : false;
        let editOpen = toggleModal && toggleModal.id === 'editFile' ? toggleModal.open : false;
        let moveOpen = toggleModal && toggleModal.id === 'moveItem' ? toggleModal.open : false;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let id = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let parentId = selectedEntity !== null ? selectedEntity.parent.id : entityObj !== null ? entityObj.parent.id : null;
        let parentKind = selectedEntity !== null ? selectedEntity.parent.kind : entityObj !== null ? entityObj.parent.kind : null;
        let fName = selectedEntity !== null ? selectedEntity.name : null;
        if(fName === null) fName = entityObj && entityObj !== null ? entityObj.name : null;
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={()=>this.toggleModal('dltFolder')}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={()=>this.handleDeleteButton(id, parentId, parentKind)}/>
        ];
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={()=>this.toggleModal('editFolder')}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={()=>this.handleUpdateButton(id)}/>
        ];
        const moveActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={()=>this.handleCloseMoveModal()}/>
        ];
        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this folder?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={()=>this.toggleModal('dltFolder')}
                    open={dltOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p style={styles.msg}>Deleting this folder will also delete any folders or files contained inside of
                        this folder.</p>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Update Folder"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={()=>this.toggleModal('editFolder')}
                    open={editOpen}>
                    <form action="#" id="newFolderForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={()=>this.selectText()}
                            hintText="Folder Name"
                            defaultValue={fName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Folder Name"
                            ref={(input) => this.folderNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                    </form>
                </Dialog>
                <Dialog
                    {...this.props}
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Select Destination"
                    autoDetectWindowHeight={true}
                    actions={moveActions}
                    open={moveOpen}
                    onRequestClose={()=>this.handleCloseMoveModal()}>
                    <MoveItemModal {...this.props}/>
                </Dialog>
            </div>
        );
    }

    handleDeleteButton(id, parentId, parentKind) {
        let urlPath = parentKind === 'dds-project' ? '/project/' : '/folder/';
        ProjectActions.deleteFolder(id, parentId, parentKind);
        ProjectActions.toggleModals('dltFolder');
        setTimeout(()=>this.props.router.push(urlPath + parentId), 500)
    }

    handleUpdateButton(id) {
        let name = this.folderNameText.getValue();
        if (this.state.floatingErrorText) {
            return null
        } else {
            ProjectActions.editItem(id, name, Path.FOLDER, Kind.DDS_FOLDER);
            ProjectActions.toggleModals('editFolder');
        }
    }

    handleCloseMoveModal() {
        ProjectActions.toggleModals('moveItem');
    }

    selectText() {
        setTimeout(()=>{
            this.folderNameText.select();
        }, 100);
    }

    toggleModal(id) {
        ProjectActions.toggleModals(id);
    }

    validateText(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }
}
var styles = {
    addFolder: {
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    msg: {
        textAlign: 'left',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default FolderOptions;