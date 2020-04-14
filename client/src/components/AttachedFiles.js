import React, { Component } from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';

export default class AttachedFiles extends Component {
    
    downloadFile = async path => {
        const splitPath = path.split('/');
        const response = await fetch(`/api/download/${splitPath[2]}/${splitPath[3]}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

    render() {
        const allAttachedFiles = this.props.attachedFilePaths.map(attachedFile => {
            const {path} = attachedFile;
            const splitPath = path.split('/');
            return(
                <div key={path} className='attachedFile'>
                    <DescriptionIcon fontSize='small'/>
                    <div>{splitPath[3]}</div>
                    <div className='downloadIcon'><IconButton color='inherit' onClick={() => this.downloadFile(path)}><GetAppIcon fontSize='small'/></IconButton></div>
                </div>
            )
        });
        return (
            <div>
                {allAttachedFiles}
            </div>
        )
    }
}
