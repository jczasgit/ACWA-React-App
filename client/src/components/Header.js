import React, { Component } from 'react'
import {Link} from 'react-router-dom';

export default class Header extends Component {
    render() {
        return (
            <div style= {divStyle}>
                <h1 style= {h1Style}>SCH<span style= {spanStyle}>4U</span></h1>
                <nav style= {navStyle}><Link to='/' style={linkStyle}>Home</Link><Link style={linkStyle} to='/add-topic'>Add Topic</Link></nav>
            </div>
        )
    }
}

const divStyle = {
    width: '100%',
    height: '10vh',
    backgroundColor: '#3B4A6B',
    position: 'relative',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
}

const h1Style = {
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#F0D43A',
    textAlign: 'center',
}

const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    position: 'absolute',
    width: '100%',
    top: '80%',
    transform: 'translateY(-50%)',
    textAlign: 'center',
}

const linkStyle = {
    color: '#FDF6F6',
    textDecoration: 'none',
}

const spanStyle = {
    color: '#22B2DA'
}