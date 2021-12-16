import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

interface Tally {
  applied: number;
  interviewing: number;
  denied: number;
  offered: number;
}

interface DataProp {
    jobs: PositionObject[];
}

interface PositionObject  {
  title: string;
  company: string;
  salary: string;
  workEnvironment: string;
  status: string;
}

const COLORS = ['#1e36e8', '#ffcc00', '#d45355', '#009933'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="end">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Graph extends PureComponent<DataProp> {

  calculateTally: (() => Tally) = () => {
    let counts = {
      applied: 0,
      interviewing: 0,
      denied: 0,
      offered: 0
    }
    this.props.jobs.forEach((job) => {
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
    });
    return counts;
  };

  data = [
    { name: 'Applied', value: this.calculateTally().applied },
    { name: 'Interviewing', value: this.calculateTally().interviewing },
    { name: 'Denied', value: this.calculateTally().denied  },
    { name: 'Offered', value: this.calculateTally().offered },
  ];

  render() {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={800} height={800}>
          <Pie
            data={this.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
          >
            {this.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default Graph;