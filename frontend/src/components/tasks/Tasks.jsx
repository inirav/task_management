import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';


export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
  
    const fetchTasks = () => {
        axiosInstance.get('/tasks').then(resp => {
            if (resp.status >= 200 && resp.status <= 299) {
                console.log("Fetched tasks: ", resp.data);
                setTasks(resp.data);
            } else {
                toast.error("Failed to fetch tasks.");
            }
        }).catch(error => {
            toast.error("Failed to fetch tasks.");
            console.error('Error fetching tasks:', error);
        });
    };

    const deleteTask = (id) => {
        axiosInstance.delete(`/tasks/${id}/`).then(resp => {
            if (resp.status >= 200 && resp.status <= 299) {
                fetchTasks();
            } else {
                toast.error("Failed to delete task.");
            }
        }).catch(error => {
            toast.error("Failed to delete task.");
            console.log('Error deleting task:', error);
        });
    };

    useEffect(() => {
        fetchTasks();
      }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>    
        <Box display="flex" justifyContent="space-between">
            <h3>Tasks</h3>    
            <Button variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} component={Link} to="/tasks/add" >Add Task</Button>
        </Box>    
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Target Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Priority</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Employees</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {tasks.map((item) => (
                            <TableRow key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {item.title}
                            </TableCell>
                            <TableCell>{item.description || 'No Description'}</TableCell>
                            <TableCell align="right">{dayjs(item.target_date).format('DD MMM YYYY')}</TableCell>
                            <TableCell align="right">{item.priority}</TableCell>
                            <TableCell align="center">{item.employees?.length}</TableCell>
                            <TableCell align="center">
                                <EditIcon color='primary' onClick={() => navigate(`/tasks/${item.id}/edit`)} sx={{ mx: 2 }} />
                                <DeleteOutlineIcon color='error' onClick={() => deleteTask(item.id)} />
                            </TableCell>
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