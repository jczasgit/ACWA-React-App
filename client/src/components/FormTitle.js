import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import styles from './gridStyle';

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

    render() {
        const {values, handleChange} = this.props;
        return (
            <React.Fragment>
                <Grid container direction='column' justify='center' alignItems='center' spacing={4} style={styles.gridContainer}>
                    <Grid item con><TextField placeholder='Enter Title' label='Title' onChange={handleChange('title')} defaultValue={values.title}></TextField></Grid>
                    <Grid item>
                        <Button color='primary' variant='contained' size='small' onClick={this.continue}>Continue</Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}