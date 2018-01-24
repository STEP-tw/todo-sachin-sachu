const removeListener=function(){
  let body = document.querySelector('body');
  body.removeEventListener('change',showSaveButton);
}

const createRequest = function(method,url,callBack,data=""){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (this.readyState == 4) {
      callBack(this.responseText);
    }
  }
  req.open(method,url);
  req.send(data);
}

const getStatus = function(){
  let checkBoxes = document.querySelectorAll("input");
  let statusChanges = "";
  checkBoxes.forEach((i)=>statusChanges+=`${i.value}=${i.checked}&`);
  return statusChanges.substr(0,statusChanges.length-1);
}

const sendData = function(){
  let url = window.location.href;
  let todoId = url.split("/").slice(-1)[0];
  let statusChanges = getStatus();
  createRequest("POST",`/UPDATESTATUS/${todoId}`,null,statusChanges);
}

const showSaveButton=function(){
  let body=document.querySelector('body');
  let saveButton=document.createElement('button');
  saveButton.innerText='save changes';
  saveButton.addEventListener('click',sendData);
  body.appendChild(saveButton);
  removeListener();
}

const createTextArea = function(name,value,requiredFlag=false){
  let editBox = document.createElement("textArea");
  editBox.name = name;
  editBox.value = value;
  editBox.required = requiredFlag;
  return editBox;
}

const createTextBox = function(name,value,requiredFlag){
  let textBox = document.createElement("input");
  textBox.type = "text";
  textBox.name = name;
  textBox.value = value;
  textBox.required = requiredFlag;
  return textBox;
}

const getTitleEditingField= function(){
  let todoTitle = document.getElementById("todoTitle")
  let titleText = todoTitle.innerText;
  let editBox = createTextArea("title",titleText,true);
  todoTitle.replaceWith(editBox)
}

const getDescEditingField = function () {
  let todoDescription = document.getElementById("todoDescription");
  let descriptionText = todoDescription.innerText;
  let editBox = createTextArea("description",descriptionText,true);
  todoDescription.replaceWith(editBox);
}

const getItemsEditingFields = function(){
  let items=document.querySelectorAll('li');
  items.forEach(item=>{
    let editbox=createTextBox(item.id,item.innerText,true);
    item.replaceChild(editbox,item.childNodes[1]);
  });
}

const getEditingOption = function(){
  getTitleEditingField();
  getDescEditingField();
  getItemsEditingFields();
  // removeEditButton();
  addSubmitButton();
}


const addListener=function(){
  body = document.querySelector('body');
  body.addEventListener('change',showSaveButton);
}
