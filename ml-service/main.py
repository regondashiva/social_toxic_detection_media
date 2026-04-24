from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced multilingual toxicity detection
TOXICITY_KEYWORDS = {
    'en': {
        'idiot': 0.8, 'stupid': 0.6, 'hate': 0.9, 'kill': 0.9, 'die': 0.7, 'bad': 0.4,
        'fuck': 0.9, 'shit': 0.7, 'asshole': 0.8, 'bitch': 0.8, 'slut': 0.7,
        'threat': 0.9, 'murder': 0.95, 'rape': 0.95, 'violence': 0.8,
        'racist': 0.9, 'nigger': 0.95, 'terrorist': 0.9, 'spam': 0.6
    },
    'hi': {
        'बेवकूफ': 0.8, 'पागल': 0.7, 'गधा': 0.6, 'झूठा': 0.5, 'कमीना': 0.8,
        'मार दूंगा': 0.9, 'खत्म कर दूंगा': 0.9, 'जान से मारूंगा': 0.95,
        'बेटीचोद': 0.95, 'मादरचोद': 0.95, 'भोसड़ीके': 0.9,
        'जातिवादी': 0.9, 'धर्मवादी': 0.8, 'मुस्लिम': 0.7, 'हिंदू': 0.6,
        'मुफ्त पैसा': 0.7, 'लॉटरी': 0.8, 'क्लिक करें': 0.6
    },
    'te': {
        'తెలియని': 0.6, 'పిచ్చి': 0.7, 'దొంగ': 0.6, 'మూర్ఖుడు': 0.7,
        'చంపేస్తాను': 0.9, 'చావు': 0.8, 'హింస': 0.8, 'హత్య': 0.9,
        'లంజాకోడి': 0.95, 'సిగ్గు': 0.8, 'కులం': 0.9, 'మతం': 0.8,
        'ఉచిత డబ్బు': 0.7, 'లాటరీ': 0.8, 'క్లిక్ చేయండి': 0.6
    },
    'hi-en': {
        'chutiya': 0.9, 'gadha': 0.7, 'bekaar': 0.6, 'kamina': 0.8,
        'maar dunga': 0.9, 'khatam kar dunga': 0.9, 'jaan se marunga': 0.95,
        'bc': 0.9, 'mc': 0.95, 'bhenchod': 0.95, 'madarchod': 0.95,
        'jaatvaadi': 0.9, 'dharmvaadi': 0.8, 'bakchodi': 0.5
    },
    'es': {
        'idiota': 0.8, 'estúpido': 0.7, 'imbécil': 0.6, 'pendejo': 0.8,
        'matar': 0.9, 'mataré': 0.9, 'muerte': 0.8, 'violencia': 0.8,
        'joder': 0.7, 'mierda': 0.7, 'coño': 0.8, 'puta': 0.8,
        'racista': 0.9, 'negro': 0.8, 'musulmán': 0.7, 'terrorista': 0.9
    },
    'fr': {
        'idiot': 0.8, 'stupide': 0.7, 'connard': 0.8, 'enculé': 0.9,
        'tuer': 0.9, 'mort': 0.8, 'violence': 0.8, 'détruire': 0.7,
        'putain': 0.8, 'merde': 0.7, 'baiser': 0.8, 'cul': 0.7,
        'raciste': 0.9, 'noir': 0.8, 'musulman': 0.7, 'terroriste': 0.9
    }
}

class TextInput(BaseModel):
    text: str
    language: str = "auto"

class ToxicityResponse(BaseModel):
    toxicity_score: float
    is_toxic: bool
    categories: Dict[str, float]
    language: str
    detected_keywords: list

def detect_language(text: str) -> str:
    """Enhanced language detection"""
    # Check for Hindi characters
    if any('\u0900' <= c <= '\u097F' for c in text):
        return 'hi'
    # Check for Telugu characters
    elif any('\u0C00' <= c <= '\u0C7F' for c in text):
        return 'te'
    # Check for Spanish characters
    elif any(c in 'ñáéíóúü¿¡' for c in text.lower()):
        return 'es'
    # Check for French characters
    elif any(c in 'àâäéèêëïîôöùûüÿçæœ' for c in text.lower()):
        return 'fr'
    # Check for Hinglish (mix of English and Hindi words)
    hinglish_words = ['bc', 'mc', 'bhenchod', 'madarchod', 'chutiya', 'kamina', 'gadha', 'bekaar', 'bakchodi']
    if any(word in text.lower() for word in hinglish_words):
        return 'hi-en'
    return 'en'

