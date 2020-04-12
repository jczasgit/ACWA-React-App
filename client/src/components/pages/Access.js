import React, { Component } from 'react';
import '../../css/loginForm.css';
import Register from '../Register';  //temp
import Login from '../Login';
import {v4 as uuidv4} from 'uuid';

export default class Access extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            invalidMsg: '',
            stage: 1,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this.props.isLogged) this.props.history.push('/');
    }

    onRegister = e => {
        if(this.state.stage) {
            if(this._isMounted) this.setState({stage: 0, name: '',username: '',password: '', invalidMsg: ''});
            return;
        } else {
            const {username, password} = this.state;
            const data = {username, password, userId: uuidv4()};
            fetch('/api/usr/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
        }
    }

    onLogin = e => {
        e.preventDefault();
        const {username, password} = this.state;
        const data = {username, password};
        if(!username || !password) {
            if(this._isMounted) this.setState({invalidMsg: 'not blanks allowed'});           
        } else {
            if(this._isMounted) this.setState({invalidMsg: ''});
            fetch('/api/usr/login', {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)})
            .then(response => response.json())
            .then(data =>{
                if(data.firsttime) {
                    this.props.confirmLoggin('logged');
                    this.props.passUserId(data.userId);
                    this.props.history.push('/first-setup');
                }
                else if (data.invalidMsg) {
                    if(this._isMounted) this.setState({invalidMsg: data.invalidMsg});
                } 
                else {
                    localStorage.setItem('token', data.token);
                    this.props.confirmLoggin('logged');
                    this.props.history.push('/');
                }
            })
            .catch(err => console.error(err));
        }
    }

    handleChange = e => {
        if(this._isMounted) this.setState({[e.target.name]: e.target.value}); 
    }

    backToLogin = e => {
        if(!this.state.stage) {
           if(this._isMounted) this.setState({stage: 1, name: '',username: '',password: '', invalidMsg: ''});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="form-wrapper">
                  <div className='form-container'>
        {this.state.stage ? 
        <Login onLogin={this.onLogin} onRegister={this.onRegister} handleChange={this.handleChange} username={this.state.username} password={this.state.password} invalidMsg={this.state.invalidMsg} />
        :
        <Register onRegister={this.onRegister} handleChange={this.handleChange} username={this.state.username} password={this.state.password} backToLogin={this.backToLogin}/>
        }           
                </div>
            </div>
        )
    }
}
