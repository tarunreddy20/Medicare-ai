import {
  FaProcedures,
  FaAppleAlt,
  FaTooth,
  FaWalking,
  FaBrain,
  FaHeartbeat,
  FaHandSparkles,
  FaBaby,
  FaBone,
  FaEye,
  FaLungs,
  FaStethoscope
} from "react-icons/fa";
import { MdPsychology, MdHearing, MdPregnantWoman } from "react-icons/md";
import { GiKidneys, GiStomach, GiHypodermicTest } from "react-icons/gi";

const specialties = [
  {
    id: 1,
    name: "General Surgery",
    slug: "general-surgery",
    icon: FaProcedures,
    description: "Surgical procedures for abdominal organs, skin, breast, and soft tissue",
    color: "#dc2626",
    prompts: [
      "What are the signs that I might need surgery?",
      "How do I prepare before a surgical procedure?",
      "What is the typical recovery time after abdominal surgery?",
      "When should I get a second opinion on surgery?"
    ]
  },
  {
    id: 2,
    name: "Dietitian / Nutrition",
    slug: "dietitian",
    icon: FaAppleAlt,
    description: "Personalized diet plans, weight management, and nutritional guidance",
    color: "#16a34a",
    prompts: [
      "What foods help reduce inflammation?",
      "Can you suggest a balanced meal plan for weight loss?",
      "What vitamins am I likely deficient in?",
      "How many calories should I eat daily for my goals?"
    ]
  },
  {
    id: 3,
    name: "Dentist",
    slug: "dentist",
    icon: FaTooth,
    description: "Oral health, teeth cleaning, cavities, gum disease, and dental care",
    color: "#0891b2",
    prompts: [
      "What can I do for a toothache at home?",
      "How often should I get my teeth professionally cleaned?",
      "What are the early signs of gum disease?",
      "Is teeth whitening safe for sensitive teeth?"
    ]
  },
  {
    id: 4,
    name: "Physiotherapy",
    slug: "physiotherapy",
    icon: FaWalking,
    description: "Physical rehabilitation, pain management, and mobility improvement",
    color: "#ea580c",
    prompts: [
      "What exercises help with lower back pain?",
      "How long does recovery take after a knee injury?",
      "Should I use heat or ice for muscle pain?",
      "What stretches can prevent neck stiffness?"
    ]
  },
  {
    id: 5,
    name: "Neurosurgeon",
    slug: "neurosurgeon",
    icon: FaBrain,
    description: "Brain and spinal cord disorders, nerve injuries, and neurological surgery",
    color: "#7c3aed",
    prompts: [
      "What are warning signs of a neurological emergency?",
      "What causes persistent headaches and when to worry?",
      "How is a herniated disc treated?",
      "What is the recovery process after spinal surgery?"
    ]
  },
  {
    id: 6,
    name: "Cardiologist",
    slug: "cardiologist",
    icon: FaHeartbeat,
    description: "Heart health, blood pressure, cholesterol, and cardiovascular diseases",
    color: "#e11d48",
    prompts: [
      "What are the early signs of heart disease?",
      "How can I lower my cholesterol naturally?",
      "What does chest pain during exercise indicate?",
      "How often should I check my blood pressure?"
    ]
  },
  {
    id: 7,
    name: "Dermatologist",
    slug: "dermatologist",
    icon: FaHandSparkles,
    description: "Skin conditions, acne, eczema, hair loss, and cosmetic dermatology",
    color: "#d97706",
    prompts: [
      "What is causing my sudden acne breakout?",
      "How do I identify a suspicious mole or skin lesion?",
      "What is the best skincare routine for eczema?",
      "What treatments help with hair thinning or loss?"
    ]
  },
  {
    id: 8,
    name: "Pediatrician",
    slug: "pediatrician",
    icon: FaBaby,
    description: "Child health, vaccinations, growth monitoring, and childhood illnesses",
    color: "#2563eb",
    prompts: [
      "What vaccinations does my child need by age 2?",
      "How do I manage a child's fever at home?",
      "What are signs of developmental delay to watch for?",
      "When should I take my child to the ER vs. waiting?"
    ]
  },
  {
    id: 9,
    name: "Psychiatrist",
    slug: "psychiatrist",
    icon: MdPsychology,
    description: "Mental health, anxiety, depression, therapy, and behavioral disorders",
    color: "#4f46e5",
    prompts: [
      "What are the early signs of anxiety disorder?",
      "How do I know if I need therapy vs. medication?",
      "What coping strategies help with panic attacks?",
      "How does chronic stress affect physical health?"
    ]
  },
  {
    id: 10,
    name: "Orthopedics",
    slug: "orthopedics",
    icon: FaBone,
    description: "Bone and joint disorders, fractures, arthritis, and sports injuries",
    color: "#059669",
    prompts: [
      "How do I know if my injury is a fracture or a sprain?",
      "What exercises strengthen joints with arthritis?",
      "When is knee replacement surgery recommended?",
      "How long does a broken bone take to heal?"
    ]
  },
  {
    id: 11,
    name: "ENT Specialist",
    slug: "ent",
    icon: MdHearing,
    description: "Ear, nose, and throat conditions, hearing loss, sinusitis, and allergies",
    color: "#0d9488",
    prompts: [
      "What causes recurring sinus infections?",
      "How do I know if my hearing loss needs treatment?",
      "What remedies help with chronic sore throat?",
      "When should tonsils be surgically removed?"
    ]
  },
  {
    id: 12,
    name: "Gynecologist",
    slug: "gynecologist",
    icon: MdPregnantWoman,
    description: "Women's reproductive health, pregnancy care, and hormonal disorders",
    color: "#db2777",
    prompts: [
      "What are common causes of irregular periods?",
      "When should I start routine gynecological screenings?",
      "What symptoms suggest a hormonal imbalance?",
      "How do I manage PCOS symptoms naturally?"
    ]
  },
  {
    id: 13,
    name: "Ophthalmologist",
    slug: "ophthalmologist",
    icon: FaEye,
    description: "Eye health, vision problems, cataracts, glaucoma, and laser surgery",
    color: "#6366f1",
    prompts: [
      "How often should I get my eyes checked?",
      "What are early signs of glaucoma?",
      "Is laser eye surgery safe for everyone?",
      "What causes sudden blurry vision?"
    ]
  },
  {
    id: 14,
    name: "Pulmonologist",
    slug: "pulmonologist",
    icon: FaLungs,
    description: "Lung and respiratory health, asthma, COPD, and breathing disorders",
    color: "#0ea5e9",
    prompts: [
      "What are the early signs of asthma?",
      "How do I manage COPD symptoms?",
      "When is shortness of breath a medical emergency?",
      "What causes chronic cough lasting weeks?"
    ]
  },
  {
    id: 15,
    name: "Urologist",
    slug: "urologist",
    icon: GiKidneys,
    description: "Kidney, bladder, and urinary tract disorders, prostate health",
    color: "#f97316",
    prompts: [
      "What are symptoms of kidney stones?",
      "How do I prevent urinary tract infections?",
      "What causes frequent urination at night?",
      "When should prostate health be checked?"
    ]
  },
  {
    id: 16,
    name: "Gastroenterologist",
    slug: "gastroenterologist",
    icon: GiStomach,
    description: "Digestive system, liver, IBS, acid reflux, and gastrointestinal disorders",
    color: "#84cc16",
    prompts: [
      "What causes persistent acid reflux?",
      "How is IBS different from IBD?",
      "What foods should I avoid with a stomach ulcer?",
      "When should I get a colonoscopy?"
    ]
  },
  {
    id: 17,
    name: "Endocrinologist",
    slug: "endocrinologist",
    icon: GiHypodermicTest,
    description: "Hormonal disorders, diabetes, thyroid conditions, and metabolic diseases",
    color: "#a855f7",
    prompts: [
      "What are early signs of diabetes?",
      "How do I manage thyroid imbalance?",
      "What causes unexplained weight gain?",
      "How is insulin resistance treated?"
    ]
  },
  {
    id: 18,
    name: "General Physician",
    slug: "general-physician",
    icon: FaStethoscope,
    description: "Primary care, routine checkups, fevers, infections, and general health",
    color: "#475569",
    prompts: [
      "When should I see a doctor for a fever?",
      "What routine health screenings do I need?",
      "How do I manage seasonal allergies?",
      "What causes fatigue that lasts for weeks?"
    ]
  }
];

export default specialties;
