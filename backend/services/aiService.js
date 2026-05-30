const { GoogleGenAI } = require('@google/genai');

const allowedTaskCategories = ['DSA', 'System Design', 'Core Subjects', 'Behavioral', 'Mock Interview', 'Resume', 'General'];
const allowedMaterialTypes = ['Video', 'Article', 'Platform', 'Documentation', 'Repository', 'Other'];

const normalizeString = (value) => {
  return typeof value === 'string' ? value.trim() : '';
};

const normalizeArrayOfStrings = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => typeof item === 'string' ? item.trim() : '')
    .filter(Boolean);
};

const normalizeTask = (task, index) => {
  return {
    id: normalizeString(task?.id) || `t${index + 1}`,
    day: Number(task?.day) || index + 1,
    title: normalizeString(task?.title) || `Task ${index + 1}`,
    description: normalizeString(task?.description) || 'No description provided.',
    category: allowedTaskCategories.includes(normalizeString(task?.category)) ? normalizeString(task.category) : 'General',
    completed: Boolean(task?.completed)
  };
};

const normalizeStudyMaterial = (material, index) => {
  const category = normalizeString(material?.category);
  return {
    title: normalizeString(material?.title) || `Study Material ${index + 1}`,
    type: allowedMaterialTypes.includes(normalizeString(material?.type)) ? normalizeString(material.type) : 'Other',
    url: normalizeString(material?.url),
    description: normalizeString(material?.description) || '',
    category: category || 'Other'
  };
};

const normalizeRoadmapResponse = (response) => {
  const companyInsights = {
    overview: normalizeString(response?.companyInsights?.overview),
    hiringProcess: normalizeString(response?.companyInsights?.hiringProcess),
    interviewRounds: normalizeArrayOfStrings(response?.companyInsights?.interviewRounds),
    commonQuestions: normalizeArrayOfStrings(response?.companyInsights?.commonQuestions),
    resumeTips: normalizeArrayOfStrings(response?.companyInsights?.resumeTips)
  };

  const skillGapAnalysis = {
    missingSkills: normalizeArrayOfStrings(response?.skillGapAnalysis?.missingSkills),
    recommendations: normalizeArrayOfStrings(response?.skillGapAnalysis?.recommendations)
  };

  const tasks = Array.isArray(response?.tasks)
    ? response.tasks.map(normalizeTask)
    : [];

  const studyMaterials = Array.isArray(response?.studyMaterials)
    ? response.studyMaterials.map(normalizeStudyMaterial)
    : [];

  return {
    companyInsights,
    skillGapAnalysis,
    tasks,
    studyMaterials
  };
};

// Initialize Gemini
let ai;
try {
  const aiConfig = {};
  if (process.env.GEMINI_API_KEY) {
    aiConfig.apiKey = process.env.GEMINI_API_KEY;
  }
  ai = new GoogleGenAI(aiConfig);
} catch (err) {
  console.warn('Gemini AI initialization failed. Is GEMINI_API_KEY set?');
}

const extractJsonFromResponse = (response) => {
  const text = response?.text || response?.candidates?.[0]?.content;
  if (!text || typeof text !== 'string') {
    throw new Error('AI response is not valid text.');
  }

  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (primaryError) {
    const match = trimmed.match(/({[\s\S]*})$/m);
    if (!match) {
      throw primaryError;
    }
    return JSON.parse(match[1]);
  }
};

/**
 * Generate a complete AI prep hub JSON object
 */
const generatePrepRoadmap = async (company, role, timeRemaining, currentSkills) => {
  if (!ai) {
    throw new Error('Gemini AI is not configured on the server.');
  }

  const prompt = `
    You are an expert career coach and technical interviewer. I need you to generate a personalized company preparation ecosystem for a candidate.

    Target Company: ${company}
    Target Role: ${role}
    Time Remaining: ${timeRemaining}
    Candidate's Current Skills: ${currentSkills || 'Not specified'}

    Respond ONLY with a valid JSON object matching this structure exactly (do not wrap in markdown blocks, just return raw JSON):
    {
      "companyInsights": {
        "overview": "Brief company culture and mission overview",
        "hiringProcess": "Description of how they hire",
        "interviewRounds": ["Round 1: Online Assessment", "Round 2: ..."],
        "commonQuestions": ["Question 1", "Question 2"],
        "resumeTips": ["Tip 1", "Tip 2"]
      },
      "skillGapAnalysis": {
        "missingSkills": ["Skill 1", "Skill 2"],
        "recommendations": ["Recommendation 1"]
      },
      "tasks": [
        {
          "id": "t1",
          "day": 1,
          "title": "Task title",
          "description": "Detailed task description",
          "category": "DSA"
        }
      ],
      "studyMaterials": [
        {
          "title": "Material Title",
          "type": "Video",
          "url": "https://example.com",
          "description": "Why this is useful",
          "category": "DSA"
        }
      ]
    }

    Make sure the roadmap 'tasks' array covers every day or a realistic distribution across the ${timeRemaining}.
    Generate at least 5 study materials.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawData = extractJsonFromResponse(response);
    return normalizeRoadmapResponse(rawData);
  } catch (error) {
    console.error('Error generating roadmap with Gemini:', error);
    throw new Error('Failed to generate AI Roadmap. Please try again.');
  }
};

module.exports = {
  generatePrepRoadmap
};
