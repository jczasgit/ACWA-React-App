import React, { Component } from 'react'
import Header from './Header';
import {v4 as uuidv4} from 'uuid';

export default class AddTopic extends Component {
    state = {
        id: uuidv4(),
        title: '',
        description: '',
    }

    handleChange = input => e => {
        this.setState({[input]: e.target.value});
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({id: uuidv4()});
        const data = this.state;
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        fetch('/api/add', options)
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <React.Fragment>
                <Header />
                <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleChange('title')}/>
                <textarea onChange={this.handleChange('description')}></textarea>
                <input type="submit" value="Submit"/>
                </form>
            </React.Fragment>
        )
    }
}
