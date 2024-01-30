const btn_add = document.getElementById("btn_add");
const btn_update = document.getElementById("btn_update");
const btn_cleanForm = document.getElementById("btn_cleanForm");
const addPrForm = document.getElementById("addPrForm");


var _g_editTarget = {};
var _g_submitTarget = "";

function InitFormBtns() {  
    btn_update.addEventListener("click",()=>{
    _g_submitTarget = "update";
    btn_update.style.display = "none";
    btn_add.style.display = "block";
  });
  
  btn_add.addEventListener("click",()=>{
    _g_submitTarget = "add";
  });
  
  btn_cleanForm.addEventListener("click",()=>{
    addPrForm.reset();
  });
  
}
InitFormBtns();


function btn_edit_Init(btn,tr,th_header) {
  btn.addEventListener('click',()=>{
      const row = tr.querySelectorAll('td');
      const row_header = th_header.querySelectorAll('th');
      // if- any new column will be added at the beginning, lines below must change
      _g_editTarget = {name: row[1].textContent, brand:row[2].textContent};
      
      row_header.forEach((x,idx)=>{
        let inp = document.querySelector(`input[id^=${x.textContent}]`);
        if (inp) {
          inp.value = row[idx].textContent;
        }
      });
      btn_add.style.display = "none";
      btn_update.style.display = "block";
  });
}

function btn_delete_Init(btn,tr) {
  btn.addEventListener('click',()=>{
      const row = tr.querySelectorAll('td');
      let rowToDelete = {name: row[1].textContent, brand:row[2].textContent};
      let confirm = window.confirm(`Do you really want to remove product: ${rowToDelete.name} ${rowToDelete.brand} ?`);
      if (!confirm) {
        return;
      }
      fetch("/api/removep", {
      method: "POST",
      body: JSON.stringify(rowToDelete),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((response)=>{
          if (response['status'] == 1) { 
          updateDatatable(_g_tableUser);
        } else
        {
          alert(response['msg']);
        }    
    });
  });
}

document.addEventListener("submit",function(event){
  event.preventDefault();
  let dataJSON = {};
  const data = new FormData(event.target);
  data.forEach((value,key)=>{
    dataJSON[key] = value;
    });
  
  if (_g_submitTarget == ("add") ) {
    fetch("/api/addp", {
      method: "POST",
      body: JSON.stringify(dataJSON),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((response)=>{
        if (response['status'] == 1) {
          // What to do with DOM after we succeeded
          updateDatatable(_g_tableUser);
          addPrForm.reset(); 
        } else
        {
          alert(response['msg']);
        }
    });
  } else if (_g_submitTarget == "update") {
      dataJSON.target = _g_editTarget;
      fetch("/api/updatep", {
      method: "POST",
      body: JSON.stringify(dataJSON),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => response.json()).then((response)=>{
        if (response['status'] == 1) {
          // What to do with DOM after we succeeded
          updateDatatable(_g_tableUser);
          addPrForm.reset(); 
        } else
        {
          alert(response['msg']);
        }
    }); 
      
  } else {
      throw new Error('ERROR: unknown source of POST request');
  }
  
  _g_submitTarget = "";
})



/////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATATABLES
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var _g_tableUser, _g_tablePublic;


function GetUserProducts() {
  var th_header = $('#dataTable thead tr')[0];
  
  fetch('/api/getuserp').then(response=>response.json()).then( (response)=>{
    
     _g_tableUser = $('#dataTable').DataTable({
      
           data: response,
           columns: [
               { data: 'category' },
               { data: 'name' },
               { data: 'brand' },
               { data: 'kj' },
               { data: 'kcal' },
               { data: 'fat' },
               { data: 'carb' },
               { data: 'sugar' },
               { data: 'protein' },
               { data: 'fiber' },
               { data: 'salt' }      
           ],
           
           // Add action buttons to row
            "createdRow": function( row, data, dataIndex ) {
            let b_e = Object.assign(document.createElement('button'), {
              className: 'btn_edit',
              type: 'button',
              textContent: 'Edit'
            });
            row.appendChild(b_e);
            let b_d = Object.assign(document.createElement('button'), {
              className: 'btn_delete',
              type: 'button',
              textContent:'X'
            }); 
            row.appendChild(b_d);
            
            btn_edit_Init(b_e,row,th_header);
            btn_delete_Init(b_d,row);
          }           
       });
   
    return;
    });
}

GetUserProducts();

function GetPublicProducts() {
  var th_header = $('#dataTablePub')
  fetch('/api/getpubp').then(response=>response.json()).then( (response)=>{
      _g_tablePublic=$('#dataTablePub').DataTable({
      
           data: response,
           columns: [
               { data: 'category' },
               { data: 'name' },
               { data: 'brand' },
               { data: 'kj' },
               { data: 'kcal' },
               { data: 'fat' },
               { data: 'carb' },
               { data: 'sugar' },
               { data: 'protein' },
               { data: 'fiber' },
               { data: 'salt' },
               { data: 'author' }
           ]
          
       });
    return;
    });
}

GetPublicProducts();
function updateDatatable(datatable) {
    fetch('/api/getuserp').then(response=>response.json()).then((response)=>{
    datatable.clear();
    datatable.rows.add(response);
    datatable.draw();
  });    
}

