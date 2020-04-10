import React, { Component } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import TopicItem from './TopicItem';
import {Grid ,Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default class TopicItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkC: false,
            checkS: false,         
            isMounted: false,
            selectedTopicId: '',
            submitted: false,
        }

        this.toggleSelection = this.toggleSelection.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    toggleSelection = selectedTopicId => {
        // toggle the value ("topicId" or <empty string>)
        this.setState({selectedTopicId});
    }

    onSubmit = e => {
        e.preventDefault();
        const {selectedTopicId} = this.state;
        const {cellId} = this.props;
        if(selectedTopicId === '') {
            return;
        } else {
            fetch(`/api/topicselect/:${cellId}/:${selectedTopicId}`)
                .then(response => response.json())
                .then(data => {
                    this.props.refreshTopics(data);
                    this.setState({submitted: true});
                })
                .catch(err => console.error);
        }
    }

    render() {
        const {id, title, description, timestamp, topics} = this.props.assignment;
        const date = new Date(timestamp).toDateString();
        return (
            <div className='divStyle'>
                <h2 className="h2Style">{title}</h2>
                    <div className="description-container">
                        <div className="pStyle description">{description}</div>
                    </div>
                    <div style={{display: 'flex' ,width: '80%', justifyContent: 'space-around', borderTop: '1px dashed #e91e63', marginTop: '10px', paddingTop: '10px'}}>
                        <p className='dateStyle'>{date}</p>
                        <p className='aStyle'>
                        <Switch
                            checked={this.state.checkS}
                            onChange={() => {
                                const {isOpen, openedId} = this.props;
                                if(isOpen && openedId === id) {
                                    const {checkC, checkS} = this.state;
                                    this.setState({checkC: !checkC, checkS: !checkS});
                                    this.props.opened({value: !isOpen, id: ''});
                                } else if(isOpen && openedId !== id) {
                                    return;
                                } else if (!isOpen) {
                                    const {checkC, checkS} = this.state;
                                    this.setState({checkC: !checkC, checkS: !checkS});
                                    this.props.opened({value: !isOpen, id: id});
                                }
                            }}
                            name="checkedS"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='primary'
                        />
                        </p>
                    </div>
                <Collapse in={this.state.checkC} style={{width: '100%'}}>
                    <div>
                        {this.state.submitted ? <Alert severity="success" style={{width: '90%', margin: 'auto', textTransform: 'uppercase', fontSize:'0.7em'}}>Alright! your choice has been submited!</Alert> : null}
                    </div>
                    <div className='topics-container'>
                        {topics.map(topic => {
                            const {content, id, taken} = topic;
                            return(
                                <TopicItem 
                                key={id}  
                                content={content} 
                                topicId={id}
                                taken={taken}  
                                selectedTopicId={this.state.selectedTopicId}
                                toggleSelection={this.toggleSelection}/>
                            );
                        })}
                    </div>
                    <Grid container style={{marginTop: '1em'}}>
                        <Grid item xs={5}></Grid>
                        <Grid item xs={2}>
                        <Button 
                            color="primary" 
                            variant="contained" 
                            onClick={this.onSubmit} 
                            fullWidth={true}>Submit</Button>
                        </Grid>
                        <Grid item xs={5}></Grid>
                    </Grid>
                </Collapse>
            </div>
        )
    }
}
