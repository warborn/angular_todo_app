'use strict';

angular.module('todoListApp')
.service('dataService', function($http) {
  this.getTodos = function(callback) {
    // $http.get('http://localhost:3000/todos.json')
    // .then(callback);

    $http.jsonp("http://localhost:3000/todos.js?callback=JSON_CALLBACK")
    .then(callback);
  };

  this.addTodo = function(todo, callback) {
    // var json = '{"todo": {"name": "' + todo.name + '"}}';
    $http.post("http://localhost:3000/todos", {todo: todo})
    .then(callback, function(response) {
        console.log(response);
    });
  }

  this.deleteTodo = function(todo, callback) {
    $http.delete("http://localhost:3000/todos/" + todo.id)
    .then(callback);
  };

  this.saveTodos = function(todos, callback) {
    for(var i = 0; i < todos.length; i++) {
      $http.patch("http://localhost:3000/todos/" + todos[i].id, {todo: todos[i]})
      .then(callback);
    }
  };

  this.toggleCompleted = function(todo, callback) {
    $http.patch("http://localhost:3000/todos/" + todo.id + "/completed")
    .then(callback);
  };

});
