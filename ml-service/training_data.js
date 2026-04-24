// Multilingual Toxicity Detection Training Dataset
// Comprehensive dataset for AI moderation system

const TRAINING_DATA = [
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
  },
  {
    id: 11,
    text: "यह तस्वीर बहुत अच्छी है",
    language: "hindi",
    toxicity_score: 0.02,
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
    explanation: "Positive Hindi comment"
  },
  {
    id: 12,
    text: "ఈ ఫోటో చాలా బాగుంది",
    language: "telugu",
    toxicity_score: 0.02,
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
    explanation: "Positive Telugu comment"
  },
  {
    id: 13,
    text: "Bhai kya bakchodi kar raha hai",
    language: "hinglish",
    toxicity_score: 0.45,
    categories: {
      toxic: 0.5,
      severe_toxic: 0.0,
      obscene: 0.3,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.2,
      spam: 0.0
    },
    keywords_detected: ["bakchodi"],
    action: "allow",
    explanation: "Mild Hinglish toxicity - below warning threshold"
  },
  {
    id: 14,
    text: "¡Qué bonita foto!",
    language: "spanish",
    toxicity_score: 0.02,
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
    explanation: "Positive Spanish comment"
  },
  {
    id: 15,
    text: "Très belle photo!",
    language: "french",
    toxicity_score: 0.02,
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
    explanation: "Positive French comment"
  },
  {
    id: 16,
    text: "You fucking asshole, go to hell",
    language: "english",
    toxicity_score: 0.9,
    categories: {
      toxic: 0.9,
      severe_toxic: 0.3,
      obscene: 0.9,
      threat: 0.2,
      identity_hate: 0.0,
      harassment: 0.6,
      spam: 0.0
    },
    keywords_detected: ["fucking", "asshole", "hell"],
    action: "block",
    explanation: "Severe obscene language with harassment"
  },
  {
    id: 17,
    text: "तुम्हारी माँ की...",
    language: "hindi",
    toxicity_score: 0.85,
    categories: {
      toxic: 0.8,
      severe_toxic: 0.4,
      obscene: 0.7,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.5,
      spam: 0.0
    },
    keywords_detected: ["माँ"],
    action: "block",
    explanation: "Family insult in Hindi - severe toxicity"
  },
  {
    id: 18,
    text: "నీ అమ్మ నాన్న...",
    language: "telugu",
    toxicity_score: 0.85,
    categories: {
      toxic: 0.8,
      severe_toxic: 0.4,
      obscene: 0.7,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.5,
      spam: 0.0
    },
    keywords_detected: ["అమ్మ", "నాన్న"],
    action: "block",
    explanation: "Family insult in Telugu - severe toxicity"
  },
  {
    id: 19,
    text: "Teri maa ki... BC",
    language: "hinglish",
    toxicity_score: 0.95,
    categories: {
      toxic: 0.9,
      severe_toxic: 0.5,
      obscene: 0.9,
      threat: 0.0,
      identity_hate: 0.0,
      harassment: 0.7,
      spam: 0.0
    },
    keywords_detected: ["teri maa ki", "bc"],
    action: "block",
    explanation: "Severe family insult with obscene language"
  },
  {
    id: 20,
    text: "Eres un racista y un terrorista",
    language: "spanish",
    toxicity_score: 0.88,
    categories: {
      toxic: 0.7,
      severe_toxic: 0.3,
      obscene: 0.0,
      threat: 0.4,
      identity_hate: 0.9,
      harassment: 0.5,
      spam: 0.0
    },
    keywords_detected: ["racista", "terrorista"],
    action: "block",
    explanation: "Identity hate and accusation in Spanish"
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

const COMMENT_EXAMPLES = [
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
];

module.exports = {
  TRAINING_DATA,
  DETECTION_RULES,
  COMMENT_EXAMPLES
};
