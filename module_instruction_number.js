function createInstructionNumber() {
  return {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: "Veuillez entrer le numéro qui vous a été attribué (ex: 123456) :",
        placeholder: "123456",
        required: true,
        name: 'participant_code'
      }
    ],
    data: {
      task: 'enter_participant_code'
    }
  };
}
