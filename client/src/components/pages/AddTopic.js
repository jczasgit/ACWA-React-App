import React, { Component } from 'react'
import Header from '../Header';
import {v4 as uuidv4} from 'uuid';
import FormTitle from '../FormTitle';
import FormDescription from '../FormDescription';
import FormAddTopics from '../FormAddTopics';
import AddTopicConfirmed from '../AddTopicConfirmed';
import AddTopicFinish from '../AddTopicFinish';

export default class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            title: '',
            description: '',
            step: 1,
            topics: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.addTopicField = this.addTopicField.bind(this);
        this.delTopicField = this.delTopicField.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    nextStep = () => {
        const {step} = this.state;
        this.setState({step: step+1});
    }

    prevStep = () => {
        const {step} = this.state;
        this.setState({step: step-1});
    }

    handleChange = input => e => {
        this.setState({[input]: e.target.value}); //change value according to the input tag.
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

    addTopicField(content) {
        if(content.length === 0) {
            return;
        }
        const newTopic = {id: uuidv4(), content:content};
        this.setState({topics: [...this.state.topics, newTopic]});
    }

    delTopicField = (id) => {
        const newTopics = [...this.state.topics.filter(topic => topic.id !== id)];
        this.setState({ topics: newTopics });
    }

    goBack = e => {
        this.props.history.push('/');
    }

    render() {
        const {step} = this.state;
        const {id, title, description, topics} = this.state;
        const values = {id, title, description, topics};

        switch(step) {
            case 1:
                return (
                    <React.Fragment>
                        <Header/>
                        <FormTitle nextStep={this.nextStep} handleChange={this.handleChange} values={values}/>
                    </React.Fragment>
                )
            case 2:
                return (
                    <React.Fragment>
                        <Header />
                        <FormDescription nextStep={this.nextStep} prevStep={this.prevStep} handleChange={this.handleChange} values={values}/>
                    </React.Fragment>
                )
            case 3:
                return (
                    <React.Fragment>
                        <Header />
                        <FormAddTopics addTopicField={this.addTopicField} nextStep={this.nextStep} prevStep={this.prevStep} topics={topics} delTopicField={this.delTopicField}/>
                    </React.Fragment>
                )
            case 4:
                return (
                    <React.Fragment>
                        <Header />
                        <AddTopicConfirmed values={values} nextStep={this.nextStep} prevStep={this.prevStep}/>
                    </React.Fragment>
                )
            case 5:
                return (
                    <React.Fragment>
                        <Header />
                        <AddTopicFinish goBack={this.goBack}/>
                    </React.Fragment>
                )
            default:
                return <h1>Something went wrong! Contact Administrator Please.</h1>
        }
    }
}
