import React from 'react'
import './ShowHostHistory.css'
import { useLocation, useNavigate } from 'react-router-dom';
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
            graphData: null,
            averageRating: 0,
            nrRatings: 0
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let records = [];
        let scoreSum = 0;
        let numberOfQuestions = 0;
        let numberOfScores = [];

        //calculez lungimea setului
        //initializez vectorul

        Object.keys(this.props.data).map((key) => {
            if (key !== 'timestamp' && key !== 'quizTitle' && key !== 'feedbacks' && key !== 'ratings') {
                numberOfQuestions = Object.values(this.props.data[key].questions).length;
            }
        })
        numberOfScores = Array.apply(null, Array(numberOfQuestions)).map(Number.prototype.valueOf, 0);

        Object.keys(this.props.data).map((key) => {
            if (key !== 'timestamp' && key !== 'quizTitle' && key !== 'feedbacks' && key !== 'ratings') {
                
                // aflu media punctajelor
                let questions = Object.values(this.props.data[key].questions);
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

                //salvez doar datele ce tin de participanti
                records.push({key: key, data: this.props.data[key], participantScore: participantScore});

            }

            // calculez media rating-urilor
            if (key == "ratings") {
                let ratingSum = 0;
                let nrRatings= Object.keys(this.props.data[key]).map((ratingKey) => {
                    ratingSum += this.props.data[key][ratingKey].rating;
                }).length

                let averageRating = ratingSum / nrRatings;
                this.setState({averageRating:(Math.round(averageRating * 100) / 100), nrRatings:nrRatings});
                
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
                        averageScore: (Math.round(averageScore * 100) / 100), 
                        numberOfQuestions: numberOfQuestions, 
                        graphData: graphData});
                        
    }

    render() {
        return (
            <div className='show-host-history-wrapper'>
                
                <div className='show-host-history-summary'>Summary</div>
                <div className='show-host-history-note'>Note:
                    <ul className='show-host-history-note-list'>
                        <li>Score = The number of correctly answered questions out of the total number of questions</li>
                        <li>Rating = The participants' grade of the quiz experience on a scale of 1 to 5</li>
                    </ul>
                </div>

                {this.state.graphData && 
                    <div className='show-host-history-score-graph'>
                        <Bar options={options} data={this.state.graphData} />
                    </div>
                }

                <ul className='show-host-history-summary-list'>
                    <li className='show-host-history-total-participants'>Number of participants: {this.state.records.length}</li>
                    <li className='show-host-history-total-questions'>Number of questions: {this.state.numberOfQuestions}</li> 
                    <li className='show-host-history-average-score'>Average score: {this.state.averageScore}</li> 
                    <li className='show-host-history-average-score'>Average rating: {this.state.averageRating}  ({this.state.nrRatings} participant(s) gave rating)</li> 
                </ul>

                {this.state.records.length === 0 && <div>No data found!</div>}
            
                <button className='show-host-history-statistics-btn' onClick={() => this.props.showStatisticsHandler()}>Statistics per question</button>
                <button className='show-host-history-statistics-btn' onClick={() => this.props.viewFeedbacksHandler()}>View feedback</button>

                <div className='show-host-history-participants'>Participants list (for details, click on participant name):
                    {this.state.records.length !== 0 &&
                        this.state.records.map((participant, index) => {
                            console.log("AAA:", participant)
                            
                            return (
                                <div key={participant.key} className='show-host-history-wrapper'>
                                    <div>
                                        
                                        <div className='show-host-history-participant-item' 
                                            onClick={()=>this.props.participantRaportHandler(participant.key)}>
                                                <span className='show-host-history-participant-item-index'>{index + 1}. {participant.key}</span> 
                                                <span className='show-host-history-participant-item-score'>Score: {participant.participantScore} / {this.state.numberOfQuestions}</span>
                                        </div>

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
        let location = useLocation();
        
        const participantRaportHandler = (participant) => {
            navigate('/participant_raport', {state:{participant:participant, quizId:props.quizId}});
        }

        const showStatisticsHandler = () => {
            navigate('/statistics_per_question2', {state:{quizId:props.quizId}});
        }

        const viewFeedbacksHandler = () => {
            navigate('/view_feedback', {state:{quizId:props.quizId}});
        }
        
        return <Component data={props.data}
                        participantRaportHandler={participantRaportHandler}
                        showStatisticsHandler={showStatisticsHandler}
                        viewFeedbacksHandler={viewFeedbacksHandler}
                        />
    }
}

export default wrapClass(ShowHostHistory); 