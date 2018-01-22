const chai=require('chai');
const assert=chai.assert;

const TodoItem=require('../scripts/models/todoItem.js');
const Todo=require('../scripts/models/todo.js');
const User=require('../scripts/models/user.js');

describe('User',()=>{
  beforeEach(()=>{
    user = new User("john",'john','john')
  })

  describe('# nameOfUser',()=>{
    it('should return name of the user',()=>{
      assert.equal(user.nameOfUser,'john');
    })
  })


  describe('# addNewTodo()',()=>{
    it('add new todo and increment totalTodos to 1',()=>{
      user.addNewTodo('title_1','description_1');
      let expectedTodos=[new Todo('title_1','description_1',[],1)];
      assert.deepEqual(user.getTodos,expectedTodos);
      assert.equal(user.totalTodos,1);
    });
  })

  describe('# getTitlesAndKey()',()=>{
    it('should return title & key of all todos',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      let expected = [{title:'title_1', key:1},{title:'title_2', key:2}];
      assert.deepEqual(user.getTitlesAndKey(),expected);
    })
  })

  describe('# getTodo()',()=>{
    it('return specific todo for valid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.deepEqual(user.getTodo(1),new Todo('title_1','description_1',[],1));
    })
    it('return undefiend for invalid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.isUndefined(user.getTodo(10));
    })
  })

  describe('# getTodoTitle()',()=>{
    it('return todo title for valid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.equal(user.getTodoTitle(1),'title_1');
    })
    it('return undefined for invalid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.isUndefined(user.getTodoTitle(10));
    })
  })
  describe('# getTodoDescription()',()=>{
    it('return todo description for valid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.equal(user.getTodoDescription(1),'description_1');
    })
    it('return undefined for invalid key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      assert.isUndefined(user.getTodoDescription(10));
    })
  })

  describe('# addTodoItems()',()=>{
    it('add todo items for valid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let addItemStatus1=user.addTodoItem(1,'new item 1',false);
      let addItemStatus2=user.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      expectedTodo1.addItem('new item 1',false);
      expectedTodo1.addItem('new item 2',true);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos=[expectedTodo1,expectedTodo2];
      assert.deepEqual(user.getTodos,expectedTodos);
    })
    it('donot add todo items for invalid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let invalidTodoKey=10;
      let addItemStatus1=user.addTodoItem(invalidTodoKey,'new item 1',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos=[expectedTodo1, expectedTodo2];
      assert.deepEqual(user.getTodos,expectedTodos);
    })
    it('donot add todo items for valid todo key and empty item text',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let addItemStatus1=user.addTodoItem(1,'',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos=[expectedTodo1, expectedTodo2];
      assert.deepEqual(user.getTodos,expectedTodos);
    })
    it('donot add todo items for invalid todo key and empty item text',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let invalidTodoKey=10;
      let addItemStatus1=user.addTodoItem(invalidTodoKey,'',false);
      assert.isNotOk(addItemStatus1);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let expectedTodo2=new Todo('title_2','description_2',[],2);
      let expectedTodos=[expectedTodo1, expectedTodo2];
      assert.deepEqual(user.getTodos,expectedTodos);
    })
  })

  describe('# getTodoItems()',()=>{
    it('return todo items for valid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let addItemStatus1=user.addTodoItem(1,'new item 1',false);
      let addItemStatus2=user.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let expectedTodoItem1=new TodoItem('new item 1',1,false);
      let expectedTodoItem2=new TodoItem('new item 2',2,true);
      let expectedTodoItems={1:expectedTodoItem1, 2:expectedTodoItem2};
      assert.deepEqual(user.getTodoItems(1),expectedTodoItems);
    })
    it('return undefined for invalid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let addItemStatus1=user.addTodoItem(1,'new item 1',false);
      let addItemStatus2=user.addTodoItem(1,'new item 2',true);
      assert.isOk(addItemStatus1);
      assert.isOk(addItemStatus2);
      let invalidKey=10;
      assert.isUndefined(user.getTodoItems(invalidKey));
    })
  })

  describe('# removeTodo',()=>{
    it('remove todo for valid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let expectedTodos=[
        new Todo('title_1','description_1',[],1),
        new Todo('title_2','description_2',[],2)
      ];
      assert.deepEqual(user.getTodos,expectedTodos);
      let removeTodoStatus=user.removeTodo(1);
      assert.isOk(removeTodoStatus);
      let expectedModifiedTodos=[new Todo('title_2','description_2',[],2)];
      assert.equal(user.totalTodos,1);
      assert.deepEqual(user.getTodos,expectedModifiedTodos);
    })
    it('do not remove todo for invalid todo key',()=>{
      user.addNewTodo('title_1','description_1');
      user.addNewTodo('title_2','description_2');
      assert.equal(user.totalTodos,2);
      let expectedTodos=[
        new Todo('title_1','description_1',[],1),
        new Todo('title_2','description_2',[],2)
      ];
      assert.deepEqual(user.getTodos,expectedTodos);
      let invalidKey=10;
      let removeTodoStatus=user.removeTodo(invalidKey);
      assert.isNotOk(removeTodoStatus);
      assert.equal(user.totalTodos,2);
      assert.deepEqual(user.getTodos,expectedTodos);
    })
  })

  describe('# addSessionId',()=>{
    it('Should add sessionId to user',()=>{
      user.addSessionId(1001);
      assert.equal(user.sessionId,1001);
    })
  })

  describe('# isSameSessionID',()=>{
    it('Should return true for same sessionId',()=>{
      user.addSessionId(1001);
      assert.isOk(user.isSameSessionID(1001));
    })
    it('Should return false for wrong sessionId',()=>{
      user.addSessionId(1001);
      assert.isNotOk(user.isSameSessionID(1002));
    })
  })

  describe('# removeTodoItem()',()=>{
    it('should remove todo item from specific todo for valid todo key and valid item key',()=>{
      user.addNewTodo('title_1','description_1',["item1","item2","item3"]);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      assert.isOk(user.removeTodoItem(1,3));
      assert.isUndefined(user.getTodo(1).items[3]);
    })
    it('should return false for invalid todoKey',()=>{
      user.addNewTodo('title_1','description_1',["item1","item2","item3"]);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let invalidTodoKey=2;
      assert.isNotOk(user.removeTodoItem(invalidTodoKey,3));
    })
    it('should return false for valid todoKey and invalid item key',()=>{
      user.addNewTodo('title_1','description_1',["item1","item2","item3"]);
      let expectedTodo1=new Todo('title_1','description_1',[],1);
      let invalidItemKey=4;
      assert.isNotOk(user.removeTodoItem(1,invalidItemKey));
    })
  })
})
