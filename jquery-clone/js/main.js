$(document).ready(function () {
  console.log('ready')
  $(document).on('click', '.next', function () {
    console.log('click next')
    const currentImg = $('.active')
    const nextImg = currentImg.next()

    if (nextImg.length) {
      currentImg.removeClass('active').css('z-index', -10)
      nextImg.addClass('active').css('z-index', 10)
    }
  })

  $('.prev').on('click', function () {
    console.log('click prev')
    const currentImg = $('.active')
    const prevImg = currentImg.prev()

    if (prevImg.length) {
      currentImg.removeClass('active').css('z-index', -10)
      prevImg.addClass('active').css('z-index', 10)
    }
  })
})

$.get({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  success: (data) => {
    console.log('First success', data)
  },
})
  .done((data) => console.log('Second success', data))
  .fail((e) => console.error('Fail', e))
  .always(() => console.log('Always'))
