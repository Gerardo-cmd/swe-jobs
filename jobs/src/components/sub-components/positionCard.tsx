import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const card = (company: String, title: String, salary: String, environment: String, status: String, statusColor: String, navigate: NavigateFunction) => {
    return (
      <React.Fragment>
        <Link
          style={{ display: "block", margin: "1rem 0", textDecoration: "none", color: "black"}}
          to={`/${company.replace(/ /g, "_")}-${title.replace(/ /g, "_")}`}
          key={`${company.replace(/ /g, "_")}-${title.replace(/ /g, "_")}`}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {company}
            </Typography>
            <Typography sx={{ fontSize: 21 }}>
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
        </Link>
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
  const navigate = useNavigate();
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
      <Card style={{height:"230px", margin: "10px", boxShadow: `0 0 10px 2px ${statusColor}`}} variant="outlined">{card(props.company, props.title, props.salary, props.environment, props.status, statusColor, navigate)}</Card>
  );
}

export default PositionCard;