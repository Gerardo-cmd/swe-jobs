import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Header from '../sub-components/header';
import { useNavigate } from 'react-router';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);

    const resetErrors = () => {
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetErrors();
        
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        const confirmPassword = e.target.confirmPassword.value.trim();
        let error = false;
        if (email === "") {
            setEmailError(true);
            error = true;
        }
        if (password === "") {
            setPasswordError(true);
            error = true;
        }
        if (confirmPassword === "") {
            setConfirmPasswordError(true);
            error = true;
        }
        if (password !== "" && confirmPassword !== "" && password !== confirmPassword) {
            setPasswordError(true);
            setConfirmPasswordError(true);
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
        fetch('http://swe-jobs.herokuapp.com/new-user', {
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
            <Header title={"Sign Up"}/>
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
                    <TextField id="outlined-basic" error={confirmPasswordError} label="Confirm Password" variant="outlined" name="confirmPassword" />
                </div>
                <div>
                    <Input type="submit" value="Submit" />
                </div>
            </Box>
            <Button variant="outlined" onClick={() => {navigate("/")}}>Go back</Button>
        </div>
    );
}

export default SignUp;