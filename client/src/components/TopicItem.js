import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

export default class TopicItem extends Component {
    _isMounted;
    constructor(props){
        super(props);
        this.state = {
            checkB: false,
            selected: false,
            holderId: this.props.holderId,
        }

        this.isMultiChoice = this.isMultiChoice.bind(this);
        this.isSingleChoice = this.isSingleChoice.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount()  {
        this._isMounted = false;
    }

    isSingleChoice() {
        const {selectedTopicId, topicId} = this.props;
        const {checkB, selected} = this.state;
        if(checkB && selected && selectedTopicId === this.props.topicId) {
            //uncheck
            this.setState({checkB:!checkB, selected:!selected});
            this.props.toggleSelection('');
        } else if(checkB && selected && selectedTopicId !== this.props.topicId) {
            return;
        } else if(!checkB && !selected && selectedTopicId === '') {
            //check
            this.setState({checkB:!checkB, selected:!selected});
            this.props.toggleSelection(topicId);
        }
    }

    isMultiChoice() {
        console.log('multi');
    }

    handleCheckBoxChange = e => {
        if(this.props.selectable) {
            const {multiChoice} = this.props; 
            if(multiChoice) {
                this.isMultiChoice();
            } else {
                this.isSingleChoice();
            }
        } else {
            return;
        }
    }
    cancelTopicSelection = async (holderId, topicId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/topicremove/${holderId}/${topicId}`, {method: 'POST', headers: {Authorization: `Bearer ${token}`}, body: JSON.stringify({client: 'removetopic'})});
        const json = await response.json();
        if(json.validMsg === 'successful') {
            if(this._isMounted) {
                this.setState({checkB: false, selected: false});
                this.props.resetStateForRemoval();
            }
        }
    }

    render() { 
        const userId = localStorage.getItem('userId');
        return (
            <div className='topic-container'>
            <p className='pTopic'>{this.props.content}</p>
            <p className='pHolder'>Taken by: <br/> <span className='holder'>{this.props.holder}</span></p>
            <span>
            {!this.props.selectable && this.props.holderId === userId ?
                <IconButton onClick={ () => this.cancelTopicSelection(this.props.holderId, this.props.topicId)}><CancelIcon color='primary'/></IconButton>
            :
                <Checkbox
                className='checkbox'
                disabled={this.props.taken}
                checked={this.props.taken ? true : this.state.checkB}
                onChange={this.handleCheckBoxChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                color='primary'
                />
            }
            </span>
        </div>
        )
    }
}
