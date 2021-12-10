import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Header from '../sub-components/header';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const resetErrors = () => {
        setEmailError(false);
        setPasswordError(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetErrors();
        
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        let error = false;
        if (email === "") {
            setEmailError(true);
            error = true;
        }
        if (password === "") {
            setPasswordError(true);
            error = true;
        }
        if (error) {
            return;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const data = {
            email,
            password
        };
        fetch('http://swe-jobs.herokuapp.com/login', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.code === 401) {
                setEmailError(true);
                return;
            }
            else if (data.code === 402) {
                setPasswordError(true);
                return;
            }
            else if (data.code === 200) {
                localStorage.setItem("jobs-token", data.data.token);
                navigate("/homepage");
            }
            else {
                throw new Error("Unrecognized status code");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return;
        });
    }

    return (
        <div className="Page container">
            <Header title={"Jobs"}/>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <div>
                    <TextField id="outlined-basic" error={emailError} label="Email" variant="outlined" name="email" />
                </div>
                <div>
                    <TextField id="outlined-basic" error={passwordError} label="Password" type="password" variant="outlined" name="password" />
                </div>
                <div>
                    <Input type="submit" value="Login" />
                </div>
            </Box>
            <div style={{margin: '25px'}}>
                <div>
                    <Typography>Don't have an account?</Typography>
                </div>
                <div style={{margin: '5px'}}>
                    <Button variant="outlined" onClick={() => {navigate("/signup")}}>Sign Up</Button>
                </div>
            </div>
        </div>
    );
}

export default Login;