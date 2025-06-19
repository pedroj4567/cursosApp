import axiosInstance from "../../lib/axios";

interface QuestionAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

interface EvaluationResult {
  isApproved: boolean;
  feedback: string;
  detailedFeedback: {
    question: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const OPENROUTER_API_KEY = import.meta.env.VITE_API_OPEN_ROUTER_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const evaluateQuizAnswers = async (
  answers: QuestionAnswer[]
): Promise<EvaluationResult> => {
  try {
    // Construir el prompt para la IA
    const prompt = buildEvaluationPrompt(answers);

    // Configurar los headers
    const headers = {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http:localhost5173", // Reemplaza con tu URL
      "X-Title": "frostAcademy", // Reemplaza con el nombre de tu app
    };

    // Configurar el cuerpo de la solicitud
    const data = {
      model: "deepseek/deepseek-r1-0528:free", // Puedes cambiar el modelo según necesites
      messages: [
        {
          role: "system",
          content:
            "Eres un evaluador experto de cuestionarios educativos. Analiza las respuestas y proporciona feedback detallado.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    };

    const response = await axiosInstance.post(OPENROUTER_API_URL, data, {
      headers,
    });

    // Procesar la respuesta de la IA
    const aiResponse = response.data.choices[0].message.content;
    return parseAIResponse(aiResponse, answers);
  } catch (error) {
    console.error("Error al evaluar respuestas con OpenRouter:", error);
    throw new Error("No se pudo evaluar las respuestas en este momento");
  }
};

// Función para construir el prompt
const buildEvaluationPrompt = (answers: QuestionAnswer[]): string => {
  let prompt = `Evalúa las siguientes respuestas de un cuestionario y determina si el usuario aprobó. 
  Considera que aprueba si al menos el 70% de las respuestas son correctas. Para cada pregunta:
  
  1. Compara la respuesta del usuario con la respuesta correcta
  2. Determina si es correcta (mismo significado aunque no idénticas palabras)
  3. Proporciona feedback breve para cada respuesta
  4. Al final, da un veredicto general y feedback contextual
  
  Formato de respuesta requerido (JSON):
  {
    "isApproved": boolean,
    "feedback": "string",
    "detailedFeedback": [
      {
        "question": "string",
        "isCorrect": boolean,
        "feedback": "string"
      }
    ]
  }

  Datos del cuestionario:\n`;

  answers.forEach((item, index) => {
    prompt += `\nPregunta ${index + 1}: ${item.question}
    - Respuesta correcta: ${item.correctAnswer}
    - Respuesta del usuario: ${item.userAnswer}
    ${item.explanation ? `- Explicación: ${item.explanation}\n` : ""}`;
  });

  return prompt;
};

// Función para parsear la respuesta de la IA
const parseAIResponse = (
  aiResponse: string,
  originalAnswers: QuestionAnswer[]
): EvaluationResult => {
  try {
    // Extraer el JSON de la respuesta (puede venir con texto alrededor)
    const jsonStart = aiResponse.indexOf("{");
    const jsonEnd = aiResponse.lastIndexOf("}") + 1;
    const jsonString = aiResponse.slice(jsonStart, jsonEnd);

    const parsedResponse = JSON.parse(jsonString);

    // Validar la estructura básica
    if (
      typeof parsedResponse.isApproved !== "boolean" ||
      !Array.isArray(parsedResponse.detailedFeedback)
    ) {
      throw new Error("Formato de respuesta inválido");
    }

    // Mezclar con los datos originales para tener toda la información
    const detailedFeedback = parsedResponse.detailedFeedback.map(
      (item: any, index: number) => ({
        ...item,
        correctAnswer: originalAnswers[index].correctAnswer,
        userAnswer: originalAnswers[index].userAnswer,
      })
    );

    return {
      isApproved: parsedResponse.isApproved,
      feedback: parsedResponse.feedback || "",
      detailedFeedback,
    };
  } catch (error) {
    console.error("Error al parsear respuesta de IA:", error);
    // Respuesta de fallback
    return getDefaultEvaluation(originalAnswers);
  }
};

// Respuesta por defecto en caso de error
const getDefaultEvaluation = (answers: QuestionAnswer[]): EvaluationResult => {
  // Lógica simple de evaluación local como fallback
  const correctCount = answers.filter(
    (item) =>
      item.userAnswer.trim().toLowerCase() ===
      item.correctAnswer.trim().toLowerCase()
  ).length;

  const isApproved = correctCount / answers.length >= 0.7;

  const detailedFeedback = answers.map((item) => ({
    question: item.question,
    isCorrect:
      item.userAnswer.trim().toLowerCase() ===
      item.correctAnswer.trim().toLowerCase(),
    feedback: item.explanation || "",
    correctAnswer: item.correctAnswer,
    userAnswer: item.userAnswer,
  }));

  return {
    isApproved,
    feedback: isApproved
      ? "¡Buen trabajo! Has aprobado el cuestionario."
      : "Algunas respuestas necesitan revisión. Por favor revisa el feedback.",
    detailedFeedback,
  };
};
