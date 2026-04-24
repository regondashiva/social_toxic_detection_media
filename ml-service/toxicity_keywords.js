// Multilingual Toxicity Detection Dataset
// Keywords and patterns for AI moderation system

const TOXIC_KEYWORDS = {
  english: {
    toxic: ['idiot', 'stupid', 'dumb', 'moron', 'fool', 'jerk', 'asshole', 'bastard', 'bitch', 'slut'],
    severe_toxic: ['kill', 'die', 'murder', 'death', 'rape', 'violence', 'harm', 'destroy'],
    obscene: ['fuck', 'shit', 'damn', 'hell', 'crap', 'piss', 'ass', 'cock', 'pussy'],
    threat: ['kill you', 'hurt you', 'find you', 'coming for you', 'watch your back'],
    identity_hate: ['racist', 'nigger', 'chink', 'spic', 'terrorist', 'caste', 'religion'],
    harassment: ['stalker', 'creep', 'weirdo', 'pervert', 'bully', 'harass', 'abuse'],
    spam: ['click here', 'buy now', 'free money', 'lottery', 'winner', 'congratulations']
  },
  hindi: {
    toxic: ['बेवकूफ', 'पागल', 'गधा', 'झूठा', 'कमीना', 'हरामखोर', 'चोर', 'दलदल'],
    severe_toxic: ['मार दूंगा', 'खत्म कर दूंगा', 'जान से मारूंगा', 'हिंसा', 'बलात्कार'],
    obscene: ['बेटीचोद', 'मादरचोद', 'भोसड़ीके', 'लंड', 'चूत', 'गांड'],
    threat: ['तेरा खून कर दूंगा', 'ढूंढ कर मारूंगा', 'पीछे हूं', 'खबरदार'],
    identity_hate: ['जातिवादी', 'धर्मवादी', 'मुस्लिम', 'हिंदू', 'सिख', 'ईसाई'],
    harassment: ['छेड़छाड़', 'परेशान करना', 'पीछा करना', 'डराना'],
    spam: ['मुफ्त पैसा', 'लॉटरी', 'जीते', 'क्लिक करें', 'खरीदें']
  },
  telugu: {
    toxic: ['తెలియని', 'పిచ్చి', 'దొంగ', 'మూర్ఖుడు', 'జడమైన', 'సిగ్గెడు'],
    severe_toxic: ['చంపేస్తాను', 'చావు', 'హింస', 'హత్య', 'దాడి'],
    obscene: ['లంజాకోడి', 'దొంగ', 'సిగ్గు', 'శని', 'మాదిరి'],
    threat: ['నీను చస్తాను', 'నిన్ను చూస్తాను', 'వెతుకుతాను', 'జాగ్రత్త'],
    identity_hate: ['కులం', 'మతం', 'హిందు', 'ముస్లిం', 'క్రైస్తవ'],
    harassment: ['వేధింపు', 'వేధిస్తున్నారు', 'వెంటపడుతున్నారు'],
    spam: ['ఉచిత డబ్బు', 'లాటరీ', 'గెలుపు', 'క్లిక్ చేయండి']
  },
  hinglish: {
    toxic: ['bekaar', 'gadha', 'chutiya', 'madarchod', 'bhenchod', 'kamina', 'pagal'],
    severe_toxic: ['maar dunga', 'khatam kar dunga', 'jaan se marunga', 'hatya karunga'],
    obscene: ['bc', 'mc', 'bhenchod', 'madarchod', 'lund', 'chut'],
    threat: ['tera khoon kar dunga', 'dhund ke marunga', 'piche hai tu', 'khabardar'],
    identity_hate: ['jaatvaadi', 'dharmvaadi', 'muslim', 'hindu', 'sikh', 'christian'],
    harassment: ['chedkhani', 'pareshan kar raha hai', 'piche kar raha hai'],
    spam: ['free money', 'lottery', 'jeetoge', 'click karo']
  },
  spanish: {
    toxic: ['idiota', 'estúpido', 'imbécil', 'pendejo', 'cabrón', 'hijo de puta'],
    severe_toxic: ['matar', 'mataré', 'muerte', 'violencia', 'destruir'],
    obscene: ['joder', 'mierda', 'coño', 'polla', 'puta'],
    threat: ['te mataré', 'te voy a matar', 'voy por ti', 'cuidado'],
    identity_hate: ['racista', 'negro', 'musulmán', 'judío', 'terrorista'],
    harassment: ['acosador', 'pervertido', 'molestar', 'hostigar'],
    spam: ['dinero gratis', 'lotería', 'gana', 'haz clic']
  },
  french: {
    toxic: ['idiot', 'stupide', 'connard', 'enculé', 'salaud', 'pute'],
    severe_toxic: ['tuer', 'mort', 'violence', 'détruire'],
    obscene: ['putain', 'merde', 'baiser', 'cul', 'bite'],
    threat: ['je vais te tuer', 'je viens te chercher', 'attention'],
    identity_hate: ['raciste', 'noir', 'musulman', 'juif', 'terroriste'],
    harassment: ['harceleur', 'pervers', 'importuner'],
    spam: ['argent gratuit', 'loterie', 'gagner', 'cliquez']
  }
};

