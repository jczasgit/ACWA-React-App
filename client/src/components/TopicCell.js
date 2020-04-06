import React, { Component } from 'react'
import '../css/topic-cell.css';

export default class TopicCell extends Component {
    render() {
        const {title, description, timestamp} = this.props.assignment;
        const date = new Date(timestamp).toLocaleString();
        return (
            <div className='divStyle'>
                <h2 className='h2Style'>{title}</h2>
                <div className='description-container'>
                    <p className='pStyle'>
                        {description}
                    </p>
                    <p> {date} </p>
                </div>
                <a href="/"className='aStyle'>Tap!</a>
            </div>
        )
    }
}
