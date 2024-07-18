import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


export default function Employees() {
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = () => {
        axiosInstance.get('/employees').then(resp => {
            if (resp.status >= 200 && resp.status <= 299) {
                setEmployees(resp.data);
            } else {
                toast.error("Failed to fetch employees.");
            }
        }).catch(error => {
            toast.error("Failed to fetch employees.");
            console.log('Error fetching employees:', error);
        });
    };
    
    const deleteEmployee = (id) => {
        axiosInstance.delete(`/employee/${id}`).then(resp => {
            if (resp.status >= 200 && resp.status <= 299) {
                fetchEmployees();
            } else {
                toast.error("Failed to delete employee.");
            }
        }).catch(error => {
            toast.error("Failed to delete employee.");
            console.log('Error deleting employees:', error);
        });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between">
            <h3>Employees</h3>    
            <Button variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} component={Link} to="/employees/add" >Add Employee</Button>
        </Box>   
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            { employees.length <= 0 ? 
                <div style={{ textAlign: 'center' }}>
                    <h2>No Employees Found</h2>
                </div> : 
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {employees.map((item, i) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{item.id}</TableCell>        
                                <TableCell component="th" scope="row">{item.name}</TableCell>
                                <TableCell component="th" scope="row">
                                    <DeleteOutlineIcon color='error' onClick={() => deleteEmployee(item.id)} />
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