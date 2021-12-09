import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const card = (company: String, title: String, salary: String, environment: String) => {
    return (
        <React.Fragment>
            <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {company}
            </Typography>
            <Typography variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2">
                ${salary} per year
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {environment}
            </Typography>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Learn More</Button>
            </CardActions> */}
        </React.Fragment>
    )
};

interface CardProps {
    title: String;
    company: String;
    salary: String;
    environment: String;
}

const PositionCard = (props: CardProps) => {
  return (
      <Card style={{margin: "10px"}} variant="outlined">{card(props.company, props.title, props.salary, props.environment)}</Card>
  );
}

export default PositionCard;