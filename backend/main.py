# ─────────────────────────────────────────────
# main.py
# FastAPI Backend for Password Strength Predictor
# Serves predictions to the React frontend
# ─────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import json
import sys
import os

# ── Add ml/ folder to path so we can import feature_extraction
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml'))
from feature_extraction import extract_features

# ─────────────────────────────────────────────
# STEP 1 — CREATE FASTAPI APP
# ─────────────────────────────────────────────

app = FastAPI(
    title="Password Strength Predictor API",
    description="Predicts password strength using ML",
    version="1.0.0"
)

# ── Allow React frontend to talk to this backend
# CORS = Cross Origin Resource Sharing
# Without this, browser will block API calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  # Vite React default port
                   "http://localhost:3000"],  # CRA React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# STEP 2 — LOAD MODEL + METADATA ON STARTUP
# ─────────────────────────────────────────────

# Paths to saved model files
ML_DIR      = os.path.join(os.path.dirname(__file__), '..', 'ml')
MODELS_DIR  = os.path.join(ML_DIR, 'models')

# Load metadata (which model won, does it need scaling, etc.)
with open(os.path.join(MODELS_DIR, 'metadata.json'), 'r') as f:
    metadata = json.load(f)

# Load the best trained model
with open(os.path.join(MODELS_DIR, 'best_model.pkl'), 'rb') as f:
    model = pickle.load(f)

# Load the scaler
with open(os.path.join(MODELS_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

# Load all model results for comparison endpoint
import pandas as pd
results_df = pd.read_csv(os.path.join(MODELS_DIR, 'model_results.csv'))

print(f"✅ Loaded model: {metadata['best_model_name']}")
print(f"   Accuracy: {metadata['best_accuracy'] * 100:.2f}%")
print(f"   Needs scaling: {metadata['needs_scaling']}")


# ─────────────────────────────────────────────
# STEP 3 — DEFINE REQUEST/RESPONSE SHAPES
# Pydantic models validate incoming data
# ─────────────────────────────────────────────

class PasswordRequest(BaseModel):
    password: str

class FeatureResponse(BaseModel):
    length: int
    uppercase_count: int
    lowercase_count: int
    digit_count: int
    special_char_count: int
    shannon_entropy: float
    has_common_pattern: int
    has_dictionary_word: int
    consecutive_chars: int
    char_diversity_ratio: float
    keyboard_pattern: int


# ─────────────────────────────────────────────
# STEP 4 — SUGGESTION ENGINE
# Gives actionable advice based on weak features
# ─────────────────────────────────────────────

def generate_suggestions(features: dict, label: str) -> list:
    """
    Returns a list of specific improvement suggestions
    based on which features are weak.
    """
    suggestions = []

    if label == "Strong":
        return ["Your password is strong! Great job."]

    # Length check
    if features["length"] < 8:
        suggestions.append("Make your password at least 8 characters long")
    elif features["length"] < 12:
        suggestions.append("Consider making it 12+ characters for better security")

    # Uppercase check
    if features["uppercase_count"] == 0:
        suggestions.append("Add at least one uppercase letter (A-Z)")

    # Lowercase check
    if features["lowercase_count"] == 0:
        suggestions.append("Add at least one lowercase letter (a-z)")

    # Digit check
    if features["digit_count"] == 0:
        suggestions.append("Add at least one number (0-9)")

    # Special character check
    if features["special_char_count"] == 0:
        suggestions.append("Add a special character like ! @ # $ % ^ & *")

    # Entropy check
    if features["shannon_entropy"] < 2.0:
        suggestions.append("Use more varied characters to increase randomness")
    elif features["shannon_entropy"] < 3.0:
        suggestions.append("Mix more character types to improve unpredictability")

    # Common pattern check
    if features["has_common_pattern"] == 1:
        suggestions.append("Avoid common patterns like '123', 'qwerty', 'password'")

    # Dictionary word check
    if features["has_dictionary_word"] == 1:
        suggestions.append("Avoid using common dictionary words")

    # Consecutive characters check
    if features["consecutive_chars"] >= 3:
        suggestions.append(f"Avoid repeating the same character multiple times (e.g. 'aaa')")

    # Diversity check
    if features["char_diversity_ratio"] < 0.5:
        suggestions.append("Use more unique characters — avoid repetition")

    # Keyboard pattern check
    if features["keyboard_pattern"] == 1:
        suggestions.append("Avoid keyboard patterns like 'qwer', 'asdf', '1234'")

    return suggestions if suggestions else ["Almost there! Try adding more variety"]


# ─────────────────────────────────────────────
# STEP 5 — API ENDPOINTS
# ─────────────────────────────────────────────

# ── Root endpoint — just to test if API is alive
@app.get("/")
def root():
    return {
        "message": "Password Strength Predictor API is running",
        "model": metadata["best_model_name"],
        "accuracy": metadata["best_accuracy"]
    }


# ── MAIN ENDPOINT — predict password strength
@app.post("/predict")
def predict(request: PasswordRequest):
    """
    Takes a password string.
    Returns: strength label, confidence, features, suggestions.
    
    Called by React frontend on every keystroke (debounced).
    """
    password = request.password

    # Handle empty password
    if not password:
        return {
            "label": "None",
            "label_index": -1,
            "confidence": 0,
            "features": {},
            "suggestions": ["Start typing a password..."],
            "color": "gray"
        }

    # Extract features
    features = extract_features(password)

    # Prepare feature vector in correct order
    feature_vector = [[features[f] for f in metadata["features"]]]

    # Scale if needed
    if metadata["needs_scaling"]:
        feature_vector = scaler.transform(feature_vector)

    # Get prediction
    prediction = model.predict(feature_vector)[0]

    # Get confidence (probability of predicted class)
    probabilities = model.predict_proba(feature_vector)[0]
    confidence = round(float(probabilities[prediction]) * 100, 1)

    # Map label index to name and color
    label_map = {
        0: {"name": "Weak",   "color": "#e74c3c"},
        1: {"name": "Medium", "color": "#f39c12"},
        2: {"name": "Strong", "color": "#2ecc71"}
    }

    label_info = label_map[prediction]

    # Generate suggestions
    suggestions = generate_suggestions(features, label_info["name"])

    return {
        "label":       label_info["name"],
        "label_index": int(prediction),
        "confidence":  confidence,
        "color":       label_info["color"],
        "features":    features,
        "suggestions": suggestions,
        "all_probs": {
            "Weak":   round(float(probabilities[0]) * 100, 1),
            "Medium": round(float(probabilities[1]) * 100, 1),
            "Strong": round(float(probabilities[2]) * 100, 1)
        }
    }


# ── FEATURES endpoint — just extract features, no prediction
@app.post("/features")
def get_features(request: PasswordRequest):
    """Returns only the extracted features for a password"""
    features = extract_features(request.password)
    return features


# ── MODELS endpoint — return all model accuracy scores
@app.get("/models")
def get_models():
    """Returns accuracy scores of all trained models"""
    return {
        "best_model": metadata["best_model_name"],
        "best_accuracy": metadata["best_accuracy"],
        "all_models": metadata["all_results"]
    }


# ── HEALTH endpoint — for checking if API is alive
@app.get("/health")
def health():
    return {"status": "ok"}