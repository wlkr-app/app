import flatpickr from "flatpickr";

$(document).ready(() => {



  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Yay, loaded :)');
  }, false);

  $('.toggle').on('click', function () {
    $('.container').stop().addClass('active');
  });

  $('.close').on('click', function () {
    $('.container').stop().removeClass('active');
  });

  document.querySelector('.uploadpic').addEventListener('click', () => {
    console.log('test')
  })

  function preview_image(event) 
  {
   var reader = new FileReader();
   reader.onload = function()
   {
    var output = document.getElementById('output_image');
    output.src = reader.result;
   }
   reader.readAsDataURL(event.target.files[0]);
  }



  // document.querySelector('#signupdone').addEventListener('click', () => {
  //   setTimeout(() => {
  //     alert("Hello");
  //   }, 1000);
  //   console.log('test')
  // })










});