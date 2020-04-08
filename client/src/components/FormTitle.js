import React, { Component } from 'react'
import '../css/formTitle.css';

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
                <div className='gridContainer'>
                    <div>
                        <input type="text" name="title" onChange={handleChange('title')} value={values.title}/>
                    </div>
                    <div>
                        <input type="button" value="Continue"  onClick={this.continue}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}