from feature_extraction import extract_features

test_passwords = [
    "123456",
    "password",
    "Hello123",
    "Tr0ub4dor&3",
    "aaaaaaaaa",
    "qwerty123",
    "xK#9mP!2vL",
]

print("=" * 70)

for pwd in test_passwords:
    f = extract_features(pwd)
    print(f"Password : {pwd}")
    print(f"  Length           : {f['length']}")
    print(f"  Uppercase        : {f['uppercase_count']}")
    print(f"  Lowercase        : {f['lowercase_count']}")
    print(f"  Digits           : {f['digit_count']}")
    print(f"  Special chars    : {f['special_char_count']}")
    print(f"  Shannon Entropy  : {f['shannon_entropy']}")
    print(f"  Common Pattern   : {f['has_common_pattern']}")
    print(f"  Dictionary Word  : {f['has_dictionary_word']}")
    print(f"  Consecutive Chars: {f['consecutive_chars']}")
    print(f"  Diversity Ratio  : {f['char_diversity_ratio']}")
    print(f"  Keyboard Pattern : {f['keyboard_pattern']}")
    print("-" * 70)