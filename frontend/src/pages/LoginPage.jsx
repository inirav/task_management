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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axiosInstance from '../axiosConfig';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';


const defaultTheme = createTheme();

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const customConfig = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    const params = {
        username: data.get('username'),
        password: data.get('password'),
    }
    axiosInstance.post('/token', params, customConfig).then(resp => {
        console.log(`resp: ${resp}`);
        setLoading(false);
        if (resp.status >= 200 && resp.status <= 299) {
            localStorage.setItem("token", resp.data.access_token);    
            localStorage.setItem("refresh_token", resp.data.refresh_token);    
            navigate("/");
        }
    }).catch(err => {
        setLoading(false);
        toast.error("Invalid username or password");
        console.log(`error: ${err}`);
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoFocus />
            <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" autoComplete="current-password" />
            <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{ loading ? 'Loading...' : 'Login' }</Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}