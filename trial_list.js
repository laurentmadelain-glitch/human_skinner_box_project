const trial_list = [
  {
    trial: 0,
    type: "vi",
    interval_min: 30_000,
    interval_max: 30_000,
    block_duration: 600_000,
    key_id: "center"
  },
  // {
  //   trial: 1,
  //   type: "vi",
  //   interval_min: 30_000,
  //   interval_max: 30_000,
  //   block_duration: 40_000,
  //   key_id: "left"
  // },
  // {
  //   trial: 2,
  //   type: "vi",
  //   interval_min: 5_000,
  //   interval_max: 5_000,
  //   block_duration: 140_000,
  //   key_id: "right"
  // },
  // {
  //   trial: 3,
  //   type: "vi",
  //   interval_min: 30_000,
  //   interval_max: 30_000,
  //   block_duration: 140_000,
  //   key_id: "left"
  // },
  {
    trial: 1,
    type: "extinction",
    block_duration: 60_000,
    key_id: "center"
  },
  {
    trial: 2,
    type: "session_end",
    block_duration: 1000,
    key_id: "center"
  }
];







// const trial_list = [
//   // VI 1–2 s → clé droite
//   {
//     trial: 1,
//     type: "interval",
//     interval_min: 1500,
//     interval_max: 3000,
//     block_duration: 15_000,
//     key_id: "center"
//   },

//   // VR 3 → clé gauche
//   {
//     trial: 2,
//     type: "ratio",
//     ratio_min: 3,
//     ratio_max: 4,
//     block_duration: 15_000,
//     key_id: "left"
//   },

//   // VI 0.5–1 s → clé droite
//   // {
//   //   trial: 3,
//   //   type: "vi",
//   //   interval_min: 100,
//   //   interval_max: 100,
//   //   block_duration: 500,
//   //   key_id: "right"
//   // }

//   // // VR 4 → clé gauche
//   // {
//   //   trial: 4,
//   //   type: "ratio",
//   //   ratio_min: 3,
//   //   ratio_max: 10,
//   //   block_duration: 5_000,
//   //   key_id: "left"
//   // }

//   {
//   trial: 3,
//   type: "session_end",
//   block_duration: 1000,
//   key_id: "center"
// }
// ];

// //window.trial_list = trial_list; // exposition globale
