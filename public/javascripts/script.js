const showCells = document.querySelectorAll('.time-entry');

function openModal(e) {
  console.log("hello");
  console.log(e);
};


showCells.forEach(showCell => showCell.addEventListener('click', openModal));