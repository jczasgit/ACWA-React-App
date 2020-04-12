import React, { Component } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default class FirstSetup extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            invalidMsg: '',
            validMsg: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange(e) {
        if(this._isMounted) {
            this.setState({[e.target.name] : e.target.value})
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const {username, password} = this.state;
        if(username.length < 6 || password.length < 6) {
            alert('Username or Password must be longer than 6 characters!');
            return;
        } else {
            const {username, password} = this.state;
            const data = {username, password, userId: this.props.userId}
            const options = {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(data),
            }
            fetch('/api/usr/firstsetup', options)
                .then(response => response.json())
                .then(data => {
                    if(data.invalidMsg) {
                        if(this._isMounted) this.setState({invalidMsg: data.invalidMsg})
                    } else if (data.validMsg) {
                        if(this._isMounted) this.setState({validMsg: data.validMsg});
                        setTimeout(()=> {
                            clearTimeout();
                            this.props.history.push('/access');
                        }, 3000)
                    }
                })
        }
    }

    render() {
        return (
                <Grid container direction='column' spacing={2} justify='center' alignItems='center'>
                    <Grid item>
                        {this.state.invalidMsg?
                        <Alert severity='warning'>{this.state.invalidMsg}</Alert>
                        :
                        null
                        }
                        {this.state.validMsg?<Alert severity='success'>Ok, you are all set. Redirecting...</Alert>
                        :
                        null
                        }
                    </Grid>
                    <Grid item>
                        <h1>First Time Setup</h1>
                        <h3>{"Reset Username & Password"}</h3>
                    </Grid>
                    <Grid item>
                        <TextField
                        name='username'
                        label="Username"
                        type="text"
                        variant="outlined"
                        value={this.state.username}
                        onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        label="Password"
                        name='password'
                        type="password"
                        variant="outlined"
                        value={this.state.password}
                        onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item container spacing={3} justify='center' alignItems='center'>
                        <Grid item>
                            <Button variant='contained' color='primary' onClick={this.onSubmit}>Confirm</Button>
                        </Grid> 
                    </Grid>
                </Grid>
        )
    }
}
