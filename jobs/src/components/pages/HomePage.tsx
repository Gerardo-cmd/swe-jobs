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
        <div className="Page container">
            <Header title={"Applied Positions"}/>
            <Box component="span">
                <div className="row">
                    {jobs.map((position, index) => {
                        return (
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <PositionCard key={index} title={position.title} company={position.company} salary={position.salary} environment={position.workEnvironment} />
                            </div>
                        );
                    })}
                </div>
            </Box>
        </div>
    );
}

export default HomePage;