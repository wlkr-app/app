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

  // document.querySelector('#signupdone').addEventListener('click', () => {
  //   setTimeout(() => {
  //     alert("Hello");
  //   }, 1000);
  //   console.log('test')
  // })










});