import React, { Component } from 'react';
import TopicCell from './TopicCell';

export default class Cell extends Component {
    render() {
        return this.props.assignments.map((assignment) => (
            <TopicCell key={assignment.id} assignment={assignment}/>
        ));
    }
}