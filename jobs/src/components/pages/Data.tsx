import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import TemporaryDrawer from '../sub-components/persistantDrawerLeft';
import Header from '../sub-components/header';
import Graph from '../sub-components/graph';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

interface Tally {
    applied: number;
    interviewing: number;
    denied: number;
    offered: number;
    total: number;
}

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

const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

const Data: React.FC = () => {
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
        let headers: HeadersInit | undefined = new Headers();
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

    const calculateTally: (() => Tally) = () => {
        let counts = {
          applied: 0,
          interviewing: 0,
          denied: 0,
          offered: 0,
          total: 0
        }
        jobs.forEach((job) => {
          switch (job.status.toLowerCase()) {
            case "applied":
              counts.applied++;
              break;
            case "interviewing":
              counts.interviewing++;
              break;
            case "denied":
              counts.denied++;
              break;
            case "offered":
              counts.offered++;
              break;
          }
          counts.total++;
        });
        return counts;
      };

    return (
        <div className="Page container">
            <TemporaryDrawer />
            {loading ? <CircularProgress /> : <div>
            <Header title={"Data"}/>
                <div className="row">
                    <div className="col-sm-1" />
                        <div style={{ marginTop: "15px", border: "0.5px black solid", background: "white", boxShadow: `0 0 25px 3px black`, padding: "0.5rem"}} className="col-sm-10">
                            <div style={{fontWeight: "bold"}}>{jobs.length === 0 ? "You have no saved positions! Why not make a new one?": ""}</div>
                            <Box component="span">
                                <Typography style={{color: "blue", fontWeight: "bold", marginTop: "2rem"}}>Applied: {Math.round((((calculateTally().applied / calculateTally().total) * 100 + Number.EPSILON) * 100) / 100)}% ({calculateTally().applied})</Typography>
                                <Typography style={{color: "orange", fontWeight: "bold"}}>Interviewing: {Math.round((((calculateTally().interviewing / calculateTally().total) * 100 + Number.EPSILON) * 100) / 100)}% ({calculateTally().interviewing})</Typography>
                                <Typography style={{color: "red", fontWeight: "bold"}}>Denied: {Math.round((((calculateTally().denied / calculateTally().total) * 100 + Number.EPSILON) * 100) / 100)}% ({calculateTally().denied})</Typography>
                                <Typography style={{color: "green", fontWeight: "bold"}}>Offered: {Math.round((((calculateTally().offered / calculateTally().total) * 100 + Number.EPSILON) * 100) / 100)}% ({calculateTally().offered})</Typography>
                                <Graph jobs={jobs}/>
                            </Box>
                        </div>
                    <div className="col-sm-1" />
                </div>
            </div>}
        </div>
    );
}

export default Data;