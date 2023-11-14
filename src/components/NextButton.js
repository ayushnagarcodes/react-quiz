function NextButton({ dispatch, finished }) {
    return (
        <button
            className="btn btn-ui"
            onClick={() =>
                finished
                    ? dispatch({ type: "finish" })
                    : dispatch({ type: "nextQuestion" })
            }
        >
            {finished ? "Finish" : "Next"}
        </button>
    );
}

export default NextButton;
