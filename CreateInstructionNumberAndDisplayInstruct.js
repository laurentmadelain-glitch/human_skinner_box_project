function CreateInstructionNumberAndDisplayInstructions(jsPsych) {
  let instruction_number = 3;

  return {
    timeline: [
      {
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
        },
        on_finish: function (data) {
          const code = data.response?.participant_code ?? '';
          const lastDigit = parseInt(code.slice(-1), 10);
          if ([1, 2].includes(lastDigit)) {
            instruction_number = lastDigit;
          } else {
            instruction_number = 3;
          }
          // Ajoute une propriété globale pour réutilisation éventuelle
          jsPsych.data.addProperties({ instruction_number });
        }
      },
      {
        type: jsPsychInstructions,
        pages: function () {
                  return [ getInstructionPage(instruction_number) ];
                },
        button_label_next: "Continue",
        button_label_previous: "Retour",
        show_clickable_nav: true
      }
    ]
  };
}
