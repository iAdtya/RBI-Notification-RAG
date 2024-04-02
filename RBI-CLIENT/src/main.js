import { useState } from "react";
import axios from "axios";

const Landing = () => {
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = e.target[0].value;
    // console.log(question);
    axios
      .post("http://127.0.0.1:8000/answer", {
        query: question,
      })
      .then((res) => {
        console.log(res.data);
        //   const data = res.data;
        //   const formattedSummary = `
        //   Query: ${data.query}
        //   Relevant Text: ${data.relevant_text}
        //   Source: ${data.source.source}, ${data.source.title}
        //   Answer: ${data.answer}
        // `;
        setSummary(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <div className="flex justify-center mt-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-start-2 flex items-center justify-center">
            <div className="text-center max-w-2xl ">
              <h1 className="text-5xl font-bold text-accent">
                RBI-Notification-RAG!!
              </h1>
              <p className="py-6 text-white">
                RBI notification is a Rag system Trained on more than 12,000 html documents and 40 million tokens
                to perform similarity search and answer query in natural language !!
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex justify-center items-center w-full mt-10"
              >
                <input
                  type="text"
                  placeholder="Enter Question Here..."
                  className="input input-bordered input-warning w-full max-w-md"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button className="btn btn-active btn-primary text-black ml-2">
                  Send
                </button>
              </form>
              <div className="flex flex-col items-center mt-10">
                <div className="card w-80vh bg-primary text-primary-content">
                  <div className="card-body  flex justify-center items-center">
                    <p>
                      <span className="font-bold">Query:</span> {summary.query}
                    </p>
                    <p>
                      <span className="font-bold">Answer: </span>{" "}
                      {summary.answer}
                    </p>
                    <p>
                      <span className="font-bold">Relevant Text: </span>
                      {summary.relevant_text}
                    </p>
                    <p>
                      <span className="font-bold">Source: </span>{" "}
                      {summary.source?.source}
                    </p>
                    <p>
                      <span>
                        <span className="font-bold">Title: </span>{" "}
                      </span>{" "}
                      {summary.source?.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
