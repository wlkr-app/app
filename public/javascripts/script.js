document.addEventListener('DOMContentLoaded', () => {

  console.log(':)');

}, false);

const flatpickr = require("flatpickr");

flatpickr("#walktime", {
  enableTime: true,
  dateFormat: "F, d Y H:i"
});

// document.querySelector('#walktime').flatpickr({
//   enableTime: true,
//   dateFormat: "F, d Y H:i"
// });

// console.log('adsasas')