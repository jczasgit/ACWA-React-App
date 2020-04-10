import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home';
import AddTopic from './components/pages/AddTopic';
import theme from './components/myTheme';
import {ThemeProvider} from '@material-ui/core/styles';
import './css/App.css';

export class App extends Component {
  render() {
    return(
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
              <Route exact path='/' component={Home}></Route>
              <Route path='/add-topic' component={AddTopic}></Route>
          </Switch>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;