const TRAINING_SAMPLES = [
  {
    id: 1,
    text: "You are such an idiot and stupid person",
    language: "english",
    toxicity_score: 0.85,
    categories: {
      toxic: 0.9,
      severe_toxic: 0.1,
      obscene: 0.2,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.3,
      spam: 0.0
    },
    keywords_detected: ["idiot", "stupid"],
    action: "warning",
    explanation: "Contains toxic insults but no severe threats"
  },
  {
    id: 2,
    text: "तुम बहुत बेवकूफ हो, मैं तुम्हें मार दूंगा",
    language: "hindi",
    toxicity_score: 0.95,
    categories: {
      toxic: 0.8,
      severe_toxic: 0.9,
      obscene: 0.1,
      threat: 0.8,
      identity_hate: 0.0,
      harassment: 0.4,
      spam: 0.0
    },
    keywords_detected: ["बेवकूफ", "मार दूंगा"],
    action: "block",
    explanation: "Contains severe threat and toxic language"
  },
  {
    id: 3,
    text: "నీకు తెలియని పనులు చేయడం మంచిది కాదు",
    language: "telugu",
    toxicity_score: 0.3,
    categories: {
      toxic: 0.4,
      severe_toxic: 0.0,
      obscene: 0.0,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.1,
      spam: 0.0
    },
    keywords_detected: ["తెలియని"],
    action: "allow",
    explanation: "Mild criticism, not severe enough to block"
  },
  {
    id: 4,
    text: "Tu chutiya hai, tera khoon kar dunga",
    language: "hinglish",
    toxicity_score: 0.98,
    categories: {
      toxic: 0.9,
      severe_toxic: 0.95,
      obscene: 0.8,
      threat: 0.9,
      identity_hate: 0.0,
      harassment: 0.7,
      spam: 0.0
    },
    keywords_detected: ["chutiya", "khoon kar dunga"],
    action: "block",
    explanation: "Severe threat with obscene language"
  },
  {
    id: 5,
    text: "Eres un idiota y un cabrón",
    language: "spanish",
    toxicity_score: 0.8,
    categories: {
      toxic: 0.85,
      severe_toxic: 0.1,
      obscene: 0.6,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.3,
      spam: 0.0
    },
    keywords_detected: ["idiota", "cabrón"],
    action: "warning",
    explanation: "Toxic insults in Spanish"
  },
  {
    id: 6,
    text: "Tu es un connard stupide",
    language: "french",
    toxicity_score: 0.75,
    categories: {
      toxic: 0.8,
      severe_toxic: 0.0,
      obscene: 0.7,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.2,
      spam: 0.0
    },
    keywords_detected: ["connard", "stupide"],
    action: "warning",
    explanation: "French toxic insults"
  },
  {
    id: 7,
    text: "I will find you and kill you",
    language: "english",
    toxicity_score: 1.0,
    categories: {
      toxic: 0.7,
      severe_toxic: 1.0,
      obscene: 0.0,
      threat: 1.0,
      identity_hate: 0.0,
      harassment: 0.8,
      spam: 0.0
    },
    keywords_detected: ["kill", "find you"],
    action: "block",
    explanation: "Direct death threat - highest priority block"
  },
  {
    id: 8,
    text: "Congratulations! You won $1,000,000 lottery! Click here to claim",
    language: "english",
    toxicity_score: 0.6,
    categories: {
      toxic: 0.0,
      severe_toxic: 0.0,
      obscene: 0.0,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.0,
      spam: 0.95
    },
    keywords_detected: ["congratulations", "lottery", "click here"],
    action: "block",
    explanation: "Spam content - lottery scam"
  },
  {
    id: 9,
    text: "मुफ्त पैसा कमाने के लिए यहाँ क्लिक करें",
    language: "hindi",
    toxicity_score: 0.65,
    categories: {
      toxic: 0.0,
      severe_toxic: 0.0,
      obscene: 0.0,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.0,
      spam: 0.9
    },
    keywords_detected: ["मुफ्त पैसा", "क्लिक करें"],
    action: "block",
    explanation: "Hindi spam content"
  },
  {
    id: 10,
    text: "This is a beautiful post! Great work!",
    language: "english",
    toxicity_score: 0.05,
    categories: {
      toxic: 0.0,
      severe_toxic: 0.0,
      obscene: 0.0,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.0,
      spam: 0.0
    },
    keywords_detected: [],
    action: "allow",
    explanation: "Positive comment - no toxicity"
  }
];

