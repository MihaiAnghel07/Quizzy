import React, { useEffect, useState } from 'react'
import './StatisticsPerQuestion.css'
import { useLocation } from 'react-router-dom';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';
import { projectFirebaseRealtime } from '../../firebase/config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
import BouncingDotsLoader from '../../components/BouncingDotsLoader/BouncingDotsLoader';

  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of correct / wrong answers per question',
      },
    },
    scales: {
        x: {
            title: {
              display: true,
              text: 'Answers', // Replace with your desired vertical axis name
            //   font: {
            //     size: 14,
            //     weight: 'bold',
            //   },
            },
            ticks: {
                precision: 0, // Set the precision to 0 for integer values
            },
            grid: {
                display: false, // Hide the grid lines for the y-axis
            },
          },
        y: {
          title: {
            display: true,
            text: 'Number of Answers', // Replace with your desired vertical axis name
            // font: {
            //   size: 14,
            //   weight: 'bold',
            // },
          },
          ticks: {
            precision: 0, // Set the precision to 0 for integer values
          },         
        },
      },
  };

class StatisticsPerQuestion extends React.Component {

    constructor() {
        super();
        this.state = {
            records: []
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    

    async componentDidMount() {
        let statistics = [];
        let questions = [];
        let statistics2 = [];

        await this.props.delay(800);

        const ref = projectFirebaseRealtime.ref("Statistics/host/" + this.props.username + "/quizzes/" + this.props.quizId);
        await ref.once("value", (snapshot) => {
            if (snapshot.exists()) {
                statistics = snapshot.val();
            }
        })

        let iteration = 0
        const ref2 = projectFirebaseRealtime.ref("History/host/" + this.props.username + "/quizzes/" + this.props.quizId);
        await ref2.once("value", (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if (iteration === 0 && childSnapshot.key !== "feedbacks" && childSnapshot.key !== "quizTitle" && childSnapshot.key !== "ratings" && childSnapshot.key !== "timestamp") {
                        iteration = 1;
                        questions = childSnapshot.val().questions;
                    }
                })
            }
        })

        Object.keys(statistics).map((key) => {
            statistics[key] = {text: questions[key].question, correctAnswers:statistics[key].correctAnswers, wrongAnswers:statistics[key].wrongAnswers}
            statistics2.push(statistics[key]);
        })
        this.setState({records: statistics2});
    }

    render() {
        return (
            <div className='statistics-per-question-wrapper'>

                <div className='statistics-per-question-navigation-component'>
                    <NavigationComponent
                        pageTitle="Statistics Per Question"
                        pairs={[['History', '/history'],
                                ['Statistics Per Question', '/statistics_per_question']
                        ]}
                    />
                </div>
                
                <div className='statistics-per-question-body'>
                    
                    {this.state.records.length == 0 && <div>
                        <h4 className='statistics-per-question-loading'>Loading 
                        <span id="statistics-per-question-bouncing-dots-loader"><BouncingDotsLoader/></span></h4>
                    </div>}

                    {this.state.records.map((record, key) => {
                    
                        // declaram graficul
                        const labels = [''];
                        const graphData = {
                            labels,
                            datasets: [
                                {
                                    label: 'Correct Answers',
                                    data: [record.correctAnswers],
                                    backgroundColor: 'rgba(53, 254, 149, 0.5)',
                                    categoryPercentage: 0.5,
                                },

                                {
                                    label: 'Wrong Answers',
                                    data: [record.wrongAnswers],
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    categoryPercentage: 0.5,
                                },
                            ],
                        };

                        return (
                            <div className='statistics-per-question-item' key={key}>
                                {key}. {record.text}

                                {graphData && 
                                    <div className='show-host-history-score-graph'>
                                        <Bar options={options} data={graphData} />
                                        
                                    </div>
                                }
                                    
                            </div>
                        )

                    })}

                </div>
                
            </div>
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const [username, setUsername] = useState(null);
        let location = useLocation();

        
        useEffect(() => {
            if (localStorage.getItem("username") != null)
                setUsername(localStorage.getItem("username"));

        }, [localStorage.getItem("username")])

        const delay = ms => new Promise (
            resolve => setTimeout(resolve, ms)
        );

        return <Component quizId={location.state.quizId} username={username} delay={delay}/>
    }
}

export default wrapClass(StatisticsPerQuestion);