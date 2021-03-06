import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import TemporaryDrawer from '../sub-components/persistantDrawerLeft';
import Header from '../sub-components/header';
import PositionCard from '../sub-components/positionCard';
import { useNavigate } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

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
    const [search, setSearch] = useState<string>("");
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
        fetch("https://swe-jobs.herokuapp.com/jobs", {
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

    const changeAppliedFilter:(() => void) = () => {
        setFilter({
            appliedFilterOn: !filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeInterviewingFilter:(() => void) = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: !filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeDeniedFilter:(() => void) = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: !filter.deniedFilterOn, 
            offeredFilterOn: filter.offeredFilterOn
        });
    }

    const changeOfferedFilter:(() => void) = () => {
        setFilter({
            appliedFilterOn: filter.appliedFilterOn,
            interviewingFilterOn: filter.interviewingFilterOn, 
            deniedFilterOn: filter.deniedFilterOn, 
            offeredFilterOn: !filter.offeredFilterOn
        });
    }

    const handleSortingChange:((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value);
    }

    const isFilterOn = () => {
        return (filter.appliedFilterOn || filter.interviewingFilterOn || filter.deniedFilterOn || filter.offeredFilterOn || search.trim() !== "");
    }

    const filterPosition:((position: PositionObject) => boolean) = (position: PositionObject) => {
        let passes: boolean = false;
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
        if (search !== "") {
            if (position.company.toLowerCase().includes(search.toLowerCase()) || position.title.toLowerCase().includes(search.toLowerCase())) {
                passes = true;
            }
            else {
                passes = false;
            }
        }
        return passes;
    }

    const handleSearchChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Changing search to " + event.target.value.trim());
        setSearch(event.target.value.trim());
    };

    return (
        <div className="Page container">
            <TemporaryDrawer />
            {loading ? <CircularProgress /> : <div>
            <Header title={"Applied Positions"}/>
            <FormGroup style={{marginTop: "15px", marginBottom: "50px", background: "white", boxShadow: `0 0 25px 3px black`, padding: "1rem"}}>
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
                        <div className="row">
                            <div style={{marginTop: "0.6rem"}} className="col-md-6">
                                <TextField id="outlined-basic" onChange={handleSearchChange} label="Search (Title or Company)" variant="outlined" name="search" />
                            </div>
                            <div style={{marginTop: "0.6rem"}} className="col-md-6">
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
                        </div>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
            </FormGroup>
            <div style={{fontWeight: "bold"}}>{jobs.length === 0 ? "You have no saved positions! Why not make a new one?": ""}</div>
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