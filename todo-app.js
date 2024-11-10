(function() {
  let todoArr = [];

  // сохраняем данные в локал сторидж
  function saveToLocalStorage(listName, data) {
    localStorage.setItem(listName, JSON.stringify(data));
  }

  // читаем данные из локал сторидж
  function readFromLocalStorage(listName) {
    const data = localStorage.getItem(listName);
    return data ? JSON.parse(data) : [];
  }

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    // создаем новый элемент <h2>
    let appTitle = document.createElement('h2');
    // задаем новое содержимое для HTML элемента <h2> из параметра функции
    appTitle.innerHTML = title;
    // возвращаем заголовок приложения
    return appTitle;
  }

  // создаем и возвращаем форму для создания дел
  function createTodoItemForm() {
    // создаем новый элемент - <form>
    let form = document.createElement('form');
    // создаем новый элемент - <input>
    let input = document.createElement('input');
    // создаем обертку для кнопок - элемент <div>
    let buttonWrapper = document.createElement('div');
    // создаем новый элемент - <button>
    let button = document.createElement('button');

    // задаем классы элементу <form>
    form.classList.add('input-group', 'mb-3');
    // задаем класс элементу <input>
    input.classList.add('form-control');
    // добавляем placeholder для <input>
    input.placeholder = 'Введите название нового дела';
    // задаем классы обертке для кнопок
    buttonWrapper.classList.add('input-group-append');
    // задаем классы элементу <button>
    button.classList.add('btn', 'btn-primary');
    // добавляем текстовое содержимое в <button>
    button.textContent = 'Добавить дело';
    button.disabled = input.value === '';

    // помещаем <button> в обертку для кнопок
    buttonWrapper.append(button);
    // помещаем <input> в <form>
    form.append(input);
    // помещаем обертку для кнопок вместе с кнопкой в <form>
    form.append(buttonWrapper);

    // Задание 8.2 у кнопки в форме устанавливаем атрибут disabled, когда поле ввода пустое
    function disableButton() {
      if (input.value.trim(' ') === '') {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    }
    disableButton();
    input.addEventListener('input', disableButton);

    // возвращаем форму, инпут и кнопку
    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    // создаем пустой список
    let list = document.createElement('ul');
    // задаем списку класс
    list.classList.add('list-group');
    // возвращаем список
    return list;
  }

  // создаем и возвращаем элементы списка, кнопки выполнения и удаления
  // Задание 8.1.3
  function createTodoItem(todo) {
    // создаем элемент <li>
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    // для этого создаем див обертку для кнопок
    let buttonGroup = document.createElement('div');
    // создаем кнопку выполнения дела
    let doneButton = document.createElement('button');
    // и кнопку удаления дела
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    // задаем для элемента списка текстовое содержимое из параметра функции
    item.textContent = todo.name;

    // задаем классы для обертки кнопок выполнения и удаления
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    // задаем классы для кнопки выполнения
    doneButton.classList.add('btn', 'btn-success');
    // пишем текстовое содержимое кнопки выполнения
    doneButton.textContent = 'Готово';
    // задаем классы для кнопки удаления
    deleteButton.classList.add('btn', 'btn-danger');
    // пишем текстовое содержимое кнопки удаления
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  // помещаем все созданные ранее элементы в единый контейнер
  function createTodoApp(container, title = 'Список дел', listName) {
    // загрузить существующие задачи
    todoArr = readFromLocalStorage(listName);
    // создаем новую переменную, значение которого - результат выполнения функции - <h2>
    let todoAppTitle = createAppTitle(title);
    // задаем другую переменную, значение которого - результат выполнения функции, создающей форму для вненсения списка дел - <form> со всеми вложенными элементами
    let todoItemForm = createTodoItemForm();
    // создаем еще одну переменную, значение которого - <ul> с элементами <li>, как результат выполнения функции
    let todoList = createTodoList();

    // помещаем внутрь контейнера:
    // <h2>
    container.append(todoAppTitle);
    // <form> + вложенные в нее дочерние элементы
    container.append(todoItemForm.form);
    // <ul> с <li>
    container.append(todoList);

    // отрисовываем задачи
    todoArr.forEach(todo => {
      let todoItem = createTodoItem(todo);
      if (todo.done) {
        todoItem.item.classList.add('list-group-item-success');
      }

      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        todo.done = !todo.done;
        // сохраняем изменения
        saveToLocalStorage(listName, todoArr);
      });

      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          for (let i = 0; i < todoArr.length; i++) {
            if (todoArr[i].id === todo.id) {
              todoArr.splice(i, 1);
            }
          }
          saveToLocalStorage(listName, todoArr);
          console.log(todoArr);
        }
      });
      console.log(todoArr);
      todoList.append(todoItem.item);
    });

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
      // эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      //Задание 8.3 Каждое созданное дело должно храниться в массиве (находится в корне программы) дел в виде объекта
      let todoObj = {
        id: Math.round(Math.random() * 1e6),
        name: todoItemForm.input.value,
        done: false,
      };

      todoArr.push(todoObj);

      console.log(todoArr);

      // добавляем новую переменную, которая будет создавать <li> - новое дело - с текстовым содержимым, введенным в инпут
      // Задание 8.1.3
      let todoItem = createTodoItem(todoObj);



      // добавляем обработчики на кнопки
      // при клике мышью на кнопку "Готово",
      todoItem.doneButton.addEventListener('click', function() {
        // дело закрашивается в зеленый цвет, за счет добавления в <li> класса из библиотеки Бутстрап
        todoItem.item.classList.toggle('list-group-item-success');
        // Задание 8.4 нанаходим в массиве объектов нужный объект и меняем параметр done на противоположный
        for (let i = 0; i < todoArr.length; i++) {
          if (todoArr[i].id === todoObj.id) {
            todoObj.done = true;
          }
        }
        // сохраняем изменения в локал сторидж
        saveToLocalStorage(listName, todoArr);
      });
      // при клике мышью на кнопку "Удалить",
      todoItem.deleteButton.addEventListener('click', function() {
        // появится окно подтверждения, и только после подтверждения
        if (confirm('Вы уверены?')) {
          // дело удалится
          todoItem.item.remove();

          // Задание 8.4 удаляем объект из массива дел
          for (let i = 0; i < todoArr.length; i++) {
            if (todoArr[i].id === todoObj.id) {
              todoArr.splice(i, 1);
            }
          }
          // сохраняем изменения в локал сторидж
          saveToLocalStorage(listName, todoArr);
          console.log(todoArr);
        }
      });

      // создаем и добавляем в список новое дело с названием из поля для ввода
      // помещаем новый <li> в <ul>
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';

      // сохраняем изменения в локал сторидж
      saveToLocalStorage(listName, todoArr);
    });
  }

  // регистрируем функцию createToDoApp в глобальном объекте window, чтобы получить доступ к этой функции из других скриптов
  // для этого возьмем объект window, создадим в нем свойство createToDoApp и в него приравняем саму функцию createToDoApp
  window.createTodoApp = createTodoApp;
}) ();
