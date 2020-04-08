import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';
import TopicList from './TopicList';
import Button from '@material-ui/core/Button';

export default class FormAddTopics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    handleChange = e => {
        this.setState({content: e.target.value})
    }

    onAdd = e => {
        e.preventDefault();
        this.props.addTopicField(this.state.content);
        this.setState({content: ''});
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    previous = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        return (
            <React.Fragment>
                <Grid container direction='row' justify='center' alignItems='center' space={10}>
                    <Grid item>
                        <TextField placeholder="Enter Topic" label='Topic' onChange={this.handleChange} value={this.state.content}></TextField>
                    </Grid>
                    <Grid item>
                        <Fab size='small' color='primary' aria-label="add" onClick={this.onAdd}>
                            <AddIcon/>
                        </Fab>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center'>
                    <TopicList topics={this.props.topics} delTopicField={this.props.delTopicField}/>
                </Grid>
                <Grid container direction='row' justify='center' alignItems='center' space={8}>
                        <Grid item>
                            <Button variant='outlined' size='small' onClick={this.previous}>Go Back</Button>
                        </Grid>
                        <Grid item>
                            <Button color='primary' variant='contained' size='small' onClick={this.continue}>Continue</Button>
                        </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
