const chai=require('chai');
const assert=chai.assert;

const TodoItem=require('../scripts/models/todoItem.js');
const Todo=require('../scripts/models/todo.js');
const Todos=require('../scripts/models/todos.js');

describe('Todos',()=>{
  describe('# addNewTodo()',()=>{
    it('add new todo and increment totalTodos to 1',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      let expectedObject={
        1:new Todo('title_1','description_1',[],1)
      };
      assert.deepEqual(todos.getTodos,expectedObject);
      assert.equal(todos.totalTodos,1);
    });
  })
  describe('# getTodo()',()=>{
    it('return specific todo for valid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.deepEqual(todos.getTodo(1),new Todo('title_1','description_1',[],1));
    })
    it('return undefiend for invalid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.isUndefined(todos.getTodo(10));
    })
  })

  describe('# getTodoTitle()',()=>{
    it('return todo title for valid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.equal(todos.getTodoTitle(1),'title_1');
    })
    it('return undefined for invalid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.isUndefined(todos.getTodoTitle(10));
    })
  })
  describe('# getTodoDescription()',()=>{
    it('return todo description for valid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.equal(todos.getTodoDescription(1),'description_1');
    })
    it('return undefined for invalid key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      assert.isUndefined(todos.getTodoDescription(10));
    })
  })

  describe('# addTodoItems()',()=>{
    it('add todo items for valid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let addItemStatus1=todos.addTodoItem(1,'new item 1',false);
      let addItemStatus2=todos.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      expectedTodo1.addItem('new item 1',false);
      expectedTodo1.addItem('new item 2',true);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos={1:expectedTodo1, 2:expectedTodo2};
      assert.deepEqual(todos.getTodos,expectedTodos);
    })
    it('donot add todo items for invalid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let invalidTodoKey=10;
      let addItemStatus1=todos.addTodoItem(invalidTodoKey,'new item 1',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos={1:expectedTodo1, 2:expectedTodo2};
      assert.deepEqual(todos.getTodos,expectedTodos);
    })
    it('donot add todo items for valid todo key and empty item text',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let addItemStatus1=todos.addTodoItem(1,'',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos={1:expectedTodo1, 2:expectedTodo2};
      assert.deepEqual(todos.getTodos,expectedTodos);
    })
    it('donot add todo items for invalid todo key and empty item text',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let invalidTodoKey=10;
      let addItemStatus1=todos.addTodoItem(invalidTodoKey,'',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos={1:expectedTodo1, 2:expectedTodo2};
      assert.deepEqual(todos.getTodos,expectedTodos);
    })
  })

  describe('# getTodoItems()',()=>{
    it('return todo items for valid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let addItemStatus1=todos.addTodoItem(1,'new item 1',false);
      let addItemStatus2=todos.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let expectedTodoItem1=new TodoItem('new item 1',1,false);
      let expectedTodoItem2=new TodoItem('new item 2',2,true);
      let expectedTodoItems={1:expectedTodoItem1, 2:expectedTodoItem2};
      assert.deepEqual(todos.getTodoItems(1),expectedTodoItems);
    })
    it('return undefined for invalid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let addItemStatus1=todos.addTodoItem(1,'new item 1',false);
      let addItemStatus2=todos.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let invalidKey=10;
      assert.isUndefined(todos.getTodoItems(invalidKey));
    })
  })

  describe('# removeTodo',()=>{
    it('remove todo for valid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let expectedTodos={
        1:new Todo('title_1','description_1',[],1),
        2:new Todo('title_2','description_2',[],2)
      };
      assert.deepEqual(todos.getTodos,expectedTodos);
      let removeTodoStatus=todos.removeTodo(1);
      assert.isOk(removeTodoStatus);
      let expectedModifiedTodos={
        2: new Todo('title_2','description_2',[],2)
      };
      assert.equal(todos.totalTodos,1);
      assert.deepEqual(todos.getTodos,expectedModifiedTodos);
    })
    it('do not remove todo for invalid todo key',()=>{
      let todos=new Todos();
      todos.addNewTodo('title_1','description_1');
      todos.addNewTodo('title_2','description_2');
      assert.equal(todos.totalTodos,2);
      let expectedTodos={
        1:new Todo('title_1','description_1',[],1),
        2:new Todo('title_2','description_2',[],2)
      };
      assert.deepEqual(todos.getTodos,expectedTodos);
      let invalidKey=10;
      let removeTodoStatus=todos.removeTodo(invalidKey);
      assert.isNotOk(removeTodoStatus);
      assert.equal(todos.totalTodos,2);
      assert.deepEqual(todos.getTodos,expectedTodos);
    })
  })
})
