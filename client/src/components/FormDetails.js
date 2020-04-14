import React, { Component } from 'react';
import {Grid, Button, TextField} from '@material-ui/core';
import AttachedFilesList from './AttachedFilesList';
import '../css/files.css';

export default class FormDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileInput: null
        }
    }

    componentDidMount() {
        const fileInput = document.getElementById('file-input');
        this.setState({fileInput});
    }

    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    previous = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    chooseFile = e => {
        const {fileInput} = this.state;
        fileInput.click();
    }

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item container>
                        <Grid item xs={2} lg={4}></Grid>
                        <Grid item xs={8} lg={4}>
                            <Grid item container direction='column' justify='center' alignItems='center'> 
                                <h2>Due Date</h2>
                                <TextField 
                                    type='date'
                                    label='Due Date' 
                                    onChange={this.props.handleDateChange} 
                                    defaultValue={this.props.values.dueDate}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                    <Grid item container spacing={2}>
                        <Grid item xs={2} lg={4}></Grid>
                        <Grid item xs={8} lg={4}>
                            <Grid item container direction='column' justify='center' alignItems='center'>
                                <h2>Attach Files</h2>
                                <p style={{opacity: '0.6', fontSize:'0.8em'}}>optional</p>
                                <div>
                                    <input id='file-input' className='file-input' type="file" multiple onChange={this.props.handleFiles}/>
                                    <Button color='secondary' disabled={false} variant='contained' size='small' onClick={this.chooseFile}>Choose File/s</Button>
                                </div>
                                <AttachedFilesList attachedFiles={this.props.attachedFiles} delAttachedFile={this.props.delAttachedFile}/>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                    <Grid item container>
                    <Grid item xs={3} lg={4}></Grid>
                        <Grid item xs={3} lg={2}>
                            <Grid item container justify='center' alignItems='center'>
                                <Button variant='outlined' color='secondary' size='small' onClick={this.previous}>Go Back</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3} lg={2}>
                        <Grid item container justify='center' alignItems='center'>
                            <Button color='primary' variant='contained' size='small' onClick={this.continue}>Continue</Button>
                        </Grid>
                        </Grid>
                        <Grid item xs={3} lg={4}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
