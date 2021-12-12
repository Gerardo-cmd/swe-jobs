import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Header from '../sub-components/header';
import { useNavigate } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const resetErrors = () => {
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetErrors();
        
        const email = e.target.email.value.toLowerCase().trim();
        const password = e.target.password.value.trim();
        const confirmPassword = e.target.confirmPassword.value.trim();
        if (email === "") {
            setEmailError(true);
            return;
        }
        if (password === "") {
            setPasswordError(true);
            return;
        }
        if (confirmPassword === "") {
            setConfirmPasswordError(true);
            return;
        }
        if (password !== "" && confirmPassword !== "" && password !== confirmPassword) {
            setPasswordError(true);
            setConfirmPasswordError(true);
            return;
        }
        setLoading(true);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const data = {
            email,
            password
        };
        fetch('https://swe-jobs.herokuapp.com/new-user', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            localStorage.setItem("jobs-token", data.data.token);
            setLoading(false);
            navigate("/homepage");
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }

    return (
        <div className="Page container">
            <div style={{opacity: 0}}><Header title={"."}/></div>
                <Box
                    style={{  marginTop: "8rem", marginBottom: "8rem", border: "0.5px black solid", background: "white",  boxShadow: `0 0 25px 3px black`}}
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <Header title={"Sign Up"}/>
                    </div>
                    <div style={{marginTop: "1rem"}}>
                        <TextField id="outlined-basic" error={emailError} label="Email" variant="outlined" name="email" />
                    </div>
                    <div>
                        <TextField id="outlined-basic" error={passwordError} label="Password" type="password" variant="outlined" name="password" />
                    </div>
                    <div>
                        <TextField id="outlined-basic" error={confirmPasswordError} label="Confirm Password" type="password" variant="outlined" name="confirmPassword" />
                    </div>
                    <div>
                        {loading ? <CircularProgress /> : <Input type="submit" value="Submit" />}
                    </div>
                    <div style={{margin: '25px'}}>
                    <div>
                        <Button variant="outlined" onClick={() => {navigate("/")}}>Go Back</Button>
                    </div>
                    </div>
                </Box>
                
        </div>
    );
}

export default SignUp;