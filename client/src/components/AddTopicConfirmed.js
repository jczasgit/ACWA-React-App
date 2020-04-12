import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useStyle from './useStyles';

export default class AddTopicConfirmed extends Component {
    constructor(props) {
        super(props);
        this.uploadTopic = this.uploadTopic.bind(this);
    }

    // submitting new assignment!
    uploadTopic() {
        const {values: { title, description, topics, id}} = this.props;
        const data = {title, description, topics, id}
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
        fetch('/api/add', options)
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                if(json.msg === 'forbidden') this.props.uploadCheck(false);
                else this.props.uploadCheck(true);
            })
            .catch(err => {
                //console.error(err);
                this.props.uploadCheck(false);
            });
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
        

        const {values: { title, description, topics}} = this.props;
        const allTopics = topics.map(topic => {
            const {content, id} = topic;
            return (
            <p key={id} style={useStyle.pStyleTopics}>{content}</p>
            );
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
                            </div>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={3} lg={4}></Grid>
                        <Grid item xs={3} lg={2}>
                            <Grid item container justify='center' alignItems='center'>
                                <Button variant='outlined' color='secondary' size='small' onClick={this.previous}>Go Back</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} lg={2}>
                            <Grid item container justify='center' alignItems='center'>
                                <Button color='primary' variant='contained' size='small' onClick={this.continue}>Confrim</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} lg={4}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
