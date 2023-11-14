function Options({ question, dispatch, answer }) {
    return (
        <div className="options">
            {question.options.map((option, i) => (
                <button
                    className={`btn btn-option ${
                        answer === i ? "answer" : ""
                    } ${
                        answer !== null
                            ? question.correctOption === i
                                ? "correct"
                                : "wrong"
                            : ""
                    }`}
                    onClick={() => dispatch({ type: "newAnswer", payload: i })}
                    disabled={answer !== null}
                    key={i}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default Options;
