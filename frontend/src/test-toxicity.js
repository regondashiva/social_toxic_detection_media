// Test script for toxicity detection
import { toxicityService } from './services/toxicityService.js';

async function testToxicity() {
  console.log('Testing toxicity detection...');
  
  try {
    const result = await toxicityService.detectToxicity('You are stupid and idiot');
    console.log('Toxicity detection result:', result);
    console.log('Toxicity score:', result.toxicity_score);
    console.log('Categories:', result.categories);
    console.log('Detected keywords:', result.detected_keywords);
  } catch (error) {
    console.error('Error testing toxicity:', error);
  }
}

testToxicity();
