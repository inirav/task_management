import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form'
import { FormControl, FormHelperText } from '@mui/material'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import toast from 'react-hot-toast';

const formSchema =  z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    priority: z.string(),
    target_date: z.date(),
    employee_ids: z.array(),
})
  
const defaultValues = {
    title: "",
    description: "",
    priority: "",
    target_date: "",
    employee_ids: [],   
}


export default function AddTask() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

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
  
    const { control, handleSubmit, setError, formState: { errors }} = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues
    });
  
    const onSubmit = handleSubmit(async (data) => {
      setLoading(true);
      const customConfig = { headers: { 'Content-Type': 'application/json' } }
      const params = {
        title: "",
        description: "",
        priority: "",
        target_date: "",
        employee_ids: [],   
      }
      axiosInstance.post('/tasks', JSON.stringify(params), customConfig).then(resp => {
        setLoading(false);
        if (resp.status >= 200 && resp.status <= 299) {
            navigate("/tasks");
        }
      }).catch(err => {
          setLoading(false);
          toast.error("Failed to add employee.");
      });
    })

    useEffect(() => {
        fetchEmployees();
      }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Add Task</h3>  
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                <FormControl fullWidth>
                    <Controller name='title' control={control} render={({ field: { value, onChange } }) => (
                        <TextField margin="normal" fullWidth value={value} label='Title' onChange={onChange} error={Boolean(errors.title)} required />
                    )}/>
                    {errors.title && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText> )}
                </FormControl>
                <Grid container spacing={3}>
                    <Grid item sm={6}>
                    <FormControl>
                        <Controller name='title' control={control} render={({ field: { value, onChange } }) => (
                            <TextField margin="normal" value={value} label='Title' onChange={onChange} error={Boolean(errors.title)} required />
                        )}/>
                        {errors.title && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText> )}
                    </FormControl>
                    <Grid item sm={6}>
                        <FormControl>
                            <Controller name='title' control={control} render={({ field: { value, onChange } }) => (
                                <TextField margin="normal" value={value} label='Title' onChange={onChange} error={Boolean(errors.title)} required />
                            )}/>
                            {errors.title && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText> )}
                        </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <FormControl fullWidth>
                    <Controller name='description' control={control} render={({ field: { value, onChange } }) => (
                        <TextField margin="normal" fullWidth multiline rows={3} value={value} label='Description' onChange={onChange} error={Boolean(errors.description)} required />
                    )}/>
                    {errors.description && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText> )}
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