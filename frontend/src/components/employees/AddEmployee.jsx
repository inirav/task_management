import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form'
import { FormControl, FormHelperText } from '@mui/material'
import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import toast from 'react-hot-toast';

const formSchema =  z.object({
    name: z.string().min(3),
})
  
const defaultValues = {
    name: '',
}


export default function Employees() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  
    const { control, handleSubmit, setError, formState: { errors }} = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues
    });
  
    const onSubmit = handleSubmit(async (data) => {
      setLoading(true);
      const customConfig = { headers: { 'Content-Type': 'application/json' } }
      const params = {
        name: data.name,
      }
      axiosInstance.post('/employee', JSON.stringify(params), customConfig).then(resp => {
        setLoading(false);
        if (resp.status >= 200 && resp.status <= 299) {
            navigate("/employees");
        }
      }).catch(err => {
          setLoading(false);
          toast.error("Failed to add employee.");
      });
    })

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Add Employee</h3>  
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <FormControl fullWidth>
                    <Controller name='name' control={control} render={({ field: { value, onChange } }) => (
                        <TextField margin="normal" fullWidth value={value} label='Employee Name' onChange={onChange} error={Boolean(errors.name)} required />
                    )}/>
                    {errors.name && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText> )}
                </FormControl>
                <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{ loading ? 'Loading...' : 'Submit' }</Button>
            </Box>
            </Paper>
            </Grid>
        </Grid>
        </Container>
        </>
    );
}