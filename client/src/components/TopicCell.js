import React, { Component } from 'react'
import '../css/topic-cell.css';

export default class TopicCell extends Component {
    render() {
        const allStoredAssignments = this.props.assignments.map(assignment => {
            const {id, title, description, timestamp} = assignment;
            const date = new Date(timestamp).toDateString();
            return (
                <div className="divStyle" key={id}>
                    <h2 className="h2Style">{title}</h2>
                    <div className="description-container">
                        <p className="pStyle">{description}</p>
                        <p className='dateStyle'>{date}</p>
                    </div>
                    <a href="/" className='aStyle'>Tap!</a>
                </div>
            );
        });

        return (
            <React.Fragment>
                {allStoredAssignments}
            </React.Fragment>
        );
    }
}