import React, { Component } from 'react';
import Header from '../Header';
import TopicCell from '../TopicCell';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            isOverlay: false,
        }
        this.getAssignments = this.getAssignments.bind(this);
    }

    componentDidMount() {
        this.getAssignments();
    }

    getAssignments() {
        fetch('/api/get/assignments')
            .then(response => response.json())
            .then(data => {
                data.sort((a,b)=>b.timestamp-a.timestamp);
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
            <Header/>
            
            <TopicCell assignments={this.state.assignments}/>
        </React.Fragment>
        );
    }
}

export default Home;