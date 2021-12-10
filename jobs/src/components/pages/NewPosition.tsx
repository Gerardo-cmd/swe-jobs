import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Header from '../sub-components/header';
import { useNavigate } from 'react-router';

const environments = [
    {
      value: 'On-site'
    },
    {
      value: 'Hybrid'
    },
    {
      value: 'Remote'
    }
];

const statuses = [
    {
        value: 'Applied'
    },
    {
        value: 'Interviewing'
    },
    {
        value: 'Denied'
    },
    {
        value: 'Offered'
    }
];

const NewPosition: React.FC = () => {
    const navigate = useNavigate();
    const [positionTitleError, setPositionTitleError] = useState(false);
    const [companyError, setCompanyError] = useState(false);
    const [salaryError, setSalaryError] = useState(false);
    const [environment, setEnvironment] = useState('On-site');
    const [status, setStatus] = useState('Applied');

    const handleEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnvironment(event.target.value);
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    };

    const resetErrors = () => {
        setPositionTitleError(false);
        setCompanyError(false);
        setSalaryError(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetErrors();
        let headers = new Headers();

        const token: string | null = localStorage.getItem("jobs-token");
        if (token == null) {
            navigate("/");
        }
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        const positionTitle = e.target.positionTitle.value.trim();
        const company = e.target.company.value.trim();
        const salary = e.target.salary.value.replaceAll(",", "").trim();
        let error = false;
        if (positionTitle === "") {
            setPositionTitleError(true);
            error = true;
        }
        if (company === "") {
            setCompanyError(true);
            error = true;
        }
        if (salary === "" || !(/^\d+$/.test(salary))) {
            setSalaryError(true);
            error = true;
        }
        if (error) {
            return;
        }

        const data = {
            title: positionTitle,
            company: company,
            salary: salary,
            workEnvironment: environment,
            status: status
        };
        fetch('http://swe-jobs.herokuapp.com/new-job', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            navigate("/homepage");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="Page container">
            <Header title={"New Position"}/>
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
                    <TextField id="outlined-basic" error={positionTitleError} label="Position Title" variant="outlined" name="positionTitle" />
                </div>
                <div>
                    <TextField id="outlined-basic" error={companyError} label="Company" variant="outlined" name="company" />
                </div>
                <div>
                    <FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Yearly Salary</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            error={salaryError}
                            label="Yearly Salary"
                            name="salary"
                        />
                    </FormControl>
                </div>
                <div>
                    <TextField
                        id="standard-select-environment"
                        select
                        label="Environment"
                        value={environment}
                        onChange={handleEnvironmentChange}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        >
                        {environments.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </TextField>
                </div>
                <div>
                    <TextField
                        id="standard-select-status"
                        select
                        label="Status"
                        value={status}
                        onChange={handleStatusChange}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        >
                        {statuses.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </TextField>
                </div>
                <div>
                    <Input type="submit" value="Submit" />
                </div>
            </Box>
        </div>
    );
}

export default NewPosition;