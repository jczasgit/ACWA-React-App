import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default class TopicItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkB: false,
            selected: false,
        }

        this.isMultiChoice = this.isMultiChoice.bind(this);
        this.isSingleChoice = this.isSingleChoice.bind(this);
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
        const {multiChoice} = this.props; 
        if(multiChoice) {
            this.isMultiChoice();
        } else {
            this.isSingleChoice();
        }
    }

    render() {

        return (
            <div className='topic-container'>
            <p className='pTopic'>{this.props.content}</p>
            <p className='pHolder'>Taken by: <span className='holder'>{this.props.holder}</span></p>
            <span>
            <Checkbox
                className='checkbox'
                disabled={this.props.taken}
                checked={this.props.taken ? true : this.state.checkB}
                onChange={this.handleCheckBoxChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                color='primary'
            />
            </span>
        </div>
        )
    }
}
