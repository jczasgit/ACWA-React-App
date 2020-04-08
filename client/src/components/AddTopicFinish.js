import React, { Component } from 'react'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import IconButton from '@material-ui/core/IconButton';

export default class AddTopicFinish extends Component {

    render() {
        

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
    }
}
