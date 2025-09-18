function form_participant() {
  return {
    type: jsPsychSurveyMultiChoice,
    questions: [
      {
        prompt: "Please, indicate your gender:",
        options: ['Male', 'Female', 'Other'],
        required: true
      },
    ],
    data: {
      task: 'Gender'
    }
  };
}
