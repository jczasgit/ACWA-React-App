import React, { Component } from 'react';
import {Grid, Button} from '@material-ui/core';
import '../css/formTitle.css';

// colors: pink-main = #e91e63, pink-light = #f8bbd0, pink-dark = #c2185b, contrast = #fff;

export default class FormTitle extends Component {

    continue = e => {
        const {values} = this.props;
        e.preventDefault();
        if(values.title.length === 0) {
            alert('Please fill all the blanks.');
            return;
        } else {
            this.props.nextStep();
        }
    }

    onEnterContinue = e => {
        if (e.key === 'Enter') {
            const {values} = this.props;
            if(values.title.length === 0) {
                alert('Please fill all the blanks.');
                return;
            } else {
                this.props.nextStep();
            }
        }
        
    }

    render() {
        const {values, handleChange} = this.props;
        return (
            <React.Fragment>
                <Grid container className='gridContainer' spacing={2}>
                    <Grid item container>
                        <Grid item xs={2} lg={4}></Grid>
                        <Grid item xs={8} lg={4}>
                            <div className='form'>
                                <input 
                                type="text" 
                                name="title" 
                                onChange={handleChange('title')}
                                onKeyDown={this.onEnterContinue} 
                                value={values.title} 
                                autoComplete="off"
                                maxLength='70'
                                required/>
                                <label htmlFor='title' className='labelTitle'>
                                    <span className='contentTitle'>Title</span>
                                </label>
                            </div>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2} lg={4}></Grid>
                        <Grid item xs={8} lg={4}>
                            <Button 
                            color="primary" 
                            variant="outlined" 
                            onClick={this.continue} 
                            fullWidth={true}>Continue</Button>
                        </Grid>
                        <Grid item xs={2} lg={4}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}