/* getInstructionPage(instruction_number)
   Renvoie la page d’instructions correspondante (1 = explicite, 2 = intermédiaire, 3 = minimale)
*/
function getInstructionPage(instruction_number) {

  // --- PROPOSITION 1 : version la plus explicite ---
  if (instruction_number === 1) {
    return `
      <div style="text-align:left; max-width:750px; margin:auto; font-size:18px; line-height:1.45;">
        <p>Cette étude porte sur la façon dont les personnes arrivent à déduire des relations entre différents évènements.</p>
        <p>Votre but est de gagner le plus de points possible. Vous pouvez gagner des points en cliquant sur le rond rouge qui apparaîtra à l’écran.</p>
        <p>Lorsque le rond rouge apparaît dans l’ensemble de cercles affiché à droite, la règle pour gagner des points peut être différente de celle qui s’applique lorsqu’il apparaît dans l’ensemble affiché à gauche.</p>
        <p>Selon l’ensemble dans lequel le rond rouge apparaît, la règle pour gagner des points peut, par exemple :</p>
        <ul>
          <li>supposer de cliquer plusieurs fois,</li>
          <li>supposer de cliquer très rapidement,</li>
          <li>ou supposer d’attendre un certain temps entre deux clics.</li>
        </ul>
        <p>Vous devrez faire des essais pour comprendre quelle règle s’applique dans chaque situation et comment gagner des points.</p>
        <p>Vous serez averti chaque fois que vous gagnez des points.</p>
        <p>Au début, il est normal de cliquer au hasard, car vous ne connaissez pas encore la règle. Progressivement, vous comprendrez quelles actions permettent d’obtenir le plus de points.</p>
        <p><strong>Lorsque vous êtes prêt.e, cliquez sur le bouton "Continue".</strong></p>
      </div>
    `;
  }

  // --- PROPOSITION 2 : version intermédiaire ---
  if (instruction_number === 2) {
    return `
      <div style="text-align:left; max-width:750px; margin:auto; font-size:18px; line-height:1.45;">
        <p>Cette étude porte sur la façon dont les personnes arrivent à déduire des relations entre différents évènements.</p>
        <p>Votre but est de gagner le plus de points possible. Vous pouvez gagner des points en cliquant sur le rond rouge qui apparaîtra à l’écran.</p>
        <p>Lorsque le rond rouge apparaît dans l’ensemble affiché à droite, la règle pour gagner des points peut être différente de celle qui s’applique lorsqu’il apparaît dans l’ensemble affiché à gauche. La règle dépend donc de la position de l’ensemble dans lequel le rond apparaît.</p>
        <p>Vous devrez explorer la tâche pour comprendre comment fonctionnent les règles et comment obtenir des points.</p>
        <p>Vous serez averti chaque fois que vous gagnez des points.</p>
        <p>Au début, il est normal de cliquer au hasard. Progressivement, vous identifierez les actions qui permettent d’obtenir des points.</p>
        <p><strong>Lorsque vous êtes prêt.e, cliquez sur le bouton "Continue".</strong></p>
      </div>
    `;
  }

  // --- PROPOSITION 3 : version minimaliste ---
  return `
    <div style="text-align:left; max-width:750px; margin:auto; font-size:18px; line-height:1.45;">
      <p>Cette étude porte sur la façon dont les personnes arrivent à déduire des relations entre différents évènements.</p>
      <p>Votre but est de gagner des points en cliquant sur le rond rouge.</p>
      <p>Le rond peut apparaître dans l’ensemble situé à gauche ou dans celui situé à droite. La règle pour gagner des points change selon l’endroit où il apparaît.</p>
      <p>Vous devrez essayer différentes actions pour découvrir comment obtenir des points.</p>
      <p><strong>Lorsque vous êtes prêt.e, cliquez sur le bouton "Continue".</strong></p>
    </div>
  `;
}
