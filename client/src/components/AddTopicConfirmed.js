import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useStyle from './useStyles';
import Alert from '@material-ui/lab/Alert';

export default class AddTopicConfirmed extends Component {
    _isMounted;
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
        }
        this.uploadTopic = this.uploadTopic.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // submitting new assignment!
    async uploadTopic() {
        if(this._isMounted) this.setState({uploading: true});
        const {values: { title, description, topics, id, dueDate, attachedFiles}} = this.props;
        const data = {title, description, topics, id, dueDate, multiChoice: false, choiceLimit: false}
        //console.log(data);
        const token = localStorage.getItem('token');
        const options = {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
                Authorization: `Add ${token}`
            },
            body: JSON.stringify(data),
        }

        if(attachedFiles.length > 0) {
            const formData = new FormData();
            for(let i=0; i<attachedFiles.length; i++) {
                formData.append('attachedFile', attachedFiles[i], attachedFiles[i].name)
            }
            const response = await fetch(`/api/uploads/${data.id}`, {method: 'POST', body: formData, headers: {Authorization: `Add ${token}`}})
            const json = await response.json();
            console.log(json);
            if (json.msg === 'forbidden') console.log('file upload error');
        }

        const response = await fetch('/api/add', options)
        const json = await response.json();
        if(json.msg === 'forbidden') this.props.uploadCheck(false);
        else {
            this.props.uploadCheck(true);
            if(this._isMounted) this.setState({uploading: false});
            this.props.nextStep();
        }
    }

    continue = e => {
        e.preventDefault();
        this.uploadTopic();
        this.props.nextStep();  
    }

    previous = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        

        const {values: { title, description, topics, dueDate, attachedFiles}} = this.props;
        const allTopics = topics.map(topic => {
            const {content, id} = topic;
            return (
            <p key={id} style={useStyle.pStyleTopics}>{content}</p>
            );
        });
        const allFiles = attachedFiles.map(file => {
            const {name} = file;
            return (
                <p key={name} style={useStyle.pStyleTopics}>{name}</p>
            )
        });
        return (
            <React.Fragment>  
                <Grid container spacing={2}>
                    <Grid item container>
                        <Grid item xs={2} lg={4}></Grid>
                        <Grid item xs={8} lg={4}>
                            <div style={useStyle.divContainer}>
                                <div style={{borderBottom: '3px solid #e91e63'}}>
                                    <h3 style={useStyle.h3Style}>Title</h3>
                                    <p style={useStyle.pStyleTitle}>{title}</p>
                                </div>
                                <div style={{borderBottom: '3px solid #e91e63'}}>
                                    <h3 style={useStyle.h3Style}>Description</h3>
                                    <p style={useStyle.pStyle}>{description}</p>
                                </div>
                                <div style={{borderBottom: '3px solid #e91e63'}}>
                                    <h3 style={useStyle.h3Style}>Topics</h3>
                                    <div style={{borderTop: '2px dashed #e91e63'}}>
                                        {allTopics}
                                    </div>
                                </div>
                                <div style={{borderBottom: '3px solid #e91e63'}}>
                                    <h3 style={useStyle.h3Style}>Due Date</h3>
                                    <p style={useStyle.pStyleTitle}>{dueDate}</p>
                                </div>
                                <div style={{borderBottom: '3px solid #e91e63'}}>
                                    <h3 style={useStyle.h3Style}>Attached Files</h3>
                                    <div style={{borderTop: '2px dashed #e91e63'}}>
                                        {allFiles}
                                    </div>
                                </div>
                                {this.state.uploading ? <Alert severity="success">Uploading...</Alert> : null}
                            </div>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={3} lg={4}></Grid>
                        <Grid item xs={3} lg={2}>
                            <Grid item container justify='center' alignItems='center'>
                                <Button variant='outlined' color='secondary' size='small' disabled={this.state.uploading} onClick={this.previous}>Go Back</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} lg={2}>
                            <Grid item container justify='center' alignItems='center'>
                                <Button color='primary' variant='contained' size='small' disabled={this.state.uploading} onClick={this.uploadTopic}>Confrim</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} lg={4}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
