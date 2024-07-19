import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form'
import { FormControl, FormHelperText, Chip, OutlinedInput, Stack } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate, useParams  } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const formSchema =  z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    priority: z.enum(priorities),
    target_date: z.instanceof(dayjs).or(z.string()).transform((val) => {
      if (typeof val === 'string') return val;
      return val.format('YYYY-MM-DD');
    }),
    employee_ids: z.array(z.number()).optional(),
})
  
const defaultValues = {
    title: "",
    description: "",
    priority: "Medium",
    target_date: "",
    employee_ids: [],   
}

export default function EditTask() {
    const { taskid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedNames, setSelectedNames] = useState([]);

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
    
    const fetchTaskDetails = () => {
        axiosInstance.get(`/tasks/${taskid}`).then(resp => {
          if (resp.status >= 200 && resp.status <= 299) {
            reset({
              title: resp.data.title,
              description: resp.data.description,
              priority: resp.data.priority,
              target_date: dayjs(resp.data.target_date),
              employee_ids: resp.data.employees.map(emp => emp.id),
            });
            setSelectedNames(resp.data.employees);
          } else {
            toast.error("Failed to fetch task details.");
          }
        }).catch(error => {
            toast.error("Failed to fetch task details.");
            console.log('Error fetching task details:', error);
        });
    };
  
    const { control, handleSubmit, setError, formState: { errors }, reset} = useForm({
      resolver: zodResolver(formSchema),
      defaultValues,
    });
  
    const onSubmit = handleSubmit(async (data) => {
      console.log(`Updating task with data: ${JSON.stringify(data)}`);
      setLoading(true);
      const customConfig = { headers: { 'Content-Type': 'application/json' } }
      const params = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        target_date: dayjs(data.target_date).format('YYYY-MM-DD'),
        employee_ids: selectedNames.map(emp => emp.id),   
      }
      console.log(`Updating task with params: ${JSON.stringify(params)}`);
      axiosInstance.put(`/tasks/${taskid}/`, JSON.stringify(params), customConfig).then(resp => {
        setLoading(false);
        if (resp.status >= 200 && resp.status <= 299) {
          setSelectedNames([]); 
          navigate("/");
        }
      }).catch(err => {
          setLoading(false);
          toast.error("Failed to add task.");
      });
    })

    useEffect(() => {
      fetchEmployees();
      fetchTaskDetails();
    }, []);

    return (
        <>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <h3>Edit Task</h3>  
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
                <Grid container spacing={3} sx={{ pt: 2 }}>
                    <Grid item sm={6}>
                        <FormControl fullWidth>
                        <Controller name="priority" control={control} render={({ field: { value, onChange } }) => (
                            <>
                                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={value} label="Priority" onChange={onChange}>
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
                                <DatePicker label="Target Date" value={dayjs(value)} onChange={(val) => {  
                                  onChange(dayjs(val).format('YYYY-MM-DD'));
                                }} format="DD-MM-YYYY" views={["year", "month", "day"]}
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
                          <Chip key={value.id} label={value.name} onDelete={() =>
                            setSelectedNames(
                              selectedNames.filter((item) => item !== value)
                            )
                          }
                          deleteIcon={
                            <CancelIcon
                              onMouseDown={(event) => event.stopPropagation()}
                            />
                          } />
                        ))}
                      </Stack>
                    )}
                    onChange={(e) => {
                      console.log("Selected Names: ", e.target.value);
                      setSelectedNames(e.target.value)
                    }}
                    input={<OutlinedInput label="Multiple Select" />}>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp}>
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
                <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>{ loading ? 'Loading...' : 'Submit' }</Button>
            </Box>
            </Paper>
            </Grid>
        </Grid>
        </Container>
        </>
    );
}