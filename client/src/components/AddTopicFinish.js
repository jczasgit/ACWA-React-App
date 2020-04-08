import React, { Component } from 'react'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import IconButton from '@material-ui/core/IconButton';

export default class AddTopicFinish extends Component {

    render() {
        
        const {uploaded} = this.props;
        
        if(uploaded) {
            return (
                <div>
                    <h1>Yayyy! You finished!</h1>
                    <p>Your assignment has been added!</p>
                    <p>Redirecting... or clicked the exit button!</p>
                    <IconButton size='small' onClick={this.props.goBack}>
                        <ExitToAppRoundedIcon></ExitToAppRoundedIcon> 
                    </IconButton>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>Ooops...</h1>
                    <p>It something bad happened. Please try later or contact us.</p>
                    <p>Redirecting... or clicked the exit button!</p>
                    <IconButton size='small' onClick={this.props.goBack}>
                        <ExitToAppRoundedIcon></ExitToAppRoundedIcon> 
                    </IconButton>
                </div>
            )
        }
    }
}
