import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';


export default function Tasks() {
    const [tasks, setTasks] = useState([]);
  
    const fetchTasks = () => {
        axiosInstance.get('/tasks').then(resp => {
            console.log(`resp: ${JSON.stringify(resp.data)}`);
            setTasks(resp.data);
        }).catch(error => {
            console.error('Error fetching tasks:', error);
        });
    };

    useEffect(() => {
        fetchTasks();
      }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Tasks</h3>        
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            { tasks.length <= 0 ? 
                <div style={{ textAlign: 'center' }}>
                    <h2>No Tasks Found</h2>
                </div> : 
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Target Date</TableCell>
                                <TableCell>Priority</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {tasks.map((item) => (
                            <TableRow key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {item.title}
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="right">{item.target_date}</TableCell>
                            <TableCell>{item.priority}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            </Paper>
            </Grid>
        </Grid>
        </Container>
        </>
    );
}