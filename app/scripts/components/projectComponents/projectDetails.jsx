import React, { PropTypes } from 'react';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import Details from './details.jsx';
import UploadManager from '../globalComponents/uploadManager.jsx';
import {UrlGen} from '../../util/urlEnum';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'

@observer
class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDetails: false,
            showClass: 'hide-details'
        }
    }

    render() {
        const { project, projPermissions } = mainStore;
        let createdBy = project && project.audit ? project.audit.created_by.full_name : null;
        let projectName = project ? project.name : null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let uploadMdl = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            uploadMdl = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <UploadManager {...this.props}/>;
            optionsMenu = prjPrm === 'prjCrud' ? <ProjectOptionsMenu {...this.props} /> : null;
        }
        return (
            <Card className="project-container"
                style={styles.container}>
                { uploadMdl }
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={UrlGen.routes.home()} style={styles.back} className="external mdl-color-text--grey-800">
                            <i className="material-icons mdl-color-text--grey-800" style={styles.backIcon}>keyboard_backspace</i>
                            Back
                        </a>
                        <div style={styles.menuIcon}>
                            { optionsMenu }
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--9-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4 style={styles.projectName}>{ projectName }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.details}>
                        Created By: {' '+ createdBy }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <FlatButton
                            label={'PROJECT DETAILS'}
                            labelPosition="before"
                            secondary={true}
                            onTouchTap={() => this.showDetails()}
                            icon={!this.state.showDetails ? <KeyboardArrowDown color={'#235f9c'} /> : <KeyboardArrowUp color={'#235f9c'} />}
                        />
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.moreDetails} className={this.state.showClass}>
                            { this.state.showDetails ? <Details {...this.props} {...this.state}/> : null }
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    showDetails() {
        this.setState((prevState) => {
            return {
                showDetails: !prevState.showDetails,
                showClass: prevState.showClass === 'show-details' ? 'hide-details' : 'show-details'
            }
        })
    }
}

const styles = {
    container: {
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginTop: 10,
        fontWeight: 200
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginTop: 0
    },
    details2: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginTop: 19
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
        textAlign: 'right'
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right',
        // marginTop: 32,
        // marginRight: -5
    },
    projectName: {
        margin: 0,
        fontWeight: 200
    },
    backIcon: {
        fontSize: 24,
        float: 'left'
    },
    arrow: {
        textAlign: 'left'
    },
    back: {
        verticalAlign: -2
    }
};

ProjectDetails.contextTypes = {
    muiTheme: object
};

ProjectDetails.propTypes = {
    project: object,
    projPermissions: string
};

export default ProjectDetails;