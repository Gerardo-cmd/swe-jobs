import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
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
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
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

        const data = {
            email: email,
            password: password
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
            localStorage.setItem("jobs-token", data.data.token);
            navigate("/homepage");
        })
        .catch((error) => {
            console.error('Error:', error);
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
                    <TextField id="outlined-basic" error={passwordError} label="Password" variant="outlined" name="password" />
                </div>
                <div>
                    <Input type="submit" value="Submit" />
                </div>
            </Box>
        </div>
    );
}

export default Login;