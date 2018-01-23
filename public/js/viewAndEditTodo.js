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


const addListener=function(){
  body = document.querySelector('body');
  body.addEventListener('change',showSaveButton);
}
