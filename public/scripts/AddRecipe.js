var _g_tableUser, _g_tablePublic; // handles to tables

function dt_getID(dataTable) {
  return dataTable.api().table().node().id;
}

function dt_createColumnSearch(colums_idxArr , dataTable) { //colums_idxArr,
  // ID of passed table
   const dtID=dt_getID(dataTable);
   
   // remove general search
   $(`#${dtID}_filter`).css({display: 'none'});
   // move <show X entries> to bottom
   //$(`#${dtID}_length`).insertBefore(`#${dtID}_wrapper`);
   //disapear <showing x entries>
   $(`#${dtID}_info`).css({display: 'none'});
   
     
   dataTable.api().columns().every(function(idx){
      let column = this;
      let title = column.header().textContent;
      
      if (colums_idxArr.includes(idx)) {
        // Create input element
        let input = document.createElement('input');
        input.placeholder = title;
        input.className = "searchColumnInput";
        column.header().replaceChildren(input);
  
        // Event listener for user input
        input.addEventListener('keyup', () => {
           column.search(input.value,true).draw();      
        });
      } 
    });
     
}

function dt_createActionKeys(row,dataTable){
  let td = document.createElement('td');
  td.className = 'action';
  let b_a = Object.assign(document.createElement('button'), {
    className: 'btn_add',
    type: 'button',
    textContent: 'Add'
  });

  td.appendChild(b_a);
  row.appendChild(td);
  
  let th_footer = dataTable.api().table().footer().getElementsByTagName('tr')[0];

}

function GetUserProducts() {
  //var th_header = $('#dataTable thead tr')[0];
  
  fetch('/api/getuserp').then(response=>response.json()).then( (response)=>{
    
     _g_tableUser = $('#dataTable').DataTable({
             
           data: response,
           "autoWidth": false,
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
           ],

           // Add action buttons to row
          "createdRow": function( row, data, dataIndex ) {
              dt_createActionKeys(row, this);
              
          },
          
          "initComplete": function () {
            dt_createColumnSearch([0,1,2],this);
            this.columns.adjust().draw();
            
            
          }
          
       });
   
    return;
    });
}

GetUserProducts();