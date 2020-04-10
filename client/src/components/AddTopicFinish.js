import React, { Component } from 'react'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import '../css/addTopicFinish.css';

export default class AddTopicFinish extends Component {
    componentDidMount() {
        setTimeout(() => {
            clearTimeout();
            this.props.goBack();
        }, 4000);
    }

    render() {
        
        const {uploaded} = this.props;
        
        if(uploaded) {
            return (
                <React.Fragment>
                    <Grid container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <div className='main-container'>
                                <div className='header-container'>
                                    <h3 className='h3'>Yayy!!!</h3><EmojiEmotionsIcon style={{fontSize: '1em'}}/>
                                </div>
                                <div className='title-container'>
                                    <p className='pTitle'>You know what?</p>
                                    <p className='pSub'>Your Assign is online now!</p>
                                </div>
                                <div className='redir-container'>
                                    <p className='p'>Redirecting to home...</p>
                                    <p className='p'>
                                        or click the exit icon.
                                        <IconButton onClick={this.props.goBack} className='exitBtn'>
                                            <ExitToAppRoundedIcon style={{fontSize: '0.5em',}}/>
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Grid container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <div className='main-container'>
                                <div className='header-container'>
                                    <h3 className='h3'>Oops...</h3><SmsFailedIcon style={{fontSize: '1em'}}/>
                                </div>
                                <div className='title-container'>
                                    <p className='pTitle'>Something bad happened!</p>
                                    <p className='pSub'>Your Assign is LOST!</p>
                                </div>
                                <div className='redir-container'>
                                    <p className='p'>Redirecting to home...</p>
                                    <p className='p'>
                                        or click the exit icon.
                                        <IconButton onClick={this.props.goBack} className='exitBtn'>
                                            <ExitToAppRoundedIcon style={{fontSize: '0.5em',}}/>
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </React.Fragment>
            )
        }
    }
}
