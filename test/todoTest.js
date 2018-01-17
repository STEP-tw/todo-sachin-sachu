let chai=require('chai');
let assert=chai.assert;
let path=fileName=>'../webapp/lib/todo/'+fileName;
let Todo=require(path('todo.js'));
let TodoItem=require(path('todoItem.js'))

describe('Todo',()=>{
  describe('-> getSpecificItem()',()=>{
    it('* return specific todoList from Todo when valid item key is given',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let specificItemKey=2;
      assert.deepEqual(todo.getSpecificItem(specificItemKey),new TodoItem('item_2',2));
    })
    it('* return undefined when invalid item key is given',()=>{
      let todoTexts=['validItem_1','validItem_2','validItem_3','validItem_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let invalidKey=10;
      assert.isUndefined(todo.getSpecificItem(invalidKey));
    })
    it('* return undefined when todoLists are empty',()=>{
      let todo=new Todo('todo1','sample description',[]);
      let todoKey=1;
      assert.isUndefined(todo.getSpecificItem(todoKey));
    })
  })

  describe('-> removeSpecificItem()',()=>{
    it('* remove specific item from todo when valid key is given',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let expectedItems={
        1:new TodoItem('item_1',1),
        2:new TodoItem('item_2',2),
        4:new TodoItem('item_4',4)
      };
      let removalStatus=todo.removeSpecificItem(3);
      assert.deepEqual(todo.getTodoList,expectedItems)
      assert.isOk(removalStatus);
    })
    it('* do not modify todoList when invalid key is given',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      let removalStatus=todo.removeSpecificItem('invalidTodoList');
      assert.deepEqual(todo,expectedTodo);
      assert.isNotOk(removalStatus);
    })
    it('* do not modify todoList when todoList is empty',()=>{
      let todo=new Todo('todo1','sample description',[]);
      let expectedTodo=new Todo('todo1','sample description',[]);
      let removalStatus=todo.removeSpecificItem(1);
      assert.isNotOk(removalStatus);
      assert.deepEqual(todo,expectedTodo);
    })
  })

  describe('-> addItem()',()=>{
    it('* add new item when a non empty text is given',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let newItem='new_item';
      let modifyStatus=todo.addItem(newItem);
      let expectedLists=['item_1','item_2','item_3','item_4',newItem];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isOk(modifyStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* do not add new item when empty text is given',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let newItem='';
      let modifyStatus=todo.addItem(newItem);
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isNotOk(modifyStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* add new list when todoLists are empty',()=>{
      let todo=new Todo('todo1','sample description',[]);
      let newItem='new_item';
      let modifyStatus=todo.addItem(newItem);
      let expectedLists=[newItem];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isOk(modifyStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* do not add new list when todoLists are empty and text is empty',()=>{
      let todo=new Todo('todo1','sample description',[]);
      let newItem='';
      let modifyStatus=todo.addItem(newItem);
      let expectedTodo=new Todo('todo1','sample description',[]);
      assert.isNotOk(modifyStatus);
      assert.deepEqual(todo,expectedTodo);
    })
  })

  describe('-> editItem()',()=>{
    it('* edit item text when item key and new text is valid',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let editStatus=todo.editItem(2,'modified_item_2');
      let expectedLists=['item_1','modified_item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isOk(editStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* do not modify item when item key is valid and new text is empty',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let editStatus=todo.editItem(2,'');
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isNotOk(editStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* do not modify item when item key is invalid and new text is empty',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let editStatus=todo.editItem(10,'');
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isNotOk(editStatus);
      assert.deepEqual(todo,expectedTodo);
    })
    it('* do not modify item when itemKey is invalid and new text is not empty',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let editStatus=todo.editItem(10,'new_list_text');
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isNotOk(editStatus);
      assert.deepEqual(todo,expectedTodo);
    })
  })

  describe('-> markAsDone()',()=>{
    it('* mark as done for valid item key',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let markAsDoneStatus=todo.markAsDone(2);
      assert.isOk(markAsDoneStatus);
      assert.deepEqual(todo.getSpecificItem(2),new TodoItem('item_2',2,true));
    })
    it('* do not mark as done for invalid item key',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let markAsDoneStatus=todo.markAsDone(10);
      let expectedLists=['item_1','item_2','item_3','item_4'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isNotOk(markAsDoneStatus);
      assert.deepEqual(todo,expectedTodo);
    })
  })

  describe('-> markAsUndone()',()=>{
    it('* mark as undone for valid item key',()=>{
      let todoTexts=['item_1','item_2','item_3','item_4'];
      let todo=new Todo('todo1','sample description',todoTexts);
      let markAsDoneStatus=todo.markAsDone(2);
      assert.isOk(markAsDoneStatus);
      assert.deepEqual(todo.getSpecificItem(2),new TodoItem('item_2',2,true));
      let markAsUndoneStatus=todo.markAsUndone(2);
      assert.isOk(markAsUndoneStatus);
      assert.deepEqual(todo.getSpecificItem(2),new TodoItem('item_2',2,false));
    })
    it('* do not mark as undone for invalid item key',()=>{
      let todoTexts=['item_1','item_2','item_3'];
      let todo=new Todo('todo1','sample description',todoTexts);
      assert.isOk(todo.markAsDone(1));
      assert.isOk(todo.markAsDone(2));
      assert.isOk(todo.markAsDone(3));
      let expectedLists=['item_1','item_2','item_3'];
      let expectedTodo=new Todo('todo1','sample description',expectedLists);
      assert.isOk(expectedTodo.markAsDone(1));
      assert.isOk(expectedTodo.markAsDone(2));
      assert.isOk(expectedTodo.markAsDone(3));
      let markStatus=todo.markAsUndone(10);
      assert.isNotOk(markStatus);
      assert.deepEqual(todo,expectedTodo);
      let mark
    })
  })
})
