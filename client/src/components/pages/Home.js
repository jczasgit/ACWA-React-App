import React, { Component } from 'react';
import Header from '../Header';
import TopicCell from '../TopicCell';
import Grid from '@material-ui/core/Grid';
import SocketIOClient from 'socket.io-client';

class Home extends Component {
    //autoRefresh;
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            endpoint: 'http://localhost:3001/' // change endpoint based on your need.
        }
        this.getAssignments = this.getAssignments.bind(this);
        this.refreshTopics = this.refreshTopics.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const {endpoint} = this.state;
        if(!this.props.isLogged) this.props.history.push('/access');
        else this.getAssignments();
        const socket = SocketIOClient(endpoint);
        socket.on('newData', (data) => {
            this.refreshTopics(data);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearTimeout(this.autoRefresh);
    }

    refreshTopics = dataArray => {
        if(this._isMounted) {
        this.setState({assignments: dataArray});
        }
    }

    getAssignments() {
        const token = localStorage.getItem('token');
        const options = {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        }
        fetch('/api/get/assignments/all', options)
            .then(response => response.json())
            .then(data => {
                    if(data.msg) {
                        if(this._isMounted) {
                            this.props.reLogin();
                            this.props.history.push('/access');
                        }
                    }
                    else {
                        if(this._isMounted){ 
                            this.setState({assignments: data});
                        }
                    }
                })
            .catch(err => {
                console.log(err);
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
                    <Grid item xs={"auto"} lg={3}></Grid>
                    <Grid item xs={12} lg={6}>
                        <Grid item container justify='center' alignItems='center'>
                            <TopicCell assignments={this.state.assignments} refreshTopics={this.refreshTopics}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={"auto"} lg={3}></Grid>
                </Grid>
            </Grid>
        </React.Fragment>
        );
    }
}

export default Home;