import React from "react"
import logo from "./logo.svg"
import "./App.css"
import Chatbot from "./components/Chatbot"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzNJYKiXdpcm4l5305ucLqR-orScV0RSQ",
  authDomain: "childbot-learner.firebaseapp.com",
  projectId: "childbot-learner",
  storageBucket: "childbot-learner.appspot.com",
  messagingSenderId: "154897393195",
  appId: "1:154897393195:web:0d9f624e6242880a4cec6e",
  measurementId: "G-NMYTY4XDPK",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

function App() {
  return (
    <div className="App">
      <Chatbot />
    </div>
  )
}

export default App
