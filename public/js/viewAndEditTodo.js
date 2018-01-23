const removeListener=function(){
  let body = document.querySelector('body');
  body.removeEventListener('change',showSaveButton);
}

const showSaveButton=function(){
  let body=document.querySelector('body');
  let saveButton=document.createElement('button');
  saveButton.innerText='save changes';
  saveButton.onclick='sendData';
  body.appendChild(saveButton);
  removeListener();
}


const addListener=function(){
  body = document.querySelector('body');
  body.addEventListener('change',showSaveButton);
}
