import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControl, FormHelperText } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { z } from "zod";
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../axiosConfig';

const formSchema =  z.object({
  full_name: z.string().min(3),
  username: z.string().min(3),
  password: z.string().min(6),
})

const defaultValues = {
  full_name: '',
  username: '',
  password: '',
}

const defaultTheme = createTheme();

export default function RegisterPage() {
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
      full_name: data.full_name,
      username: data.username,
      password: data.password,
    }
    axiosInstance.post('/users', JSON.stringify(params), customConfig).then(resp => {
      setLoading(false);
      if (resp.status >= 200 && resp.status <= 299) {
          navigate("/login");
      }
    }).catch(err => {
        setLoading(false);
        toast.error("Failed to register. Please try again.");
    });
  })

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Register</Typography>
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <Controller name='full_name' control={control} render={({ field: { value, onChange } }) => (
                <TextField margin="normal" fullWidth value={value} label='Full Name' onChange={onChange} error={Boolean(errors.full_name)} required />
              )}/>
            {errors.full_name && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.full_name.message}</FormHelperText> )}
          </FormControl>
          <FormControl fullWidth>
            <Controller name='username' control={control} render={({ field: { value, onChange } }) => (
                <TextField margin="normal" fullWidth value={value} label='Username' onChange={onChange} error={Boolean(errors.username)} required />
              )}/>
            {errors.username && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText> )}
          </FormControl>
          <FormControl fullWidth>
            <Controller name='password' control={control} render={({ field: { value, onChange } }) => (
                <TextField margin="normal" type='password' fullWidth value={value} label='Password' onChange={onChange} error={Boolean(errors.password)} required />
              )}/>
            {errors.password && ( <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText> )}
          </FormControl>
            <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{ loading ? 'Loading...' : 'Register' }</Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}