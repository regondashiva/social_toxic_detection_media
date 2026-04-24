import axios from 'axios'

const ML_API_URL = 'http://localhost:8000'

export const toxicityService = {
  async detectToxicity(text, language = 'en') {
    try {
      const response = await axios.post(`${ML_API_URL}/detect`, {
        text,
        language
      })
      return response.data
    } catch (error) {
      console.error('Toxicity detection error:', error)
      return {
        toxicity_score: 0,
        categories: {},
        is_toxic: false
      }
    }
  },

  async suggestRewrite(text) {
    try {
      const response = await axios.post(`${ML_API_URL}/suggest-rewrite`, { text })
      return response.data.suggestion
    } catch (error) {
      console.error('Rewrite suggestion error:', error)
      return null
    }
  },

  getToxicityLevel(score) {
    if (score < 0.5) return { level: 'safe', color: 'green' }
    if (score < 0.75) return { level: 'warning', color: 'yellow' }
    return { level: 'toxic', color: 'red' }
  }
}
