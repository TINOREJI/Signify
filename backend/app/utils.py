# backend/app/utils.py
from nltk.corpus import stopwords, wordnet
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from deep_translator import GoogleTranslator

lemmatizer = WordNetLemmatizer()

def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def translate_text(text, source_lang='auto'):
    try:
        # Translate to English
        translated = GoogleTranslator(source=source_lang, target='en').translate(text)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Fallback to original text if translation fails

def process_text(text, source_lang='auto'):
    # Translate text to English first
    translated_text = translate_text(text, source_lang)
    # Process text with NLTK
    words = word_tokenize(translated_text)
    words = [word.lower() for word in words if word.isalnum()]
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word not in stop_words]
    tagged_words = pos_tag(filtered_words)
    lemmatized_words = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in tagged_words]
    return lemmatized_words