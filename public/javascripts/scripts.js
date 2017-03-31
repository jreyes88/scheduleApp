// Modal script
$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

// Image slider
$(document).ready(function(){
  $('.slider').slider(
    {
      full_width: true,
      indicators: false
    }
  );
});

// Scrollspy
$(document).ready(function(){
  $('.scrollspy').scrollSpy();
});