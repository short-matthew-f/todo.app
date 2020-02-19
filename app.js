let pendingTodos, completedTodos, expiredTodos, allTodos;

$('.left-drawer').click(function (event) {
  if ($(event.target).hasClass('left-drawer')) {
    $('#app').toggleClass('drawer-open');
  }
});

$('.add-todo').click(function () {
  $('.modal').addClass('open')
})

$('.remove-completed').click(function () {
  allTodos = allTodos.filter(function (todo) {
    return !todo.isComplete
  });

  storeData();
  splitTodos();
  drawTodos();
});

$('.remove-expired').click(function () {
  allTodos = allTodos.filter(function (todo) {
    return isCurrent(todo);
  })

  storeData();
  splitTodos();
  drawTodos();
})

$('.create-todo').click(function (event) {
  event.preventDefault();

  const form = $('.todo-form');

  const newTodo = createTodoFromForm( form );

  allTodos.unshift( newTodo )
  form.trigger('reset'); // or form[0].reset();

  storeData();
  splitTodos();
  drawTodos();

  $('.modal').removeClass('open');
})

$('.cancel-create-todo').click(function (event) {
  event.preventDefault();

  $('.modal').removeClass('open');
})

function createTodoFromForm( form ) {
  return {
    title: form.find('#todo-title').val(),
    dueDate: form.find('#todo-due-date').val(),
    description: form.find('#todo-description').val(),
    isComplete: false,
  };
}

function createElementFromTodo( todo ) {
  const todoEl = $('<div class="todo">');
  const todoHeader = $('<h3>').append(
    $('<span class="title">').text( todo.title ),
    $('<span class="due-date">').text( todo.dueDate )
  );
  const todoDescription = $('<pre>').append( todo.description.trim() );
  const todoActions = $(`<footer class="actions">
    ${ todo.isComplete ? '' : '<button class="action complete">Complete</button>' }
    <button class="action delete">Delete</button>
  </footer>`);

  todoEl.append(todoHeader, todoDescription, todoActions);

  return todoEl;
}

$('main').on('click', '.action.complete', function () {
  const todoElement = $(this).closest('.todo');
  const todo = todoElement.data('todo');

  todo.isComplete = true;

  todoElement.slideUp(function () {
    $('.completed-todos').prepend(todoElement);
    todoElement.find('.action.complete').remove();
    todoElement.slideDown();

    storeData();
    splitTodos();
    drawTodos();
  });
});

$('main').on('click', '.action.delete', function () {
  const todoElement = $(this).closest('.todo');
  const todo = todoElement.data('todo');
  
  todoElement.slideUp();
  
  allTodos.splice(allTodos.indexOf( todo ), 1);
  storeData();
  splitTodos();
  drawTodos();
})

function storeData() {
  localStorage.setItem('allTodos', JSON.stringify(allTodos));
}

function retrieveData() {
  allTodos = JSON.parse(localStorage.getItem('allTodos')) || [];
}

function splitTodos() {
  pendingTodos = allTodos.filter(function (todo) {
    return !todo.isComplete && isCurrent(todo);
  });

  completedTodos = allTodos.filter(function (todo) {
    return todo.isComplete;
  });

  expiredTodos = allTodos.filter(function (todo) {
    return !todo.isComplete && !isCurrent(todo);
  });
}

function drawTodos() {
  $('main .content').empty();

  pendingTodos.forEach(function (todo) {
    $('.pending-todos').append( createElementFromTodo(todo).data('todo', todo) );
  });

  completedTodos.forEach(function (todo) {
    $('.completed-todos').append( createElementFromTodo(todo).data('todo', todo) );
  });

  expiredTodos.forEach(function (todo) {
    $('.expired-todos').append( createElementFromTodo(todo).data('todo', todo) );
  });
}

function isCurrent( todo ) {
  return Date.parse(todo.dueDate) > Date.now();
}

retrieveData();
splitTodos();
drawTodos();