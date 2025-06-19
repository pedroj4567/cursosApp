/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Alert } from "flowbite-react";
import { HiArrowLeft, HiCheck, HiX, HiSparkles } from "react-icons/hi";
import axios from "axios";

interface Quiz {
  id: number;
  question: string;
  correctAnswer: string;
  explanation?: string;
}

interface CourseWithQuizzes {
  id: number;
  title: string;
  quizzes: Quiz[];
}

interface EvaluationResult {
  isApproved: boolean;
  feedback: string;
  detailedFeedback: {
    question: string;
    isCorrect: boolean;
    feedback: string;
    correctAnswer: string;
    userAnswer: string;
  }[];
}

// Servicio de evaluación con IA
const evaluateWithAI = async (
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation?: string;
  }[]
): Promise<EvaluationResult> => {
  try {
    const prompt = buildEvaluationPrompt(answers);

    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_API_OPEN_ROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.href,
      "X-Title": "Learning Platform",
    };

    const data = {
      model: "openai/gpt-3.5-turbo",
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

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      data,
      { headers }
    );
    const aiResponse = response.data.choices[0].message.content;
    return parseAIResponse(aiResponse, answers);
  } catch (error) {
    console.error("Error al evaluar con IA:", error);
    return getDefaultEvaluation(answers);
  }
};