def calculate_toxicity_score(text: str, language: str) -> Dict:
    """Enhanced toxicity calculation with multilingual support"""
    
    # Initialize categories
    categories = {
        'toxic': 0.0,
        'severe_toxic': 0.0,
        'obscene': 0.0,
        'threat': 0.0,
        'identity_hate': 0.0,
        'harassment': 0.0,
        'spam': 0.0
    }
    
    # Get language-specific keywords
    keywords = TOXICITY_KEYWORDS.get(language, TOXICITY_KEYWORDS['en'])
    
    # Calculate keyword-based toxicity
    text_lower = text.lower()
    detected_keywords = []
    max_score = 0.0
    
    for keyword, score in keywords.items():
        if keyword in text_lower:
            detected_keywords.append(keyword)
            max_score = max(max_score, score)
            
            # Categorize keywords
            if keyword in ['kill', 'murder', 'rape', 'matar', 'tuer', 'चंपेस్తాను', 'मार दूंगा', 'maar dunga']:
                categories['severe_toxic'] = max(categories['severe_toxic'], score)
            elif keyword in ['threat', 'kill you', 'find you', 'coming for you', 'ढूंढ कर मारूंगा', 'dhund ke marunga']:
                categories['threat'] = max(categories['threat'], score)
            elif keyword in ['racist', 'nigger', 'terrorist', 'racista', 'जातिवादी', 'jaatvaadi']:
                categories['identity_hate'] = max(categories['identity_hate'], score)
            elif keyword in ['fuck', 'shit', 'asshole', 'bitch', 'joder', 'mierda', 'putain', 'merde', 'बेटीचोद', 'bc', 'mc']:
                categories['obscene'] = max(categories['obscene'], score)
            elif keyword in ['spam', 'lottery', 'click here', 'free money', 'लॉटरी', 'मुफ्त पैसा']:
                categories['spam'] = max(categories['spam'], score)
            else:
                categories['toxic'] = max(categories['toxic'], score)
                categories['harassment'] = max(categories['harassment'], score * 0.5)
    
    # Calculate overall toxicity score - use maximum score instead of weighted average
    category_scores = [categories[cat] for cat in categories.keys() if categories[cat] > 0]
    max_score = max(category_scores) if category_scores else 0
    overall_score = min(max_score, 1.0)  # Cap at 1.0
    
    return {
        'toxicity_score': overall_score,
        'categories': categories,
        'detected_keywords': detected_keywords,
        'language': language
    }

@app.post("/detect")
async def detect_toxicity(input_data: TextInput):
    """Enhanced toxicity detection endpoint"""
    
    # Detect language
    detected_language = detect_language(input_data.text)
    
    # Calculate toxicity
    result = calculate_toxicity_score(input_data.text, detected_language)
    
    return {
        "toxicity_score": result["toxicity_score"],
        "is_toxic": result["toxicity_score"] > 0.5,
        "categories": result["categories"],
        "language": detected_language,
        "detected_keywords": result["detected_keywords"]
    }

@app.post("/suggest-rewrite")
async def suggest_rewrite(input_data: TextInput):
    """Suggest rewrite for toxic comments"""
    
    # Simple rewrite suggestions based on detected keywords
    text = input_data.text.lower()
    suggestions = []
    
    # Common toxic words and their alternatives
    rewrite_map = {
        'stupid': 'unhelpful',
        'idiot': 'person',
        'hate': 'dislike',
        'kill': 'stop',
        'fuck': 'please',
        'shit': 'stuff',
        'asshole': 'person',
        'bitch': 'person',
        'nigger': 'person',
        'bc': 'please',
        'mc': 'please',
        'chutiya': 'person',
        'gadha': 'person',
        'kamina': 'person'
    }
    
    # Generate suggestion
    suggestion_text = input_data.text
    for toxic_word, alternative in rewrite_map.items():
        if toxic_word in text:
            suggestion_text = suggestion_text.replace(toxic_word, alternative)
    
    # If no changes needed, provide a generic suggestion
    if suggestion_text == input_data.text:
        suggestion_text = "Please be respectful and constructive in your comments."
    
    return {
        "suggestion": suggestion_text,
        "original_text": input_data.text,
        "is_toxic": any(word in text for word in rewrite_map.keys())
    }

@app.get("/health")
async def health_check():
    return {"status": "ML service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
