# ─────────────────────────────────────────────
# feature_extraction.py
# Takes a password string → returns a dictionary
# of 11 numerical features
# ─────────────────────────────────────────────

import math    # for the entropy calculation
import re      # for pattern matching with regex


# ── LISTS WE'LL CHECK AGAINST ──────────────────

# Common weak patterns people use in passwords
COMMON_PATTERNS = [
    "123", "1234", "12345", "123456",
    "qwerty", "qwer", "asdf", "zxcv",
    "password", "pass", "abc", "abcd",
    "iloveyou", "letmein", "welcome",
    "admin", "login", "monkey", "dragon",
    "111", "000", "999", "696969"
]

# Keyboard row patterns (horizontal runs on keyboard)
KEYBOARD_PATTERNS = [
    "qwer", "wert", "erty", "rtyu", "tyui", "yuio", "uiop",
    "asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl",
    "zxcv", "xcvb", "cvbn", "vbnm",
    "1234", "2345", "3456", "4567", "5678", "6789"
]

# Top 50 common English words found in passwords
DICTIONARY_WORDS = [
    "password", "love", "hate", "life", "time",
    "year", "people", "way", "day", "man",
    "woman", "child", "world", "school", "state",
    "family", "student", "group", "country", "problem",
    "hand", "place", "case", "week", "company",
    "system", "program", "question", "work", "government",
    "number", "night", "point", "home", "water",
    "room", "mother", "area", "money", "story",
    "fact", "month", "lot", "right", "study",
    "book", "eye", "job", "word", "business"
]


# ── THE 11 FEATURE FUNCTIONS ───────────────────

def get_length(password):
    """Simply returns how many characters the password has"""
    return len(password)


def get_uppercase_count(password):
    """Counts how many CAPITAL letters are in the password"""
    count = 0
    for char in password:
        if char.isupper():   # isupper() returns True for A-Z
            count += 1
    return count


def get_lowercase_count(password):
    """Counts how many small letters are in the password"""
    count = 0
    for char in password:
        if char.islower():   # islower() returns True for a-z
            count += 1
    return count


def get_digit_count(password):
    """Counts how many numbers (0-9) are in the password"""
    count = 0
    for char in password:
        if char.isdigit():   # isdigit() returns True for 0-9
            count += 1
    return count


def get_special_char_count(password):
    """
    Counts special characters like ! @ # $ % ^ & *
    We use regex here — [^a-zA-Z0-9] means
    'anything that is NOT a letter or digit'
    """
    special_chars = re.findall(r'[^a-zA-Z0-9]', password)
    return len(special_chars)


def get_shannon_entropy(password):
    """
    Shannon Entropy = measures how random/unpredictable
    the password is.

    High entropy = more random = stronger password

    How it works:
    - Count how often each character appears
    - Calculate the probability of each character
    - Apply the entropy formula

    Example:
    "aaaa" → only 'a' appears → very predictable → entropy = 0
    "aAbB" → 4 different chars → more random → entropy = 2.0
    """
    if len(password) == 0:
        return 0

    # Count frequency of each character
    frequency = {}
    for char in password:
        if char in frequency:
            frequency[char] += 1
        else:
            frequency[char] = 1

    # Calculate entropy
    entropy = 0
    length = len(password)

    for char in frequency:
        # probability of this character appearing
        probability = frequency[char] / length
        # entropy formula: -p * log2(p)
        entropy -= probability * math.log2(probability)

    return round(entropy, 4)   # round to 4 decimal places


def has_common_pattern(password):
    """
    Returns 1 if the password contains any common weak pattern
    Returns 0 if it doesn't

    We convert to lowercase first so 'PASSWORD' also gets caught
    """
    password_lower = password.lower()
    for pattern in COMMON_PATTERNS:
        if pattern in password_lower:
            return 1   # found a common pattern
    return 0           # no common patterns found


def has_dictionary_word(password):
    """
    Returns 1 if the password contains a common English word
    Returns 0 if it doesn't
    """
    password_lower = password.lower()
    for word in DICTIONARY_WORDS:
        if word in password_lower:
            return 1
    return 0


def get_consecutive_chars(password):
    """
    Finds the LONGEST run of the same character repeated.

    'aabbbcc' → longest run is 'bbb' → returns 3
    'aB3!xQ9' → no repeats → returns 1
    'aaaaaaa' → all same → returns 7

    High consecutive chars = weaker password
    """
    if len(password) == 0:
        return 0

    max_run = 1      # at minimum, 1 char exists
    current_run = 1  # current streak counter

    for i in range(1, len(password)):
        if password[i] == password[i - 1]:  # same as previous char?
            current_run += 1
            if current_run > max_run:
                max_run = current_run
        else:
            current_run = 1  # reset streak

    return max_run


def get_char_diversity_ratio(password):
    """
    Ratio of UNIQUE characters to TOTAL characters.

    'aaaa'   → 1 unique / 4 total = 0.25  (low diversity, bad)
    'abcd'   → 4 unique / 4 total = 1.0   (high diversity, good)
    'aabb'   → 2 unique / 4 total = 0.5   (medium)
    """
    if len(password) == 0:
        return 0

    unique_chars = len(set(password))   # set() removes duplicates
    total_chars = len(password)

    return round(unique_chars / total_chars, 4)


def has_keyboard_pattern(password):
    """
    Returns 1 if the password contains keyboard row patterns
    like 'qwer', 'asdf', 'zxcv', '1234'

    Returns 0 if no keyboard patterns found
    """
    password_lower = password.lower()
    for pattern in KEYBOARD_PATTERNS:
        if pattern in password_lower:
            return 1
    return 0


# ── MAIN FUNCTION — THIS IS WHAT YOU CALL ─────

def extract_features(password):
    """
    THE MAIN FUNCTION.
    Pass any password string → get back a dictionary of 11 features.

    Usage:
        features = extract_features("Hello123!")
        print(features)
    """
    features = {
        "length":               get_length(password),
        "uppercase_count":      get_uppercase_count(password),
        "lowercase_count":      get_lowercase_count(password),
        "digit_count":          get_digit_count(password),
        "special_char_count":   get_special_char_count(password),
        "shannon_entropy":      get_shannon_entropy(password),
        "has_common_pattern":   has_common_pattern(password),
        "has_dictionary_word":  has_dictionary_word(password),
        "consecutive_chars":    get_consecutive_chars(password),
        "char_diversity_ratio": get_char_diversity_ratio(password),
        "keyboard_pattern":     has_keyboard_pattern(password),
    }
    return features