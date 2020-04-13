import React, { Component } from 'react';
import {Grid, Button, TextField} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Alert from '@material-ui/lab/Alert';

export default class Login extends Component {
    render() {
        return (
            <Grid container direction='column' spacing={2} justify='center' alignItems='center'>
                <Grid item>
                    <div>
                        {this.props.invalidMsg ? <Alert
                        className='alert'
                        severity='warning'><p>{this.props.invalidMsg}</p></Alert> : null}
                    </div>
                </Grid>
                <Grid item>
                    <h1>Log In</h1>
                </Grid>
                <Grid item>
                    <TextField
                    name='username'
                    label="Username"
                    type="text"
                    variant="outlined"
                    value={this.props.username}
                    onChange={this.props.handleChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                    label="Password"
                    name='password'
                    type="password"
                    variant="outlined"
                    value={this.props.password}
                    onChange={this.props.handleChange}
                    />
                </Grid>
                <Grid item container spacing={3}>
                    <Grid item><Button variant='contained' color='primary' onClick={this.props.onLogin}>Log In</Button></Grid>  
                    <Grid item><Button size='small' color='primary' disabled={false} onClick={this.props.onRegister}>Register<ArrowForwardIosIcon/></Button></Grid>
                </Grid>
            </Grid>
        )
    }
}
