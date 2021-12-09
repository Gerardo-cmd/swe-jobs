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

const NewPosition: React.FC = () => {
    const navigate = useNavigate();
    const [positionTitleError, setPositionTitleError] = useState(false);
    const [companyError, setCompanyError] = useState(false);
    const [salaryError, setSalaryError] = useState(false);
    const [environment, setEnvironment] = useState('On-site');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnvironment(event.target.value);
    };

    const resetErrors = () => {
        setPositionTitleError(false);
        setCompanyError(false);
        setSalaryError(false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        resetErrors();
        const positionTitle = e.target.positionTitle.value;
        const company = e.target.company.value;
        const salary = e.target.salary.value;
        let error = false;
        if (positionTitle.trim() === "") {
            setPositionTitleError(true);
            error = true;
        }
        if (company.trim() === "") {
            setCompanyError(true);
            error = true;
        }
        if (salary.trim() === "") {
            setSalaryError(true);
            error = true;
        }
        if (error) {
            return;
        }
        //Save to database with Fetch request...
        navigate("/");
    }

    return (
        <div>
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
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Yearly Salary"
                            name="salary"
                        />
                    </FormControl>
                </div>
                <div>
                    <TextField
                        id="standard-select-currency-native"
                        select
                        label="Environment"
                        value={environment}
                        onChange={handleChange}
                        SelectProps={{
                            native: true,
                        }}
                        helperText="Select One"
                        variant="standard"
                        >
                        {environments.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </TextField>
                </div>
                <div>
                    {/* Try using Material-UI's Input that's already imported at the top? */}
                    <Input type="submit" value="Submit" />
                </div>
            </Box>
        </div>
    );
}

export default NewPosition;