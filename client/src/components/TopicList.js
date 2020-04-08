import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default class TopicList extends Component {

    render() {
        const {topics} = this.props;
        const allAddedTopics = topics.map(topic => {
            const {content, id} = topic;
            return (
                <TableRow key={id}>
                    <TableCell>
                        {content}
                    </TableCell>
                    <TableCell align="right">
                        <IconButton onClick={this.props.delTopicField.bind(this, id)} size='small' color='secondary'>
                        <DeleteForeverIcon/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        });
        return (
            <TableContainer component={Paper} style={{width: '250px'}}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Topics Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allAddedTopics}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
