import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default class TopicItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkB: false,
            selected: false,
        }
    }

    render() {
        return (
            <div className='topic-container'>
            <p className='pTopic'>{this.props.content}</p>
            <span>
            <Checkbox
                disabled={this.props.taken}
                checked={this.props.taken ? true : this.state.checkB}
                onChange={() => {
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
                }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                color='primary'
            />
            </span>
        </div>
        )
    }
}
