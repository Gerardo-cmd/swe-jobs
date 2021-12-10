import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const card = (company: String, title: String, salary: String, environment: String, status: String, statusColor: String) => {
  
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
          <Typography style={{color: `${statusColor}`}} variant="body2">
            {status}
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
    status: String;
}

const PositionCard = (props: CardProps) => {
  let statusColor: String = "blue";
  switch (props.status.toLowerCase()) {
    case "interviewing":
      statusColor = "orange";
      break;
    case "denied":
      statusColor = "red";
      break;
    case "offered":
      statusColor = "green";
      break;
    case "applied":
      statusColor = "blue";
      break;
    default:
      statusColor = "blue";
  }

  return (
      <Card style={{height:"225px", margin: "10px", boxShadow: `0 0 10px 2px ${statusColor} inset`}} variant="outlined">{card(props.company, props.title, props.salary, props.environment, props.status, statusColor)}</Card>
  );
}

export default PositionCard;