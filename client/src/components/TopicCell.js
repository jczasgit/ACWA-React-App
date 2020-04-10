import React, { Component } from 'react';
import TopicItems from './TopicItems';
import '../css/topic-cell.css';

export default class TopicCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            openedId: '',
        }
        this.opened = this.opened.bind(this);
    }

    opened = values => {
        const {value, id} = values;
        this.setState({isOpen: value, openedId: id});
    }

    render() {

        const allStoredAssignments = this.props.assignments.map(assignment => {
            const {id} = assignment;
            return (
                <TopicItems
                assignment={assignment}
                key={id}
                cellId={id}
                isOpen={this.state.isOpen}
                openedId={this.state.openedId} 
                opened={this.opened}
                refreshTopics={this.props.refreshTopics}/>
            );
        });

        return (
            <React.Fragment>
                {allStoredAssignments}
            </React.Fragment>
        );
    }
}