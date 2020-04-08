import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styles from './gridStyle';

export default class FormDescription extends Component {

    continue = e => {
        const {values} = this.props;
        e.preventDefault();
        if(values.description.length === 0) {
            alert('Please fill all the blanks.');
            return;
        } else {
            this.props.nextStep();
        }
    }

    previous = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const {values, handleChange} = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={2} style={styles.gridContainer}>
                    <Grid item container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <TextField 
                                multiline={true} 
                                label='Description' 
                                placeholder='Enter Description' 
                                onChange={handleChange('description')}
                                defaultValue={values.description}
                                style={{width:'100%'}}
                            ></TextField>
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
