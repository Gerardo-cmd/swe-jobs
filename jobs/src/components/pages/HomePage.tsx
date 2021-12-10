import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Header from '../sub-components/header';
import PositionCard from '../sub-components/positionCard';
import { useNavigate } from 'react-router';

interface PositionObject  {
    title: string;
    company: string;
    salary: string;
    workEnvironment: string;
    status: string;
}

interface FilterObject {
    appliedFilterOn: Boolean;
    interviewingFilterOn: Boolean;
    deniedFilterOn: Boolean;
    offeredFilterOn: Boolean
}

const sortingOptions = [
    {
        value: 'Alphabetically (Company)'
    },
    {
      value: 'Income'
    }
];

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<PositionObject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<String>("Income");
    const [filter, setFilter] = useState<FilterObject>({
        appliedFilterOn: false, 
        interviewingFilterOn: false, 
        deniedFilterOn: false, 
        offeredFilterOn: false
    });
    useEffect(() => {
        let headers = new Headers();
        const token: string | null = localStorage.getItem("jobs-token");
        if (token == null) {
            navigate("/");
        }
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        fetch("http://swe-jobs.herokuapp.com/jobs", {
            method: 'GET',
            mode: 'cors',
            headers: headers
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response);
            setJobs(response.data);
            setLoading(false);
        })
        .catch((e) => {
            console.log(e);
        });
    }, []);

    const changeAppliedFilter = () => {
        setFilter({
            appliedFilterOn: !filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeInterviewingFilter = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: !filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeDeniedFilter = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: !filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeOfferedFilter = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: !filter.offeredFilterOn
        });
    }

    const handleSortingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value);
    }

    const isFilterOn = () => {
        return (filter.appliedFilterOn || filter.interviewingFilterOn || filter.deniedFilterOn || filter.offeredFilterOn);
    }

    const filterPosition = (position: PositionObject) => {
        let passes = false;
        if (filter.appliedFilterOn && position.status.toLowerCase() === "applied") {
            passes = true;
        }
        if (filter.interviewingFilterOn && position.status.toLowerCase() === "interviewing") {
            passes = true;
        }
        if (filter.deniedFilterOn && position.status.toLowerCase() === "denied") {
            passes = true;
        }
        if (filter.offeredFilterOn && position.status.toLowerCase() === "offered") {
            passes = true;
        }
        return passes;
    }

    return (
        <div className="Page container">
            {loading ? "" : <div>
            <Header title={"Applied Positions"}/>
            <FormGroup style={{marginTop: "25px", marginBottom: "50px"}}>
                <div className="row"style={{marginBottom: "25px"}} >
                    <div className="col-2">
                    </div>
                    <div className="col-8">
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <FormControlLabel onChange={changeAppliedFilter} control={<Checkbox />} label="Applied" />
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <FormControlLabel onChange={changeInterviewingFilter} control={<Checkbox />} label="Interviewing" />
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <FormControlLabel onChange={changeDeniedFilter} control={<Checkbox />} label="Denied" />
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <FormControlLabel onChange={changeOfferedFilter} control={<Checkbox />} label="Offered" />
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
                <div className="row"style={{marginBottom: "10px"}} >
                    <div className="col-2">
                    </div>
                    <div className="col-8">
                        <TextField
                            id="standard-select-status"
                            select
                            label="Sort By"
                            value={sortBy}
                            onChange={handleSortingChange}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                            >
                            {sortingOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </TextField>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
            </FormGroup>
            {jobs.length === 0 ? "You currently have no saved positions": ""}
            <Box component="span">
                <div className="row">
                    {jobs.sort((a: PositionObject, b: PositionObject) => {
                        if (sortBy.toLowerCase() === "alphabetically (company)") {
                            if (a.company >= b.company) {
                                return 1; // a should come after b since 'a > b' means it's later in the alphabet
                            }
                            else {
                                return -1;
                            }
                        }
                        else {
                            if (parseInt(a.salary, 10) >= parseInt(b.salary, 10)) {
                                return -1; // a should come before b since it is bigger
                            }
                            else {
                                return 1;
                            }
                        }
                    }).map((position, index) => {
                        if (isFilterOn()) { // At least one of the filters are on
                            if (filterPosition(position)) {
                                return (
                                    <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                        <PositionCard
                                            title={position.title} 
                                            company={position.company} 
                                            salary={position.salary} 
                                            environment={position.workEnvironment} 
                                            status={position.status} 
                                        />
                                    </div>
                                );
                            }
                        }
                        else { // No filter is on so return all
                            return (
                                <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                    <PositionCard
                                        title={position.title} 
                                        company={position.company} 
                                        salary={position.salary} 
                                        environment={position.workEnvironment} 
                                        status={position.status} 
                                    />
                                </div>
                            );
                        }
                    })}
                </div>
            </Box>
            </div>}
        </div>
    );
}

export default HomePage;