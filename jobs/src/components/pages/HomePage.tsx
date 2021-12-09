import React, { useState, useEffect} from 'react';
import Header from '../sub-components/header';
import { Button, Drawer } from '@mui/material';

const HomePage: React.FC = () => {
    const [jobs, setJobs] = useState([]);
    // useEffect(() => {
        
    // }, [jobs]);

    const showJobs = () => {
        console.log(jobs);
        // fetch("http://swe-jobs.herokuapp.com/jobs", {
        //     method: 'GET',
        //     mode: 'no-cors'
        // })
        // // .then((response) => {
        // //     console.log(response);
        // //     return response.json();
        // // })
        // .then((response) => {
        //     console.log(response);
        //     setJobs(response);
        // })
        // .catch((e) => {
        //     console.log(e);
        // });
    }

    return (
        <div className="Page">
            <Header title={"Applied Positions"}/>
        </div>
    );
}

export default HomePage;