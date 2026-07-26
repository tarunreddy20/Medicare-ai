import os
from openai import OpenAI
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Groq configuration (OpenAI-compatible API)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "llama-3.3-70b-versatile")

provider = "none"

if GROQ_API_KEY:
    client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url=GROQ_BASE_URL
    )
    MODEL = GROQ_LLM_MODEL
    provider = "groq"
else:
    client = None
    MODEL = GROQ_LLM_MODEL
    logger.warning("No LLM provider configured. Set GROQ_API_KEY in environment variables.")

SYSTEM_PROMPT = """You are an LLM-powered health information assistant on a hospital portal.

Your role:
- Provide general health education and next-step guidance.
- Use the user-selected specialty context when answering.
- Be clear, calm, and practical.

Formatting rules (ALWAYS follow these):
- Use markdown formatting in every response.
- Use ## headings to separate major sections.
- Use bullet points (- ) for lists of symptoms, steps, or recommendations.
- Use **bold** for key terms or important warnings.
- Keep paragraphs short (2-3 sentences max).
- Add a blank line between sections for readability.
- Use numbered lists (1. 2. 3.) for sequential steps.

Cross-specialty redirection:
- The system may automatically switch the active department before you answer.
- If the topic is outside the original context, continue naturally in the matched specialty.
- Do not ask the user to go back to the dashboard to switch departments.
- Available departments: General Surgery, Dietitian/Nutrition, Dentist, Physiotherapy, Neurosurgeon, Cardiologist, Dermatologist, Pediatrician, Psychiatrist, Orthopedics, ENT Specialist, Gynecologist.
- You may briefly acknowledge the handoff, then provide guidance in the correct specialty.

Safety rules:
- Do not claim to be a doctor or provide a diagnosis.
- Do not prescribe medication or treatment plans.
- For urgent/red-flag symptoms, instruct the user to contact emergency services immediately.
- End responses with a short reminder to consult a licensed healthcare professional.

Citations (ALWAYS include at the end of your response):
- After your main content, add a ## References section.
- List 2-4 credible medical sources that support your guidance.
- Use reputable sources such as WHO, Mayo Clinic, NHS, CDC, MedlinePlus, Cleveland Clinic, WebMD, or relevant medical journals.
- Format each citation as: - [Source Name](URL) — brief description of what it covers.
- Only cite real, well-known medical websites. Do not invent URLs.
- Example:
  ## References
  - [Mayo Clinic - Toothache](https://www.mayoclinic.org/diseases-conditions/toothache) — Causes and home remedies
  - [NHS - Dental Pain](https://www.nhs.uk/conditions/toothache/) — When to see a dentist
"""

def generate_reply(user_message: str, specialty: str | None = None) -> str:
    """Generate a reply using OpenAI's ChatGPT API"""
    try:
        if client is None:
            return "The assistant is not configured yet. Please set GROQ_API_KEY in the backend environment and restart the server."

        specialty_context = specialty or "general health"
        logger.info("Creating %s request with model/deployment: %s", provider, MODEL)
        logger.info("Message received for specialty: %s", specialty_context)
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Specialty context: {specialty_context}\n\nUser message: {user_message}"
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        reply = response.choices[0].message.content
        logger.info(f"Successfully generated reply: {reply[:100]}...")
        return reply
        
    except Exception as e:
        logger.error(f"OpenAI API Error: {type(e).__name__}: {str(e)}", exc_info=True)
        return "I apologize, but I'm having trouble generating a response right now. Please try again in a moment."
