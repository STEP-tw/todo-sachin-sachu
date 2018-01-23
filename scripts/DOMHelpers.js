const createCheckbox=function(value,status){
  let checkedStatus = status != "true" || "checked";
    return checkbox=`<input type="checkbox" value=${value} ${checkedStatus}></input>`;
}

const createListItem=function(id,innerText){
  let listItem=`<li id'=${id}>CHECKBOX${innerText}</li>`
  return listItem;
}

const insertChild = function(text,textToreplace,textToInsert,){
  return text.replace(textToreplace,textToInsert);
}

exports.createCheckbox=createCheckbox;
exports.createListItem=createListItem;
exports.insertChild=insertChild;
