import React, { Component } from 'react'
import Header from '../Header';
import {v4 as uuidv4} from 'uuid';
import FormTitle from '../FormTitle';
import FormDescription from '../FormDescription';
import FormAddTopics from '../FormAddTopics';
import AddTopicConfirmed from '../AddTopicConfirmed';
import AddTopicFinish from '../AddTopicFinish';
import FormDetails from '../FormDetails';

export default class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: uuidv4(),
            title: '',
            description: '',
            dueDate: '2020-04-01',
            step: 1,
            topics: [],
            attachedFiles: [],
            uploaded: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.addTopicField = this.addTopicField.bind(this);
        this.delTopicField = this.delTopicField.bind(this);
        this.goBack = this.goBack.bind(this);
        this.uploadCheck = this.uploadCheck.bind(this);
    }

    nextStep = () => {
        const {step} = this.state;
        this.setState({step: step+1});
    }

    prevStep = () => {
        const {step} = this.state;
        this.setState({step: step-1});
    }

    handleDateChange = e => {
        this.setState({dueDate: e.target.value}); // change date value
    }

    handleChange = input => e => {
        this.setState({[input]: e.target.value}); //change value according to the input tag.
    }

    addTopicField(content) {
        if(content.length === 0) {
            return;
        }
        const newTopic = {id: uuidv4(), content:content, taken: false, holders: [], holder: 'Not taken, yet.', limit: false};
        this.setState({topics: [...this.state.topics, newTopic]});
    }

    delTopicField = (id) => {
        const newTopics = [...this.state.topics.filter(topic => topic.id !== id)];
        this.setState({ topics: newTopics });
    }

    delAttachedFile = (name) => {
        const newFiles = [...this.state.attachedFiles.filter(file => file.name !== name)];
        this.setState({attachedFiles: newFiles});
    }

    goBack = e => {
        this.setState({uploaded: false});
        this.props.history.push('/');
    }

    uploadCheck = bool => {
        if(bool) {
            this.setState({uploaded: true})
        } else {
            this.setState({uploaded: false});
        }
    }

    handleFiles = e => {
        const selectedFiles = []
        for(let i=0;i<e.target.files.length;i++) {
            selectedFiles.push(e.target.files[i])
        }
        this.setState({attachedFiles: selectedFiles});
    }

    render() {
        const {step} = this.state;
        const {id, title, description, topics, dueDate, attachedFiles} = this.state;
        const values = {id, title, description, topics, dueDate, attachedFiles};

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
                    return(
                        <React.Fragment>
                            <Header/>
                            <FormDetails delAttachedFile={this.delAttachedFile} handleFiles={this.handleFiles} nextStep={this.nextStep} prevStep={this.prevStep} values={values} handleDateChange={this.handleDateChange} attachedFiles={this.state.attachedFiles}/>
                        </React.Fragment>
                    )
            case 5:
                return (
                    <React.Fragment>
                        <Header />
                        <AddTopicConfirmed values={values} nextStep={this.nextStep} prevStep={this.prevStep} uploadCheck={this.uploadCheck}/>
                    </React.Fragment>
                )
            case 6:
                return (
                    <React.Fragment>
                        <Header />
                        <AddTopicFinish goBack={this.goBack} uploaded={this.state.uploaded}/>
                    </React.Fragment>
                )
            default:
                return <h1>Something went wrong! Contact Administrator Please.</h1>
        }
    }
}
