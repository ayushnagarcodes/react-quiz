import { useReducer, useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import NextButton from "./components/NextButton";

const SECONDS_PER_QUESTION = 30;

const initialState = {
    questions: [],
    status: "loading", // loading, error, ready, active, finished
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return { ...state, questions: action.payload, status: "ready" };
        case "dataFailed":
            return { ...state, status: "error" };
        case "start":
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
            };
        case "newAnswer":
            const question = state.questions[state.index];
            return {
                ...state,
                answer: action.payload,
                points:
                    action.payload === question.correctOption
                        ? state.points + question.points
                        : state.points,
            };
        case "nextQuestion":
            return { ...state, index: state.index + 1, answer: null };
        case "finish":
            return {
                ...state,
                status: "finished",
                answer: null,
            };
        case "restart":
            return {
                ...initialState,
                questions: state.questions,
                status: "ready",
                highScore: state.highScore,
            };
        case "updateTimer":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status:
                    state.secondsRemaining === 0 ? "finished" : state.status,
                highScore:
                    state.points > state.highScore
                        ? state.points
                        : state.highScore,
            };
        default:
            throw new Error("Unknown Action!");
    }
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
    } = state;

    const numQuestions = questions.length;
    const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);

    useEffect(function () {
        /* 
            For json-server package:
            - fetch at this URL: http://localhost:8000/questions
            - and set the payload to just 'data'
        */

        // The below URL and payload is for Netlify deployment
        fetch("/.netlify/functions/getData")
            .then((res) => res.json())
            .then((data) =>
                dispatch({ type: "dataReceived", payload: data.questions })
            )
            .catch((err) => dispatch({ type: "dataFailed" }));
    }, []);

    return (
        <div className="app">
            <Header />

            <Main>
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && (
                    <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                )}
                {status === "active" && (
                    <>
                        <Progress
                            index={index}
                            numQuestions={numQuestions}
                            points={points}
                            maxPoints={maxPoints}
                            answer={answer}
                        />

                        <Question
                            question={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />

                        <Footer>
                            <Timer
                                dispatch={dispatch}
                                secondsRemaining={secondsRemaining}
                            />
                            {answer !== null && (
                                <NextButton
                                    dispatch={dispatch}
                                    finished={index + 1 === numQuestions}
                                />
                            )}
                        </Footer>
                    </>
                )}
                {status === "finished" && (
                    <FinishScreen
                        points={points}
                        maxPoints={maxPoints}
                        highscore={highScore}
                        dispatch={dispatch}
                    />
                )}
            </Main>
        </div>
    );
}
