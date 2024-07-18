import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form'
import { FormControl, FormHelperText, Chip, OutlinedInput, Stack } from '@mui/material'
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
    target_date: z.string(),
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
    const [selectedNames, setSelectedNames] = useState([]);
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
        title: data.title,
        description: data.description,
        priority: data.priority,
        target_date: data.target_date,
        employee_ids: employees.map(emp => emp.id),   
      }
      console.log(`Adding task with params: ${JSON.stringify(params)}`);
    //   axiosInstance.post('/tasks', JSON.stringify(params), customConfig).then(resp => {
    //     setLoading(false);
    //     if (resp.status >= 200 && resp.status <= 299) {
    //         navigate("/tasks");
    //     }
    //   }).catch(err => {
    //       setLoading(false);
    //       toast.error("Failed to add employee.");
    //   });
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
                        <FormControl fullWidth>
                        <Controller name="priority" control={control} render={({ field: { value, onChange } }) => (
                            <>
                                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value} label="Priority" onChange={(val) => {
                                    onChange(val);
                                }}>
                                {priorities.map((priority, i) => (
                                    <MenuItem key={i} value={priority}>{priority}</MenuItem>
                                ))}    
                                </Select>
                            </>
                            )}
                        />
                        {errors.priority && ( <FormHelperText sx={{ color: "error.main" }}>{errors.priority.message}</FormHelperText> )}
                        </FormControl>
                    </Grid>
                    <Grid item sm={6}>
                        <FormControl fullWidth>
                            <Controller name='target_date' control={control} render={({ field: { value, onChange } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker label="Target Date" value={null} onChange={(newValue) => {}} format="DD-MM-YYYY" views={["year", "month", "day"]}
                                  slots={{
                                    textField: (params) => (
                                      <TextField variant="filled" {...params} />
                                    ),
                                  }}
                                />
                              </LocalizationProvider>
                            )}/>
                            {errors.target_date && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.target_date.message}</FormHelperText> )}
                        </FormControl>
                    </Grid>
                </Grid>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Employees</InputLabel>
                  <Select multiple value={selectedNames}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                    onChange={(e) => setSelectedNames(e.target.value)}
                    input={<OutlinedInput label="Multiple Select" />}>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.name}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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