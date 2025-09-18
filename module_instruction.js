function createInstructionTrial() {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return "<p>This is the instruction. Please press A to start the task.</p>"
    },
    choices: ["a"],
  };
}