/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Radio } from "flowbite-react";
import { HiArrowLeft, HiCheck, HiX, HiSparkles } from "react-icons/hi";
import { courseServices } from "../../services/Courses";

interface Quiz {
  id: number;
  question: string;
  value: "YES" | "NO";
  aprobado: boolean | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
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

const evaluateQuiz = (
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[]
): EvaluationResult => {
  const correctCount = answers.filter(
    (item) => item.userAnswer === item.correctAnswer
  ).length;

  const isApproved = correctCount / answers.length >= 0.7;
  const detailedFeedback = answers.map((item) => ({
    question: item.question,
    isCorrect: item.userAnswer === item.correctAnswer,
    feedback:
      item.userAnswer === item.correctAnswer
        ? "¡Respuesta correcta!"
        : `La respuesta correcta es: ${
            item.correctAnswer === "YES" ? "Sí" : "No"
          }`,
    correctAnswer: item.correctAnswer,
    userAnswer: item.userAnswer,
  }));

  return {
    isApproved,
    feedback: isApproved
      ? "¡Felicidades! Has aprobado el cuestionario."
      : "No has alcanzado el puntaje mínimo para aprobar. Revisa tus respuestas.",
    detailedFeedback,
  };
};

const QuizPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseWithQuizzes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "YES" | "NO">>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [typedFeedback, setTypedFeedback] = useState("");

  useEffect(() => {
    if (evaluation && evaluation.feedback) {
      let i = 0;
      setTypedFeedback("");
      const interval = setInterval(() => {
        setTypedFeedback((prev) => prev + evaluation.feedback[i]);
        i++;
        if (i >= evaluation.feedback.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [evaluation]);

  useEffect(() => {
    const fetchCourseQuizzes = async () => {
      try {
        setLoading(true);
        if (!courseId) throw new Error("No se proporcionó ID del curso");

        const courseData = await courseServices.getCourseByUUID({
          uuid: courseId,
        });

        if (!courseData.quizzes || !courseData.quizzes.length) {
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

  const handleAnswerChange = (value: "YES" | "NO") => {
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

  const handleSubmitQuiz = () => {
    if (!course) return;

    setIsEvaluating(true);

    try {
      const answersForEvaluation = course.quizzes.map((quiz, index) => ({
        question: quiz.question,
        userAnswer: userAnswers[index] || "NO",
        correctAnswer: quiz.value,
      }));

      const evaluationResult = evaluateQuiz(answersForEvaluation);
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
  const currentAnswer = userAnswers[currentQuestionIndex];
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
                  Tu respuesta: {item.userAnswer === "YES" ? "Sí" : "No"}
                </p>
                <p className="text-sm flex items-center mt-1">
                  {item.isCorrect ? (
                    <HiCheck className="text-green-500 mr-1" />
                  ) : (
                    <HiX className="text-red-500 mr-1" />
                  )}
                  Respuesta correcta:{" "}
                  {item.correctAnswer === "YES" ? "Sí" : "No"}
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden relative z-10"></div>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Quiz: {course.title}</h2>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                Pregunta {currentQuestionIndex + 1} de {course.quizzes.length}
              </span>
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

              <fieldset className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Radio
                    id={`yes-${currentQuestionIndex}`}
                    name={`answer-${currentQuestionIndex}`}
                    checked={currentAnswer === "YES"}
                    onChange={() => handleAnswerChange("YES")}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={`yes-${currentQuestionIndex}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    Sí
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Radio
                    id={`no-${currentQuestionIndex}`}
                    name={`answer-${currentQuestionIndex}`}
                    checked={currentAnswer === "NO"}
                    onChange={() => handleAnswerChange("NO")}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={`no-${currentQuestionIndex}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    No
                  </label>
                </div>
              </fieldset>
            </div>

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
                <div className="text-black">
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={currentAnswer === undefined || isEvaluating}
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
                  disabled={currentAnswer === undefined}
                  className="border"
                  color={"success"}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Logo UNERG como marca de agua */}
      <div className="absolute inset-0 top-0 pointer-events-none z-0 opacity-10">
        <img
          src="https://images.seeklogo.com/logo-png/26/2/unerg-logo-png_seeklogo-265623.png"
          alt="UNERG Logo"
          className="max-w-xs md:max-w-sm"
        />
      </div>
    </div>
  );
};

export default QuizPage;
