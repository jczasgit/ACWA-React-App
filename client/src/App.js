import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home';
import AddTopic from './components/pages/AddTopic';
import theme from './components/myTheme';
import {ThemeProvider} from '@material-ui/core/styles';
import './css/App.css';
import Access from './components/pages/Access';
import FirstSetup from './components/pages/FirstSetup';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: '',
      userId: '',
    }
    this.confirmLoggin = this.confirmLoggin.bind(this);
    this.reLogin = this.reLogin.bind(this);
    this.passUserId = this.passUserId.bind(this);
  }

  componentDidMount() {
    this.confirmLoggin('confirm');
  }

  reLogin() {
    this.setState({isLogged: ''});
  }

  passUserId(userId) {
    this.setState({userId});
  }

  async confirmLoggin(status) {
    if(status === 'logged') {
      this.setState({isLogged: status});
      return;
    } else if(status === 'confirm'){
      const token = localStorage.getItem('token');
      if(token) {
        const response = await fetch('/api/validation', {method: 'POST', headers: {Authorization: `Bearer ${token}`}});
        const json = await response.json();
        if(json.msg === 'valid') {
          localStorage.setItem('userId', json.userId);
          this.setState({isLogged: 'token'});
        } else if(json.msg === 'forbidden') {
          this.setState({isLogged: ''});
        }
      }
    }
  }

  render() {
    const {isLogged} = this.state;
    return(
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
              <Route exact path='/' render={(routeProps) => (<Home {...routeProps} isLogged={isLogged} confirmLoggin={this.confirmLoggin} reLogin={this.reLogin}/>)}></Route>
              <Route path='/add-topic' render={(routeProps) => (<AddTopic {...routeProps} isLogged={isLogged}/>)}></Route>
              <Route path='/access' render={(routeProps) => (<Access {...routeProps} isLogged={isLogged} confirmLoggin={this.confirmLoggin} passUserId={this.passUserId}/>)}></Route>
              <Route path='/first-setup' render={(routeProps) => (<FirstSetup {...routeProps} isLogged={isLogged} confirmLoggin={this.confirmLoggin} userId={this.state.userId}/>)}></Route>
          </Switch>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;