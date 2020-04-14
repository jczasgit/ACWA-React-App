import React, { Component } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import TopicItem from './TopicItem';
import {Grid ,Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AttachedFiles from './AttachedFiles';

export default class TopicItems extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            checkC: false,
            checkS: false,         
            isMounted: false,
            selectedTopicId: '',
            submitted: false,
            multiChoice: false,
            controlledSwitch: false,
            selectable: true,
        }

        this.toggleSelection = this.toggleSelection.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.controlled = this.controlled.bind(this);
        this.uncontrolled = this.uncontrolled.bind(this);
        this.checkForTakenTopicByUser = this.checkForTakenTopicByUser.bind(this);
        this.resetStateForRemoval = this.resetStateForRemoval.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({isMounted: true});
        const token = localStorage.getItem('token');
        this.checkForTakenTopicByUser(token);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    resetStateForRemoval() {
        if(this._isMounted) {
            this.setState({selectable: true,selectedTopicId: ''});
        }
    }

    async checkForTakenTopicByUser(token) {
        if(token) {
            const response = await fetch('/api/get/userdetails/assignments', {headers: {Authorization: `Bearer ${token}`}});
            const {assignmentTaken} = await response.json();
            const currentAssignmentId = this.props.assignment.id;
            if(assignmentTaken !== 'undefined') {
                assignmentTaken.forEach(assignmentData => {
                    const {assignmentId} = assignmentData;
                    if(assignmentId === currentAssignmentId) {
                        this.setState({selectable: false})
                    }
               });
            }
        }
    }

    toggleCheckBox(string) {
        const {checkB, selected} = this.state;
        if(string === 'equal') {
            this.setState({checkB:!checkB, selected:!selected});
        } else if(string === 'unselected') {
            this.setState({checkB:!checkB, selected:!selected});
        }
    }

    toggleSelection = selectedTopicId => {
        // toggle the value ("topicId" or <empty string>)
        if(this._isMounted) this.setState({selectedTopicId});
    }
    
    // submitting topic selection
    onSubmit = e => {
        e.preventDefault();
        const {selectedTopicId} = this.state;
        const {cellId} = this.props;
        if(selectedTopicId === '') {
            return;
        } else {
            const token = localStorage.getItem('token');
            fetch(`/api/topicselect/${cellId}/${selectedTopicId}`, {method: 'POST', headers: {Authorization: `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => {
                    if(data.msg === 'taken') {
                        this.resetStateForRemoval();
                        this.checkForTakenTopicByUser(token);
                    }else if(data.msg === 'success') {
                        //this.props.refreshTopics(data.array);
                        this.setState({submitted: true});
                        this.checkForTakenTopicByUser(token);
                    }
                })
                .catch(err => console.error);
        }
        setTimeout(()=> {
            if(this._isMounted) this.setState({submitted: false});
            clearTimeout();
        }, 10000);
    }

    controlled() {
        const {id} = this.props.assignment;
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
    }

    uncontrolled() {
        const {checkS, checkC} = this.state;
        if(this._isMounted) {
            this.setState({checkS: !checkS, checkC: !checkC});
        }
    }

    handleSwitchController = e => {
        const {controlledSwitch} = this.state;
        if(controlledSwitch) {
            this.controlled();
        } else {
            this.uncontrolled();
        }
    }

    render() {
        const {title, description, timestamp, topics, dueDate} = this.props.assignment;
        const date = new Date(timestamp).toDateString();
        return (
            <div className='divStyle'>
                <h2 className="h2Style">{title}</h2>
                    <div className="description-container">
                        <div className="pStyle description">{description}</div>
                    </div>
                    <div style={{display: 'flex' ,width: '80%', justifyContent: 'space-around', borderTop: '1px dashed #e91e63', marginTop: '10px', paddingTop: '10px'}}>
                        <p className='dateStyle'><span>Published on:</span> {date} <br/> <span>Due Date:</span> {dueDate}</p>
                        <p className='aStyle'>
                        <Switch
                            checked={this.state.checkS}
                            onClick={this.handleSwitchController}
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
                            const {content, id, taken, holder, limit} = topic;
                            return(
                                <TopicItem
                                resetStateForRemoval={this.resetStateForRemoval}
                                multiChoice={this.state.multiChoice}
                                key={id}  
                                content={content} 
                                topicId={id}
                                taken={taken}
                                selectable={this.state.selectable}
                                limit={limit}
                                holder={holder}  
                                holderId={topic.holderId}
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
                    <Grid container style={{marginTop: '1em'}}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                        <AttachedFiles attachedFilePaths={this.props.assignment.attachedFilePaths}/>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Collapse>
            </div>
        )
    }
}
