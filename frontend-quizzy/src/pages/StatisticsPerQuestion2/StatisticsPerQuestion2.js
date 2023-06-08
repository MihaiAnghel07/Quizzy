import React, { useEffect, useState } from 'react'
import './StatisticsPerQuestion2.css'
import { useLocation } from 'react-router-dom';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';
import { projectFirebaseRealtime, projectFirebaseStorage } from '../../firebase/config';
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
import { RxCheck, RxCross2 } from 'react-icons/rx';

  
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

class StatisticsPerQuestion2 extends React.Component {

    constructor() {
        super();
        this.state = {
            mapQuestions: new Map(),
            questions: []
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    

    async componentDidMount() {
        let statistics = [];
        let questions = [];
        let questions2 = [];
        let statistics2 = [];
        let participants =[];
        let username;
        const mapQuestions = new Map();
        

        await this.props.delay(800);

        const ref = projectFirebaseRealtime.ref("History/host/" + this.props.username + "/quizzes/" + this.props.quizId);
        await ref.once("value", (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== "feedbacks" && childSnapshot.key !== "quizTitle" && childSnapshot.key !== "ratings" && childSnapshot.key !== "timestamp") {
                        // select only the participants
                        participants.push(childSnapshot.val());
                        username = childSnapshot.key;
                        questions = childSnapshot.val().questions;
                    }
                })
                
            }
        })


        const fetchImage = async (key, question) => {
            if (question.hasImage) {
              const imageRef = projectFirebaseStorage.ref("History/host/" + this.props.username + "/quizzes/" + this.props.quizId + "/" + username + "/questions/" + key + "/" + question.image);
              const url = await imageRef.getDownloadURL();
              return {
                key: parseInt(key),
                question: {
                  text: question.question,
                  answer1: question.answer1,
                  answer2: question.answer2,
                  answer3: question.answer3,
                  answer4: question.answer4,
                  hasImage: true,
                  url: url
                }
              };
            } else {
              return {
                key: parseInt(key),
                question: {
                  text: question.question,
                  answer1: question.answer1,
                  answer2: question.answer2,
                  answer3: question.answer3,
                  answer4: question.answer4,
                  hasImage: false
                }
              };
            }
          };
          
          const fetchQuestions = Object.keys(questions).map(async (key) => {

            const mapAnswers = new Map();
            mapAnswers.set(questions[key].answer1.text, 0);
            mapAnswers.set(questions[key].answer2.text, 0);
            mapAnswers.set(questions[key].answer3.text, 0);
            mapAnswers.set(questions[key].answer4.text, 0);
            mapQuestions.set(key, mapAnswers);
        
            // console.log(mapQuestions)
            return fetchImage(key, questions[key]);
          });
          
          Promise.all(fetchQuestions)
            .then((resolvedQuestions) => {
              questions2 = resolvedQuestions.sort((a, b) => a.key - b.key);
            
              // compute the statistics
                participants.map((questions) => {

                    Object.keys(questions).map(async (key) => {
                        Object.keys(questions[key]).map(async (key2) => {

                            if (questions[key][key2].answer1.isSelected) {
                                const auxMap = mapQuestions.get(key2)
                                auxMap.set(questions[key][key2].answer1.text, auxMap.get(questions[key][key2].answer1.text) + 1);
                                mapQuestions.set(key2, auxMap);

                            } else if (questions[key][key2].answer2.isSelected) {
                                const auxMap = mapQuestions.get(key2)
                                auxMap.set(questions[key][key2].answer2.text, auxMap.get(questions[key][key2].answer2.text) + 1);
                                mapQuestions.set(key2, auxMap);

                            } else if (questions[key][key2].answer3.isSelected) {
                                const auxMap = mapQuestions.get(key2)
                                auxMap.set(questions[key][key2].answer3.text, auxMap.get(questions[key][key2].answer3.text) + 1);
                                mapQuestions.set(key2, auxMap);
              
                            } else if (questions[key][key2].answer4.isSelected) {
                                const auxMap = mapQuestions.get(key2)
                                auxMap.set(questions[key][key2].answer4.text, auxMap.get(questions[key][key2].answer4.text) + 1);
                                mapQuestions.set(key2, auxMap);
                                
                            }
                        })
                    })
                })

                console.log(questions2)
                this.setState({mapQuestions: mapQuestions, questions: questions2});      
        })
        
    }

    render() {
        return (
            <div className='statistics-per-question2-wrapper'>

                <div className='statistics-per-question2-navigation-component'>
                    <NavigationComponent
                        pageTitle="Statistics Per Question"
                        pairs={[['History', '/history'],
                                ['Statistics Per Question', '/statistics_per_question']
                        ]}
                    />
                </div>
                
                <div className='statistics-per-question2-body'>
                    
                    {this.state.questions.length == 0 && <div>
                        <h4 className='statistics-per-question2-loading'>Loading 
                        <span id="statistics-per-question2-bouncing-dots-loader"><BouncingDotsLoader/></span></h4>
                    </div>}

                    {this.state.mapQuestions.size !== 0 && this.state.questions.map((record, key) => {
                        const mapAns = this.state.mapQuestions.get(record.key.toString());
               
                        // declaram graficul
                        const labels = ['Ans1', 'Ans2', 'Ans3', 'Ans4'];
                        let backgroundColor;
                        if (record.question.answer1.isCorrect) {
                            backgroundColor = ['rgba(53, 254, 149, 0.5)', 'rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5'];
                        
                        } else if (record.question.answer2.isCorrect) {
                            backgroundColor = ['rgba(255, 99, 132, 0.5', 'rgba(53, 254, 149, 0.5)', 'rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5'];

                        } else if (record.question.answer3.isCorrect) {
                            backgroundColor = ['rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5', 'rgba(53, 254, 149, 0.5)', 'rgba(255, 99, 132, 0.5'];

                        } else if (record.question.answer4.isCorrect) {
                            backgroundColor = ['rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5', 'rgba(255, 99, 132, 0.5', 'rgba(53, 254, 149, 0.5)'];

                        }

                        let graphData = {
                            labels,
                            datasets: [
                                {
                                    label: 'Answers',
                                    data: [mapAns.get(record.question.answer1.text), mapAns.get(record.question.answer2.text), mapAns.get(record.question.answer3.text), mapAns.get(record.question.answer4.text)],
                                    backgroundColor: backgroundColor,
                                    categoryPercentage: 0.5,
                                },
                            ],
                        };

                        

                        return (
                            <div className='statistics-per-question2-item' key={key}>
                                {key + 1}. {record.question.text}
                                <ul className='statistics-per-question2-answers-list'>
                                    <li className={record.question.answer1.isCorrect && 'correct-answer'}>Ans1: {record.question.answer1.text}{(record.question.answer1.isCorrect && <RxCheck style={{color:'green'}}/>)}</li>
                                    <li className={record.question.answer2isCorrect && 'correct-answer'}>Ans2: {record.question.answer2.text}{(record.question.answer2.isCorrect && <RxCheck style={{color:'green'}}/>)}</li>
                                    <li className={record.question.answer3.isCorrect && 'correct-answer'}>Ans3: {record.question.answer3.text}{(record.question.answer3.isCorrect && <RxCheck style={{color:'green'}}/>)}</li>
                                    <li className={record.question.answer4.isCorrect && 'correct-answer'}>Ans4: {record.question.answer4.text}{(record.question.answer4.isCorrect && <RxCheck style={{color:'green'}}/>)}</li>
                                    {record.question.hasImage &&
                                    <img src={record.question.url} width='30%' height='10%' alt='question'/>}
                                </ul>

                                {graphData && 
                                    <div className='show-host-history-score-graph2'>
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

export default wrapClass(StatisticsPerQuestion2);