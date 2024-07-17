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


export default function Users() {
    const [users, setUsers] = useState([]);
  
    const fetchUsers = () => {
        axiosInstance.get('/users').then(resp => {
            console.log(`resp: ${JSON.stringify(resp.data)}`);
            setUsers(resp.data);
        }).catch(error => {
            console.log('Error fetching users:', error);
        });
    };

    useEffect(() => {
        fetchUsers();
      }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Users</h3>    
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            { users.length <= 0 ? 
                <div style={{ textAlign: 'center' }}>
                    <h2>No Users Found</h2>
                </div> : 
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {users.map((item) => (
                            <TableRow key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {item.full_name || 'Not Available'}
                            </TableCell>
                            <TableCell>{item.username}</TableCell>
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