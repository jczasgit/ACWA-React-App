import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default class AttachedFilesList extends Component {
    render() {
        const {attachedFiles} = this.props;
        const allFiles = attachedFiles.map(attachedFile => {
            const {name} = attachedFile;
            return (
                <TableRow key={name}>
                    <TableCell>
                        <div className="files">
                            {name}
                            <IconButton onClick={this.props.delAttachedFile.bind(this, name)} size='small' color='secondary'>
                            <DeleteForeverIcon/>
                            </IconButton>
                        </div>
                    </TableCell>
                </TableRow>
            )
        });
        return (
            <TableContainer component={Paper} className='files-container'>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Files:</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allFiles}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}
