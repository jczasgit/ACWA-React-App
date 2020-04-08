import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default class AddTopicConfirmed extends Component {
    constructor(props) {
        super(props);
        this.uploadTopic = this.uploadTopic.bind(this);
    }

    uploadTopic() {
        const {values: { title, description, topics, id}} = this.props;
        const data = {title, description, topics, id}
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
        fetch('/api/add', options)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                this.props.uploadCheck(true);
            })
            .catch(err => {
                console.log(err);
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
        const useStyle = {
            divContainer: {
                display: 'grid',
                gridTemplateColumns: '1fr',
                maxWidth: '90%',
                minWidth: '170px',
                margin: '1.5em auto',
                padding: '0.5em',
                borderRadius: '10px'
            },
            h3Style: {
                textAlign: 'center',
                color: '#212121'
            },
            pStyle: {
                color: '#212121',
                textAlign: 'left',
                fontSize: '0.7em',
                overflowWrap: 'break-word',
            },
            pStyleTopics: {
                color: '#212121',
                textAlign: 'center',
                fontSize: '0.7em',
                overflowWrap: 'break-word',
            },
            pStyleTitle: {
                color: '#212121',
                textAlign: 'center',
                fontWeigh: '500',
                fontSize: '1em',
                overflowWrap: 'break-word',
            },
        }

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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
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
                        <Grid item xs={2}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3}>
                            <Button variant='outlined' color='secondary' size='small' onClick={this.previous}>Go Back</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button color='primary' variant='contained' size='small' onClick={this.continue}>Confrim</Button>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
