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
                <Grid container justify='center' alignItems='center' space={8} style={styles.gridContainer}>
                    <Grid item container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={10}>
                            <TextField 
                                multiline={true} 
                                label='Description' 
                                placeholder='Enter Description' 
                                onChange={handleChange('description')}
                                defaultValue={values.description}
                            ></TextField>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={4} justify='center' alignItems='center'>
                            <Button variant='outlined' size='small' onClick={this.previous}>Go Back</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button color='primary' variant='contained' size='small' onClick={this.continue}>Continue</Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
