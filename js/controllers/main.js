'use strict';

angular.module('todoListApp')
.controller('mainCtrl', ['$scope', 'Upload', '$timeout', 'dataService', function($scope, Upload, $timeout, dataService) {

  dataService.getTodos(function(response) {
    $scope.todos = response.data;
  });

  $scope.addImportedTodos = function(newTodos, updatedTodos) {
    for(var i = 0; i < newTodos.length; i++) {
      $scope.todos.unshift(newTodos[i]);
    }

    for(var i = 0; i < $scope.todos.length; i++) {
      for(var j = 0; j < updatedTodos.length; j++) {
        if($scope.todos[i].id === updatedTodos[j].id) {
          $scope.todos[i] = updatedTodos[j];
        }
      }
    }

  }

  $scope.uploadCSV = function(file) {
    file.upload = Upload.upload({
      url: "http://localhost:3000/todos/import",
      method: "POST",
      data: {todo_import: {file: file}},
    });

    file.upload.then(function(response) {
      console.log("success")
      console.log(response.data);
      $scope.addImportedTodos(response.data.new_todos, response.data.updated_todos);
    }, function(response) {
      console.log("error")
      console.log(response.data)
    });
  }

  $scope.editing = function(index) {
    $scope.todos[index].editing = true;

    for(var i = 0; i < $scope.todos.length; i++) {
      if(i !== index) {
        $scope.todos[i].editing = false;
      }
    }
  };

  $scope.addTodo = function() {
    var todo = {
      name: "Sample todo."
    };
    dataService.addTodo(todo, function(todo) {
      console.log(todo);
      $scope.todos.unshift(todo.data);
    });
  };

  $scope.deleteTodo = function(todo, index) {
    dataService.deleteTodo(todo, function() {
      console.log("The " + todo.name + " todo has been deleted!");
      $scope.todos.splice(index, 1);
    });
  };

  $scope.saveTodos = function() {
    var filteredTodos = $scope.todos.filter(function(todo) {
      if(todo.edited) {
        return todo;
      }
    });

    dataService.saveTodos(filteredTodos, function() {
      $scope.todos.forEach(function(todo) {
        todo.edited = false;
      });
      console.log(filteredTodos.length + " has been saved!");
    });
  }

  $scope.markAsCompleted = function(todo) {
    dataService.toggleCompleted(todo, function(response) {
      for(var i = 0; i < $scope.todos.length; i++) {
        if($scope.todos[i].id === todo.id) {
          $scope.todos[i] = response.data;
        }
      }
    });
  };
}]);
