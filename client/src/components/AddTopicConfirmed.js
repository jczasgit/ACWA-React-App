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
            .then(json => console.log(json))
            .catch(err => console.error);
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
        this.uploadTopic();
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
                backgroundColor: '#F23557',
                margin: '2em auto',
                padding: '1em',
                borderRadius: '20px'
            },
            h3Style: {
                textAlign: 'center',
                color: '#FDF6F6'
            },
            pStyle: {
                color: '#FDF6F6',
                textAlign: 'left',
                fontSize: '0.7em',
                overflowWrap: 'break-word',
            },
            pStyleTopics: {
                color: '#FDF6F6',
                textAlign: 'center',
                fontSize: '0.7em',
                overflowWrap: 'break-word',
            },
            pStyleTitle: {
                color: '#FDF6F6',
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
                <div style={useStyle.divContainer}>
                    <div>
                        <h3 style={useStyle.h3Style}>Title</h3>
                        <p style={useStyle.pStyleTitle}>{title}</p>
                    </div>
                    <div>
                        <h3 style={useStyle.h3Style}>Description</h3>
                        <p style={useStyle.pStyle}>{description}</p>
                    </div>
                    <div>
                        <h3 style={useStyle.h3Style}>Topics</h3>
                        <div>
                            {allTopics}
                        </div>
                    </div>
                </div>
                <Grid container direction='row' justify='center' alignItems='center' space={8}>
                    <Grid item>
                        <Button variant='outlined' size='small' onClick={this.previous}>Go Back</Button>
                    </Grid>
                    <Grid item>
                        <Button color='primary' variant='contained' size='small' onClick={this.continue}>Confrim and Save</Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
