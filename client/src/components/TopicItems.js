import React, { Component } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import TopicItem from './TopicItem';
import {Grid ,Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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
        }

        this.toggleSelection = this.toggleSelection.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.controlled = this.controlled.bind(this);
        this.uncontrolled = this.uncontrolled.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({isMounted: true});
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    toggleSelection = selectedTopicId => {
        // toggle the value ("topicId" or <empty string>)
        this.setState({selectedTopicId});
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
                    this.props.refreshTopics(data);
                    this.setState({submitted: true});
                })
                .catch(err => console.error);
        }
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
        const {title, description, timestamp, topics} = this.props.assignment;
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
                            const {content, id, taken, holder} = topic;
                            return(
                                <TopicItem
                                multiChoice={this.state.multiChoice} 
                                key={id}  
                                content={content} 
                                topicId={id}
                                taken={taken}
                                holder={holder}  
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
