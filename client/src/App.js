import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home';
import AddTopic from './components/pages/AddTopic';
import './css/App.css';

export class App extends Component {
  render() {
    return(
      <Router>
        <div className='cell-container'>
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route path='/add-topic' component={AddTopic}></Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;