import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TemporaryDrawer from '../sub-components/persistantDrawerLeft';
import Header from '../sub-components/header';
import { useNavigate, useParams } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

interface PositionObject  {
    title: string;
    company: string;
    salary: string;
    workEnvironment: string;
    status: string;
    desc: string | null;
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
    const [positionTitleError, setPositionTitleError] = useState<boolean>(false);
    const [companyError, setCompanyError] = useState<boolean>(false);
    const [salaryError, setSalaryError] = useState<boolean>(false);
    const [environment, setEnvironment] = useState<string>('On-site');
    const [status, setStatus] = useState<string>('Applied');
    const [job, setJob] = useState<PositionObject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const positionId: string | undefined = params.positionId;
        let headers: HeadersInit | undefined = new Headers();
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

    const handleEnvironmentChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnvironment(event.target.value);
    };
    const handleStatusChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    };

    const resetErrors: (() => void) = () => {
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
        const positionTitle: string = e.target.positionTitle.value.trim();
        const company: string = e.target.company.value.trim();
        const salary: string = e.target.salary.value.replaceAll(",", "").trim();
        const desc: string = e.target.desc.value.trim();
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
            status: status,
            desc: desc !== "" ? desc : null
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

    const handleDelete: (() => void) = () => {
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
            <TemporaryDrawer />
            <Header title={"Edit Position"}/>
            {loading ? <CircularProgress /> : 
            <Box
                style={{ marginTop: "15px", border: "0.5px black solid", background: "white", boxShadow: `0 0 25px 3px black`, padding: "0.5rem"}}
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
                    <TextField
                        id="outlined-multiline-static"
                        label="Description (optional)"
                        multiline
                        rows={4}
                        defaultValue={job?.desc}
                        name="desc"
                    />
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