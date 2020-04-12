import React, { Component } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {Grid, Button, TextField} from '@material-ui/core';

export default class Register extends Component {
    render() {
        return (
            <Grid container direction='column' spacing={2} justify='center' alignItems='center'>
                <Grid item>
                    <h1>Register</h1>
                </Grid>
                <Grid item>
                    <TextField
                    name='name'
                    label="Name"
                    type="text"
                    variant="outlined"
                    value={this.props.name}
                    onChange={this.props.handleChange}
                    />
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
                    <Grid item><Button size='small' color='primary' onClick={this.props.backToLogin}><ArrowBackIosIcon/>Login</Button></Grid>  
                    <Grid item><Button variant='outlined' color='primary' onClick={this.props.onRegister}>Register</Button></Grid>
                </Grid>
            </Grid>
        )
    }
}