const buildEvaluationPrompt = (answers: any[]) => {
  let prompt = `Evalúa las siguientes respuestas de un cuestionario. Para cada pregunta:
  
  1. Compara la respuesta del usuario con la respuesta correcta
  2. Determina si es correcta (considera el mismo significado aunque no sean palabras idénticas)
  3. Proporciona feedback breve para cada respuesta
  4. Al final, da un veredicto general (aprueba con 70% o más de aciertos) y feedback contextual
  
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

const parseAIResponse = (
  aiResponse: string,
  originalAnswers: any[]
): EvaluationResult => {
  try {
    const jsonStart = aiResponse.indexOf("{");
    const jsonEnd = aiResponse.lastIndexOf("}") + 1;
    const jsonString = aiResponse.slice(jsonStart, jsonEnd);

    const parsedResponse = JSON.parse(jsonString);

    if (
      typeof parsedResponse.isApproved !== "boolean" ||
      !Array.isArray(parsedResponse.detailedFeedback)
    ) {
      throw new Error("Formato de respuesta inválido");
    }

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
    return getDefaultEvaluation(originalAnswers);
  }
};

const getDefaultEvaluation = (answers: any[]): EvaluationResult => {
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

// Mock service para los cursos
const mockCourseService = {
  getCourseByUUID: async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<CourseWithQuizzes> => {
    const hardcodedCourses: Record<string, CourseWithQuizzes> = {
      "react-course": {
        id: 1,
        title: "Introducción a React",
        quizzes: [
          {
            id: 1,
            question: "¿Qué es React?",
            correctAnswer:
              "Una biblioteca de JavaScript para construir interfaces de usuario",
            explanation:
              "React no es un framework, es una biblioteca mantenida por Facebook",
          },
          {
            id: 2,
            question: "¿Qué hook se usa para efectos secundarios?",
            correctAnswer: "useEffect",
            explanation:
              "useEffect reemplaza a los métodos del ciclo de vida en componentes de clase",
          },
        ],
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 100));
    return (
      hardcodedCourses[uuid] || {
        id: 0,
        title: "Curso de Ejemplo",
        quizzes: [
          {
            id: 1,
            question: "Pregunta de ejemplo 1",
            correctAnswer: "Respuesta correcta",
            explanation: "Esta es una explicación de ejemplo",
          },
        ],
      }
    );
  },
};

const QuizPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseWithQuizzes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // --- Estado y efecto para el feedback tipeado ---
  const [typedFeedback, setTypedFeedback] = useState("");
  useEffect(() => {
    if (evaluation && evaluation.feedback) {
      let i = 0;
      setTypedFeedback("");
      const interval = setInterval(() => {
        setTypedFeedback((prev) => prev + evaluation.feedback[i]);
        i++;
        if (i >= evaluation.feedback.length) clearInterval(interval);
      }, 30); // velocidad del tipeo
      return () => clearInterval(interval);
    }
  }, [evaluation]);
  // -------------------------------------------------

  useEffect(() => {
    const fetchCourseQuizzes = async () => {
      try {
        setLoading(true);
        if (!courseId) throw new Error("No se proporcionó ID del curso");

        const courseData = await mockCourseService.getCourseByUUID({
          uuid: courseId,
        });

        if (!courseData.quizzes || courseData.quizzes.length === 0) {
          throw new Error("Este curso no tiene quizzes disponibles");
        }

        setCourse(courseData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseQuizzes();
  }, [courseId]);

  const handleAnswerChange = (value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (course?.quizzes.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!course) return;

    setIsEvaluating(true);

    try {
      // Preparar datos para la evaluación
      const answersForEvaluation = course.quizzes.map((quiz, index) => ({
        question: quiz.question,
        userAnswer: userAnswers[index] || "",
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
      }));
      // Evaluar con IA
      const evaluationResult = await evaluateWithAI(answersForEvaluation);
      setEvaluation(evaluationResult);
      setSubmitted(true);
    } catch (error) {
      console.error("Error al evaluar:", error);
      alert("Ocurrió un error al evaluar tus respuestas");
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQuestion = course?.quizzes[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex] || "";
  const isLastQuestion =
    currentQuestionIndex === (course?.quizzes.length || 0) - 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert color="failure" className="max-w-md">
          <span className="font-medium">Error:</span> {error}
          <Button color="gray" onClick={() => navigate(-1)} className="mt-4">
            <HiArrowLeft className="mr-2" />
            Volver al curso
          </Button>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert color="info" className="max-w-md">
          No se encontró el curso
        </Alert>
      </div>
    );
  }

  if (submitted && evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Resultados del Quiz
          </h2>

          <div
            className={`text-center py-6 mb-6 rounded-lg ${
              evaluation.isApproved
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center justify-center">
              {evaluation.isApproved ? (
                <HiCheck className="h-8 w-8 mr-2 text-green-500" />
              ) : (
                <HiX className="h-8 w-8 mr-2 text-red-500" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {evaluation.isApproved ? "¡Aprobado!" : "No aprobado"}
                </p>
                <p className="text-lg">{evaluation.feedback}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {evaluation.detailedFeedback.map((item, index) => (
              <div key={index} className="border-b pb-4">
                <p className="font-medium">{item.question}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Tu respuesta: {item.userAnswer || "No respondida"}
                </p>
                <p className="text-sm flex items-center mt-1">
                  {item.isCorrect ? (
                    <HiCheck className="text-green-500 mr-1" />
                  ) : (
                    <HiX className="text-red-500 mr-1" />
                  )}
                  Respuesta correcta: {item.correctAnswer}
                </p>
                {item.feedback && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Feedback:</span>{" "}
                    {item.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate(`/course/video/${courseId}`)}
            className="w-full bg-teal-400 h-5"
          >
            Volver al curso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Quiz: {course.title}</h2>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              Pregunta {currentQuestionIndex + 1} de {course.quizzes.length}
            </span>
            {/* Botón de cerrar quiz */}
            <Button
              size="sm"
              onClick={() => navigate(`/course/video/${courseId}`)}
              className="ml-2 text-red-400"
              title="Cerrar quiz"
            >
              <HiX className="mr-1" />
              Cerrar
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion?.question}
            </h3>
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              rows={4}
              placeholder="Escribe tu respuesta aquí..."
            />
          </div>

          {/* Feedback debajo del quiz con efecto de tipeo */}
          {evaluation && (
            <div className="my-6 p-4 bg-blue-50 rounded shadow">
              <h4 className="font-bold mb-2">Feedback:</h4>
              <p className="font-mono whitespace-pre-line">{typedFeedback}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              color="light"
            >
              Anterior
            </Button>

            {isLastQuestion ? (
              <div className="  text-black">
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!currentAnswer.trim() || isEvaluating}
                  className="border bg-teal-350"
                >
                  {isEvaluating ? (
                    <>
                      <Spinner size="sm" className="mr-2 text-black" />
                      <span className="text-black">Evaluando...</span>
                    </>
                  ) : (
                    <>
                      <HiSparkles className="mr-2 text-black" />
                      <span className="text-black"> Enviar y Evaluar</span>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="border"
                color={"sucess"}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
