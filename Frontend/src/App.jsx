import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [reviewText, setReviewText] = useState("");
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
        language,
      });

      const { reviewText, ratings } = response.data;
      setReviewText(reviewText);
      setRatings(ratings);
    } catch (error) {
      console.error("Error fetching review:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Your Instant AI Code Reviewer</h1>
        <p>
          Boost your code quality with real-time AI-powered feedback and performance insights.
        </p>
      </motion.section>

      <motion.main
        className="main-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="editor-section"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>

          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages[language] || prism.languages.javascript, language)
            }
            padding={12}
            className="code-editor"
          />

          <motion.button
            onClick={reviewCode}
            className="review-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Review Code
          </motion.button>
        </motion.div>

        <motion.div
          className="review-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <motion.div
              className="spinner-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <div className="spinner"></div>
            </motion.div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{reviewText}</Markdown>
          )}
        </motion.div>
      </motion.main>

      {ratings && Object.keys(ratings).length > 0 && (
        <motion.section
          className="ratings-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>📊 Code Ratings</h2>
          <div className="rating-grid">
            {Object.entries(ratings).map(([key, value]) => (
              <motion.div
                className="rating-card"
                key={key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <p>{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default App;