const DETECTION_RULES = {
  thresholds: {
    warning: 0.5,
    block: 0.75
  },
  category_weights: {
    severe_toxic: 0.3,
    threat: 0.3,
    identity_hate: 0.2,
    obscene: 0.1,
    harassment: 0.07,
    spam: 0.03
  },
  action_mapping: {
    allow: {
      score_range: [0, 0.49],
      response: "Comment approved",
      user_action: "none"
    },
    warning: {
      score_range: [0.5, 0.74],
      response: "Warning: This comment contains inappropriate language",
      user_action: "warning_notification"
    },
    block: {
      score_range: [0.75, 1.0],
      response: "Comment blocked for violating community guidelines",
      user_action: "comment_rejected"
    }
  }
};

const COMMENT_DETECTION_EXAMPLES = {
  social_media_context: [
    {
      comment: "Nice photo! 😍",
      detection: "allow",
      reason: "Positive engagement"
    },
    {
      comment: "This is so stupid lol",
      detection: "warning",
      reason: "Mild toxicity - warning threshold"
    },
    {
      comment: "I'm going to find you and hurt you",
      detection: "block",
      reason: "Direct threat - immediate block"
    },
    {
      comment: "Free iPhone! Click now! 🎁",
      detection: "block",
      reason: "Spam content"
    },
    {
      comment: "यह तस्वीर बहुत अच्छी है",
      detection: "allow",
      reason: "Positive Hindi comment"
    },
    {
      comment: "ఈ ఫోటో చాలా బాగుంది",
      detection: "allow",
      reason: "Positive Telugu comment"
    },
    {
      comment: "Bhai kya bakchodi kar raha hai",
      detection: "warning",
      reason: "Hinglish mild toxicity"
    },
    {
      comment: "¡Qué bonita foto!",
      detection: "allow",
      reason: "Positive Spanish comment"
    },
    {
      comment: "Très belle photo!",
      detection: "allow",
      reason: "Positive French comment"
    }
  ]
};

module.exports = {
  TOXIC_KEYWORDS,
  TRAINING_SAMPLES,
  DETECTION_RULES,
  COMMENT_DETECTION_EXAMPLES
};
