function createAgeTrial() {
  return {
    type: jsPsychSurveyText,
    questions: [
      { prompt: 'Please, indicate your age:', placeholder: '00', required: true }
    ],
    data: {
      task: 'Age'
    }
  };
}
