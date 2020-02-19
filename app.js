$('.accordion').accordion({
  heightStyle: "fill",
  icons: false
});

$('.left-drawer').click(function (event) {
  if ($(event.target).hasClass('left-drawer')) {
    $('#app').toggleClass('drawer-open');
  }
});

$('.add-todo').click(function () {
  $('.modal').addClass('open')
})

$('.create-todo').click(function () {
  let form = $('.todo-form');
  console.log(form.serializeArray())
  $('.modal').removeClass('open')
})

$('.cancel-todo').click(function () {
  $('.modal').removeClass('open')
})