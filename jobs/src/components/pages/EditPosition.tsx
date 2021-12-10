import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Header from '../sub-components/header';
import { useNavigate, useParams } from 'react-router';

interface PositionObject  {
    title: string;
    company: string;
    salary: string;
    workEnvironment: string;
    status: string;
}

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

const EditPosition: React.FC = () => {
    let params = useParams();
    const navigate = useNavigate();
    const [positionTitleError, setPositionTitleError] = useState(false);
    const [companyError, setCompanyError] = useState(false);
    const [salaryError, setSalaryError] = useState(false);
    const [environment, setEnvironment] = useState('On-site');
    const [status, setStatus] = useState('Applied');
    const [job, setJob] = useState<PositionObject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const positionId = params.positionId;
        let headers = new Headers();
        const token: string | null = localStorage.getItem("jobs-token");
        if (token == null) {
            navigate("/");
        }
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        fetch(`https://swe-jobs.herokuapp.com/job/${positionId}`, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            if (response.code !== 200) {
                navigate("/homepage");
            }
            console.log(response);
            setJob(response.data);
            setEnvironment(response.data.workEnvironment);
            setStatus(response.data.status);
            setLoading(false);
        })
        .catch((e) => {
            console.log(e);
        });
    }, []);

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
        const token: string | null = localStorage.getItem("jobs-token");
        if (token == null) {
            navigate("/");
        }
        resetErrors();
        let headers = new Headers();
        const positionId = params.positionId;
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
            jobId: positionId,
            title: positionTitle,
            company: company,
            salary: salary,
            workEnvironment: environment,
            status: status
        };
        fetch('https://swe-jobs.herokuapp.com/job', {
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

    const handleDelete = () => {
        const token: string | null = localStorage.getItem("jobs-token");
        if (token == null) {
            navigate("/");
        }
        const positionId = params.positionId;
        const data = {
            jobId: positionId
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        fetch('https://swe-jobs.herokuapp.com/job', {
            method: 'DELETE',
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
            <Header title={"Edit Position"}/>
            {loading ? "" : 
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
                    <TextField id="outlined-basic" defaultValue={job?.title} error={positionTitleError} label="Position Title" variant="outlined" name="positionTitle" inputProps={{ maxLength: 40 }} />
                </div>
                <div>
                    <TextField id="outlined-basic" defaultValue={job?.company} error={companyError} label="Company" variant="outlined" name="company" />
                </div>
                <div>
                    <FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Yearly Salary</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            error={salaryError}
                            label="Yearly Salary"
                            name="salary"
                            defaultValue={job?.salary}
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
                    <Input type="submit" value="Save" />
                </div>
                <div style={{margin: '10px'}}>
                    <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
                </div>
                <div style={{margin: '10px'}}>
                    <Button variant="outlined" onClick={() => {navigate("/homepage")}}>Cancel</Button>
                </div>
            </Box>}
        </div>
    );
}

export default EditPosition;