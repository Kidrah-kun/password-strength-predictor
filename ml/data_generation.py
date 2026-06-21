# ─────────────────────────────────────────────
# data_generation.py
# Generates a labelled dataset of passwords
# Weak=0, Medium=1, Strong=2
# Output: passwords_dataset.csv
# ─────────────────────────────────────────────

import random
import string
import pandas as pd
from feature_extraction import extract_features

# ── SEED for reproducibility ──────────────────
# This makes sure you get the same dataset every
# time you run this script
random.seed(42)


# ─────────────────────────────────────────────
# WEAK PASSWORD GENERATORS
# These mimic how real humans make bad passwords
# ─────────────────────────────────────────────

COMMON_WEAK = [
    "123456", "password", "123456789", "12345678",
    "12345", "1234567", "1234567890", "qwerty",
    "abc123", "111111", "123123", "admin",
    "letmein", "welcome", "monkey", "dragon",
    "master", "login", "pass", "iloveyou",
    "sunshine", "princess", "football", "shadow",
    "superman", "michael", "jessica", "password1",
    "batman", "trustno1"
]

def generate_weak():
    """Returns a weak password using one of 4 strategies"""
    strategy = random.randint(1, 4)

    if strategy == 1:
        # Strategy 1: Pick from known weak passwords
        return random.choice(COMMON_WEAK)

    elif strategy == 2:
        # Strategy 2: All same character (e.g. 'aaaaaaa')
        char = random.choice(string.ascii_lowercase)
        length = random.randint(4, 8)
        return char * length

    elif strategy == 3:
        # Strategy 3: Just digits, short
        length = random.randint(4, 7)
        return ''.join(random.choices(string.digits, k=length))

    else:
        # Strategy 4: Only lowercase, very short
        length = random.randint(4, 7)
        return ''.join(random.choices(string.ascii_lowercase, k=length))


# ─────────────────────────────────────────────
# MEDIUM PASSWORD GENERATORS
# Mix of char types but missing something
# ─────────────────────────────────────────────

def generate_medium():
    """Returns a medium strength password"""
    strategy = random.randint(1, 3)

    if strategy == 1:
        # Strategy 1: lowercase + digits, decent length
        length = random.randint(8, 11)
        chars = string.ascii_lowercase + string.digits
        return ''.join(random.choices(chars, k=length))

    elif strategy == 2:
        # Strategy 2: upper + lower, no digits or special
        length = random.randint(8, 12)
        chars = string.ascii_letters
        return ''.join(random.choices(chars, k=length))

    else:
        # Strategy 3: lowercase + one special char
        length = random.randint(8, 10)
        base = ''.join(random.choices(string.ascii_lowercase, k=length - 1))
        special = random.choice("!@#$%")
        # Insert special at random position
        pos = random.randint(0, len(base))
        return base[:pos] + special + base[pos:]


# ─────────────────────────────────────────────
# STRONG PASSWORD GENERATORS
# Long, mixed, unpredictable
# ─────────────────────────────────────────────

def generate_strong():
    """Returns a strong password"""
    strategy = random.randint(1, 3)

    if strategy == 1:
        # Strategy 1: Full random mix, 12-16 chars
        length = random.randint(12, 16)
        chars = string.ascii_letters + string.digits + "!@#$%^&*"
        password = []
        # Guarantee at least one of each type
        password.append(random.choice(string.ascii_uppercase))
        password.append(random.choice(string.ascii_lowercase))
        password.append(random.choice(string.digits))
        password.append(random.choice("!@#$%^&*"))
        # Fill the rest randomly
        for _ in range(length - 4):
            password.append(random.choice(chars))
        random.shuffle(password)
        return ''.join(password)

    elif strategy == 2:
        # Strategy 2: Passphrase-style but with substitutions
        # e.g. "correct-horse-Battery-9!"
        words = ["horse", "battery", "staple", "correct",
                 "apple", "river", "cloud", "storm",
                 "tiger", "ocean", "flame", "pixel"]
        w1 = random.choice(words).capitalize()
        w2 = random.choice(words)
        num = str(random.randint(10, 99))
        special = random.choice("!@#$%")
        return f"{w1}-{w2}{num}{special}"

    else:
        # Strategy 3: Long random alphanumeric + specials, 14-20 chars
        length = random.randint(14, 20)
        chars = string.ascii_letters + string.digits + "!@#$%^&*()"
        password = []
        password.append(random.choice(string.ascii_uppercase))
        password.append(random.choice(string.ascii_lowercase))
        password.append(random.choice(string.digits))
        password.append(random.choice("!@#$%^&*()"))
        for _ in range(length - 4):
            password.append(random.choice(chars))
        random.shuffle(password)
        return ''.join(password)


# ─────────────────────────────────────────────
# MAIN — BUILD THE DATASET
# ─────────────────────────────────────────────

def generate_dataset(samples_per_class=1000):
    """
    Generates samples_per_class passwords for each
    of the 3 classes: Weak(0), Medium(1), Strong(2)
    Total = samples_per_class * 3 rows
    """
    data = []

    print(f"Generating {samples_per_class} WEAK passwords...")
    for _ in range(samples_per_class):
        pwd = generate_weak()
        features = extract_features(pwd)
        features["password"] = pwd
        features["label"] = 0          # 0 = Weak
        features["label_name"] = "Weak"
        data.append(features)

    print(f"Generating {samples_per_class} MEDIUM passwords...")
    for _ in range(samples_per_class):
        pwd = generate_medium()
        features = extract_features(pwd)
        features["password"] = pwd
        features["label"] = 1          # 1 = Medium
        features["label_name"] = "Medium"
        data.append(features)

    print(f"Generating {samples_per_class} STRONG passwords...")
    for _ in range(samples_per_class):
        pwd = generate_strong()
        features = extract_features(pwd)
        features["password"] = pwd
        features["label"] = 2          # 2 = Strong
        features["label_name"] = "Strong"
        data.append(features)

    # Convert list of dicts → pandas DataFrame
    df = pd.DataFrame(data)

    # Shuffle the rows so Weak/Medium/Strong are mixed
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    return df


# ─────────────────────────────────────────────
# RUN IT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    df = generate_dataset(samples_per_class=1000)

    # Save to CSV
    df.to_csv("passwords_dataset.csv", index=False)

    print("\n✅ Dataset saved to passwords_dataset.csv")
    print(f"Total rows     : {len(df)}")
    print(f"Total columns  : {len(df.columns)}")
    print(f"\nLabel distribution:")
    print(df["label_name"].value_counts())
    print(f"\nFirst 5 rows preview:")
    print(df[["password", "label_name", "shannon_entropy",
              "length", "special_char_count"]].head())