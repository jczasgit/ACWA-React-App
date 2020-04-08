import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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

    onEnterAdd = e => {
        if (e.key === 'Enter') {
            this.props.addTopicField(this.state.content);
            this.setState({content: ''});
        }
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
                <Grid container spacing={2}>
                    <Grid item container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <TextField placeholder="Enter Topic" label='Topic' onChange={this.handleChange} value={this.state.content} style={{width: '216px'}} onKeyDown={this.onEnterAdd}></TextField>
                            <IconButton size='small' color='inherit' onClick={this.onAdd} style={{padding: '24px 0 0 0'}}>
                                <AddIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <TopicList topics={this.props.topics} delTopicField={this.props.delTopicField}/>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3}>
                            <Button variant='outlined' color='secondary' size='small' onClick={this.previous}>Go Back</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button color='primary' variant='contained' size='small' onClick={this.continue}>Continue</Button>
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
