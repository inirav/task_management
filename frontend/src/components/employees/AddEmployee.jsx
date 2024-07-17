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
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';


export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
  
    const fetchEmployees = () => {
        axiosInstance.get('/employees').then(resp => {
            console.log(`resp: ${JSON.stringify(resp.data)}`);
            setEmployees(resp.data);
        }).catch(error => {
            console.log('Error fetching employees:', error);
        });
    };

    useEffect(() => {
        fetchEmployees();
      }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Add Employee</h3>  
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {employees.map((item) => (
                            <TableRow key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {item.name}
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