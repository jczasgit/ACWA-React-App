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
                        <div className="pStyle description">{description}</div>
                    </div>
                    <div style={{display: 'flex' ,width: '80%', justifyContent: 'space-around', borderTop: '1px dashed #e91e63', marginTop: '10px', paddingTop: '10px'}}>
                        <p className='dateStyle'>{date}</p>
                        <a href="/" className='aStyle'>Tap!</a>
                    </div>
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