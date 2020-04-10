import React, { Component } from 'react'
import {Link} from 'react-router-dom';

export default class Header extends Component {
    render() {
        return (
            <div style= {divStyle}>
                <h1 style= {h1Style}>Assign!</h1>
                <nav style= {navStyle}><Link to='/' style={linkStyle}>Home</Link><Link style={linkStyle} to='/add-topic'>Add New Assignment!</Link></nav>
            </div>
        )
    }
}

// colors: pink-main = #e91e63, pink-light = #f8bbd0, pink-dark = #c2185b, contrast = #fff;
// originals: #3B4A6B, #F0D43A, #22B2DA

const divStyle = {
    width: '100%',
    height: '10vh',
    backgroundColor: '#e91e63',
    position: 'relative',
}

const h1Style = {
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    textAlign: 'center',
    fontSize: '1.5em',
}

const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    position: 'absolute',
    width: '100%',
    top: '80%',
    fontSize: '0.85em',
    transform: 'translateY(-50%)',
    textAlign: 'center',
}

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.8em',
    cursor: 'pointer',
}