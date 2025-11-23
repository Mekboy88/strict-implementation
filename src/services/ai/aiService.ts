export const callAIService = async (messages: any[]) => {
  // Placeholder for AI service integration
  return {
    response: "AI response placeholder",
    success: true
  };
};

export const extractAIResponseText = (response: any) => {
  return response.response || "";
};
