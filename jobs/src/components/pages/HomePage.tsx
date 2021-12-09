import React, { useState, useEffect} from 'react';
import Header from '../sub-components/header';
import Box from '@mui/material/Box';
import PositionCard from '../sub-components/positionCard';

interface PositionObject  {
    title: String
    company: String
    salary: String
    workEnvironment: String
}

const HomePage: React.FC = () => {
    const [jobs, setJobs] = useState<PositionObject[]>([]);
    useEffect(() => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
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
        })
        .catch((e) => {
            console.log(e);
        });
    }, []);

    return (
        <div className="Page">
            <Header title={"Applied Positions"}/>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    {jobs.map((position, index) => {
                        return (
                            <PositionCard key={index} title={position.title} company={position.company} salary={position.salary} environment={position.workEnvironment}/>
                        );
                    })}
                </div>
            </Box>
        </div>
    );
}

export default HomePage;