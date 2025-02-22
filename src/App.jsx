import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [weight, setWeight] = useState(localStorage.getItem("weight") || "");
  const [height, setHeight] = useState(localStorage.getItem("height") || "");
  const [message, setMessage] = useState(localStorage.getItem("message") || "");
  const [bmi, setBmi] = useState(localStorage.getItem("bmi") || null);

  useEffect(() => {
    localStorage.setItem("weight", weight);
    localStorage.setItem("height", height);
    localStorage.setItem("bmi", bmi);
    localStorage.setItem("message", message);
  }, [weight, height, bmi, message]);

  const calcbmi = async (e) => {
    e.preventDefault();

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightCm) || weightKg <= 0 || heightCm <= 0) {
      alert("Please enter valid height and weight values.");
      return;
    }

    try {
      const response = await axios.get(
        "https://body-mass-index-bmi-calculator.p.rapidapi.com/metric",
        {
          params: { weight: weightKg, height: heightCm },
          headers: {
            "x-rapidapi-key": "d421edaddcmsh96676afa09f42d0p198ca2jsn74f480b943fd",
            "x-rapidapi-host": "body-mass-index-bmi-calculator.p.rapidapi.com",
          },
        }
      );

      const calculatedBmi = response.data.bmi.toFixed(1);
      setBmi(calculatedBmi);
      localStorage.setItem("bmi", calculatedBmi);

      const response1 = await axios.get(
        "https://body-mass-index-bmi-calculator.p.rapidapi.com/weight-category",
        {
          params: { bmi: calculatedBmi },
          headers: {
            "x-rapidapi-key": "d421edaddcmsh96676afa09f42d0p198ca2jsn74f480b943fd",
            "x-rapidapi-host": "body-mass-index-bmi-calculator.p.rapidapi.com",
          },
        }
      );

      setMessage(response1.data.weightCategory);
      localStorage.setItem("message", response1.data.weightCategory);
    } catch (error) {
      alert("Could not fetch BMI. Please try again.");
      console.error(error);
    }
  };

  const reload = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          BMI Calculator
        </h2>
        <form onSubmit={calcbmi} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Height (in)</label>
            <input
              type="number"
              placeholder="Enter your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Weight (kg)</label>
            <input
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
              type="submit"
            >
              Calculate BMI
            </button>
          </div>
          <button
            className="mt-2 text-gray-500 text-sm hover:text-gray-700 transition"
            type="button"
            onClick={reload}
          >
            Reset Data
          </button>
        </form>
        {bmi && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Your BMI is: <span className="text-blue-500">{bmi}</span>
            </h3>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
