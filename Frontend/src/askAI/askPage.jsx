import { motion, AnimatePresence } from "framer-motion";
import AskAI from "../askAI/askAI";
import SearchAnswer from "./searchAnswer";
import LoadingSpinner from "../askAI/LoadingSpinner";
import { useApi } from "../utils/api";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "@clerk/clerk-react"; // to get user ID
import { signIntoFirebase } from "../firebase";
import { useState, useEffect } from "react";


export default function AskPage() {
    const [question, setQuestion] = useState("");
    const [answerData, setAnswerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { makeRequest } = useApi();

    const { userId } = useAuth()

    const saveHistory = async (question, answer, sources) => {
        if (!userId) return;

        try {
            await addDoc(collection(db, "users", userId, "history"), {
                question,
                answer,
                sources,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Failed to save history:", error);
        }
    };


    useEffect(() => {
        const isBlocking = isLoading || !answerData;
        document.body.style.overflow = isBlocking ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isLoading, answerData]);

    const { getToken } = useAuth();

    const generateAnswer = async (inputText) => {
        try {
            setIsLoading(true);

            if (userId) {
                await signIntoFirebase(getToken); // Pass the `getToken` function from Clerk
            }

            const data = await makeRequest("generate-answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: inputText }),
            });

            if (data.status === "INVALID") {
                setAnswerData({
                    question: inputText,
                    explanation: data.message,
                    sources: [],
                });
            } else {
                setAnswerData({
                    question: inputText,
                    answer: data.answer,
                    sources: data.sources,
                });
                await saveHistory(inputText, data.answer, data.sources);
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleReset = () => {
        setAnswerData(null);
        setQuestion("");
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoadingSpinner />
                </motion.div>
            ) : !answerData ? (
                <motion.div
                    key="ask"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <AskAI inputText={question} setInputText={setQuestion} onSubmit={generateAnswer} />
                </motion.div>
            ) : (
                <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <SearchAnswer data={answerData} onReset={handleReset} />
                </motion.div>
            )}
        </AnimatePresence>

    );
}
