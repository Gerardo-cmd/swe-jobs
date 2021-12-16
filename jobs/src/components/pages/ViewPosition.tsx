import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

const ViewPosition: React.FC = () => {
    let params = useParams();
    const navigate = useNavigate();
    const [environment, setEnvironment] = useState<string>('On-site');
    const [status, setStatus] = useState<string>('Applied');
    const [color, setColor] = useState<string>("blue");
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
            setColor(statusColor());
            setLoading(false);
            console.log(`Color after loading is now ${color}`)
        })
        .catch((e) => {
            console.log(e);
        });
    }, [color]);

    const statusColor: (() => string) = () => {
        console.log("Entered the statusColor function!");
        let color: string = "blue";
        console.log(status.toLowerCase());
        switch (status.toLowerCase()) {
            case "interviewing":
                color = "orange";
                break;
            case "denied":
                color = "red";
                break;
            case "offered":
                color = "green";
                break;
            case "applied":
                color = "blue";
                break;
        }
        console.log(color);
        return color;
    }
    

    return (
        <div className="Page container">
            <TemporaryDrawer />
            <Header title={"Position"}/>
            {loading ? <CircularProgress /> : 
            <Box
                component="span"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
            >
                <div style={{ marginTop: "15px", border: "0.5px black solid", background: "white", boxShadow: `0 0 25px 3px black`, padding: "0.5rem", minHeight: "300px"}} className="row">
                    {/*<div className="col-md-6">*/}
                        <div>
                            <Typography style={{fontSize: "24px"}}>{job?.company}</Typography>
                        </div>
                        <div>
                            <Typography style={{fontSize: "32px"}}>{job?.title}</Typography>
                        </div>
                        <div>
                            <Typography style={{fontSize: "28px"}}>${job?.salary}</Typography>
                        </div>
                        <div>
                            <Typography style={{fontSize: "18px"}}>{job?.workEnvironment}</Typography>
                        </div>
                        <div>
                            <Typography style={{fontSize: "16px"}}>{job?.status}</Typography>
                        </div>
                        <div>
                            <Typography style={{fontSize: "18px", marginTop: '10px'}}>{job?.desc ? job?.desc : <p>No description provided</p>}</Typography>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col-sm-4" />
                                <div className="col-sm-2">
                                    <Button variant="outlined" onClick={() => {navigate(`/${job?.company.replace(/ /g, "_")}-${job?.title.replace(/ /g, "_")}`)}}>Edit</Button>
                                </div>
                                <div className="col-sm-2">
                                    <Button variant="outlined" onClick={() => {navigate(`/homepage`)}}>Return</Button>
                                </div>
                                <div className="col-sm-4" />
                            </div>
                        </div>
                    {/*</div>*/}
                    {/*<div className="col-md-6">*/}
                        
                   {/* </div>*/}
                </div>
            </Box>}
        </div>
    );
}

export default ViewPosition;