import React, { Component } from 'react';
import Header from '../Header';
import TopicCell from '../TopicCell';
import Grid from '@material-ui/core/Grid';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
        }
        this.getAssignments = this.getAssignments.bind(this);
        this.refreshTopics = this.refreshTopics.bind(this);
    }

    componentDidMount() {
        this.getAssignments();
    }

    refreshTopics = dataArray => {
        this.setState({assignments: dataArray});
    }

    getAssignments() {
        fetch('/api/get/assignments/all')
            .then(response => response.json())
            .then(data => {
                //data.sort((a,b)=>b.timestamp-a.timestamp);
                this.setState({assignments: data});
            })
            .catch(err => {
                console.error(`Request failed. Message = ${err}`);
                return {error: {message: 'Request failed.'}};
            });
    }

    render() {
        return (
        <React.Fragment>
            <Grid container>
                <Grid item container>
                    <Header/>
                </Grid>
                <Grid item container justify='center' alignItems='center'>
                    <Grid item xs={0} lg={3}></Grid>
                    <Grid item xs={12} lg={6}>
                        <Grid item container justify='center' alignItems='center'>
                            <TopicCell assignments={this.state.assignments} refreshTopics={this.refreshTopics}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={0} lg={3}></Grid>
                </Grid>
            </Grid>
        </React.Fragment>
        );
    }
}

export default Home;