const formBlock = {
  type: jsPsychSurveyHtmlForm,
  preamble: '<h3>Informations générales</h3>',
  html: `
    <label for="age">Âge :</label>
    <input type="number" name="age" required><br><br>

    <label for="gender">Genre :</label>
    <select name="gender" required>
      <option value="">Sélectionner</option>
      <option value="male">Homme</option>
      <option value="female">Femme</option>
      <option value="other">Autre</option>
    </select><br><br>

    <label for="email">Adresse e-mail :</label>
    <input type="email" name="email"><br><br>
  `,
  button_label: "Continuer"
};
