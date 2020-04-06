import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header';
import Cell from './components/Cell';
import AddTopic from './components/AddTopic';
import './css/App.css';

export class App extends Component {
  state = {
    assignments: []
  }

  componentDidMount() {
    fetch('/api/get-post').then(res => res.json()).then(json => {
      json.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({assignments: json});
    }).catch(err => console.log(err));
    
  }

  render() {
    return(
      <Router>
        <div className='cell-container'>
          <Route exact path='/' render={props => 
          (
            <React.Fragment>
                <Header/>
                <Cell assignments={this.state.assignments}/>
            </React.Fragment>
          )}> 
          </Route>
          <Route path='/add-topic' component={AddTopic}></Route>
        </div>
      </Router>
    );
  }
}

export default App;