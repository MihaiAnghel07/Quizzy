import React from 'react'
import './ShowHostHistory.css'
import { useNavigate } from 'react-router-dom';
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
        text: 'Score Distribution',
      },
    },
    scales: {
        x: {
            title: {
              display: true,
              text: 'Score', // Replace with your desired vertical axis name
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
            text: 'Number of Participants', // Replace with your desired vertical axis name
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

class ShowHostHistory extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
            averageScore: 0,
            numberOfQuestions: 0,
            graphData: null
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let records = [];
        let scoreSum = 0;
        let numberOfQuestions = 0;
        let numberOfScores = [];


        Object.keys(this.props.data).map((key) => {
            if (key !== 'timestamp' && key !== 'quizTitle' && key !== 'feedbacks' && key !== 'ratings') {
                //salvez doar datele ce tin de participanti
                records.push({key: key, data: this.props.data[key]})
                
                // aflu media punctajelor
                let questions = Object.values(this.props.data[key].questions);
                numberOfQuestions = questions.length;
                numberOfScores = Array.apply(null, Array(numberOfQuestions)).map(Number.prototype.valueOf, 0);
                let participantScore = 0;

                for (const element of questions) {
                    if ((element.answer1.isSelected && element.answer1.isCorrect)
                        || (element.answer2.isSelected && element.answer2.isCorrect)
                        || (element.answer3.isSelected && element.answer3.isCorrect)
                        || (element.answer4.isSelected && element.answer4.isCorrect)) {
                            participantScore++;
                        }
                }
                
                scoreSum += participantScore;
                numberOfScores[participantScore]++;

                // de calculat rating + feedback

            }
        })

        //setez datele pentru grafic
        const labels = Array.from({ length: numberOfQuestions + 1 }, (_, index) => index);
        const graphData = {
            labels,
            datasets: [
              {
                label: 'Number of Participants',
                data: numberOfScores,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
        };
        
        let averageScore = scoreSum / records.length;
        this.setState({records: records, 
                        averageScore: averageScore, 
                        numberOfQuestions: numberOfQuestions, 
                        graphData: graphData});
                        
    }

    render() {
        return (
            <div className='show-host-history-wrapper'>
                
                <div className='show-host-history-summary'>Summary</div>
                {this.state.graphData && 
                <div className='show-host-history-score-graph'>
                    <Bar options={options} data={this.state.graphData} />
                    
                </div>}

                <ul className='show-host-history-summary-list'>
                    <li className='show-host-history-total-participants'>Number of participants: {this.state.records.length}</li>
                    <li className='show-host-history-total-questions'>Number of questions: {this.state.numberOfQuestions}</li> 
                    <li className='show-host-history-average-score'>Average score: {this.state.averageScore}</li> 
                </ul>

                {this.state.records.length === 0 && <div>No data found!</div>}
            
                <button className='show-host-history-statistics-btn' onClick={() => this.props.showStatisticsHandler()}>Statistics per question</button>
                <button className='show-host-history-statistics-btn' onClick={() => this.props.viewFeedbacksHandler()}>View feedbacks</button>

                <div className='show-host-history-participants'>Participants list (for details, click on participant name):
                    {this.state.records.length !== 0 &&
                        this.state.records.map((participant, index) => {
                            
                            return (
                                <div key={participant.key} className='show-host-history-wrapper'>
                                    <div>
                                        <div className='show-host-history-participant-item' onClick={()=>this.props.participantRaportHandler(participant.key)}>{index + 1}. {participant.key}</div> 
                                    </div>
                                </div>
                            )
                        })
                    }  
                </div>

            </div>
        )
    }
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        let navigate = useNavigate();
        
        const participantRaportHandler = (participant) => {
            navigate('/participant_raport', {state:{participant:participant, quizId:props.quizId}});
        }

        const showStatisticsHandler = () => {
            navigate('/statistics_per_question', {state:{quizId:props.quizId}});
        }

        const viewFeedbacksHandler = () => {
            navigate('/view_feedbacks', {state:{quizId:props.quizId}});
        }
        
        return <Component data={props.data}
                        participantRaportHandler={participantRaportHandler}
                        showStatisticsHandler={showStatisticsHandler}
                        viewFeedbacksHandler={viewFeedbacksHandler}
                        />
    }
}

export default wrapClass(ShowHostHistory); 