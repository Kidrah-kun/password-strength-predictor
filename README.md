# 🔐 Password Strength Predictor

An AI-powered full-stack web application that evaluates and predicts password strength (Weak, Medium, Strong) using Machine Learning. It processes passwords in real-time to extract **11 numerical and behavioral features**, passes them to a trained machine learning model, and displays a detailed breakdown alongside actionable security suggestions.

---

## 🚀 Key Features

*   **Real-Time Prediction**: Analyze passwords instantaneously as you type (using debounced API requests to optimize performance).
*   **11-Feature Behavioral Extraction**: Goes beyond simple character length to evaluate Shannon entropy, keyboard runs, repetitive sequences, dictionary words, and common pattern lists.
*   **Interactive UI Dashboard**: Features a modern, sleek interface with a glassmorphism design, interactive strength meters, and feature-by-feature metrics.
*   **Actionable Security Feedback**: Provides targeted suggestions on how to improve the password (e.g., "Add an uppercase letter", "Avoid repeating characters").
*   **Model Insights Dashboard**: Compares the accuracy of multiple trained machine learning models directly in the UI.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, Vite, Modern Vanilla CSS.
*   **Backend**: FastAPI, Uvicorn, Pydantic.
*   **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib/Pickle (for serialization).

---

## 📁 Repository Structure

```text
password-strength-predictor/
├── backend/
│   └── main.py              # FastAPI application & suggestion engine
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (StrengthMeter, FeatureBreakdown, etc.)
│   │   ├── App.jsx          # Main application coordinator
│   │   └── main.jsx         # App entry point
│   ├── package.json
│   └── vite.config.js
├── ml/
│   ├── models/
│   │   ├── best_model.pkl   # Serialized Decision Tree model
│   │   ├── scaler.pkl       # Scaler for ML features
│   │   ├── metadata.json    # Metadata describing features and accuracies
│   │   └── model_results.csv # Performance metrics for all trained models
│   └── feature_extraction.py # Feature extraction engine (11 parameters)
└── venv/                    # Python virtual environment
```

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
Make sure you have the following installed:
*   [Python 3.10+](https://www.python.org/downloads/)
*   [Node.js (v18+) & npm](https://nodejs.org/)

---

### 2. Backend Setup
The repository includes a pre-configured Python virtual environment (`venv`) containing the required backend dependencies.

1.  **Open your terminal** and navigate to the project root:
    ```bash
    cd password-strength-predictor
    ```

2.  **Activate the Python Virtual Environment**:
    *   **macOS / Linux**:
        ```bash
        source venv/bin/activate
        ```
    *   **Windows (Command Prompt)**:
        ```cmd
        venv\Scripts\activate.bat
        ```
    *   **Windows (PowerShell)**:
        ```powershell
        venv\Scripts\Activate.ps1
        ```

3.  **Run the FastAPI server**:
    ```bash
    uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
    ```
    *The API will start running at `http://localhost:8000`. You can view the interactive Swagger API documentation at `http://localhost:8000/docs`.*

---

### 3. Frontend Setup

1.  **Open a new terminal window/tab** and navigate to the frontend directory:
    ```bash
    cd password-strength-predictor/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Vite development server**:
    ```bash
    npm run dev
    ```
    *The frontend will start running at `http://localhost:5173`. Open this URL in your web browser to interact with the application.*

---

## 📊 Machine Learning Model Insights

The feature extraction engine calculates 11 distinct metrics for any given password string:

| # | Feature Name | Description |
| :--- | :--- | :--- |
| 1 | `length` | Password length (total number of characters) |
| 2 | `uppercase_count` | Number of uppercase letters (`A-Z`) |
| 3 | `lowercase_count` | Number of lowercase letters (`a-z`) |
| 4 | `digit_count` | Number of numerical digits (`0-9`) |
| 5 | `special_char_count` | Number of special symbols (e.g. `!`, `@`, `#`, `$`, `%`) |
| 6 | `shannon_entropy` | Predictability & randomness measure (Higher entropy = more secure) |
| 7 | `has_common_pattern` | Binary flag (0 or 1) indicating if the password contains common weak patterns (e.g. `123456`, `qwerty`) |
| 8 | `has_dictionary_word` | Binary flag (0 or 1) indicating if the password contains common dictionary words |
| 9 | `consecutive_chars` | Longest repeating character run length (e.g. `aaa` = 3) |
| 10 | `char_diversity_ratio` | Ratio of unique characters to total character length |
| 11 | `keyboard_pattern` | Binary flag (0 or 1) indicating if the password contains linear keyboard sequences (e.g. `asdf`) |

### Model Performance Comparison

Five classifiers were trained and compared. Below is the list of accuracies achieved by each model:

| Rank | Model Classifier | Validation Accuracy | Status |
| :---: | :--- | :---: | :--- |
| **1st** | **Decision Tree** | **99.83%** | **🏆 Best Model (Selected)** |
| 2nd | Random Forest | 99.67% | Alternative |
| 3rd | Gradient Boosting | 99.67% | Alternative |
| 4th | Neural Network (MLP) | 99.67% | Alternative |
| 5th | Logistic Regression | 99.33% | Alternative |

*The Decision Tree model was selected as the default production model due to its high validation accuracy and minimal latency profile during real-time feature prediction.*
