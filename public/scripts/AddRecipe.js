var _g_tableUser, _g_tablePublic; // handles to tables

function dt_getID(dataTable) {
  return dataTable.api().table().node().id;
}

function dt_createColumnSearch(colums_idxArr , dataTable) { //colums_idxArr,
  // ID of passed table
   const dtID=dt_getID(dataTable);
   
   // remove general search
   //$(`#${dtID}_filter`).css({display: 'none'});
   // move <show X entries> to bottom
   //$(`#${dtID}_length`).insertBefore(`#${dtID}_wrapper`);
   //disapear <showing x entries>
   //$(`#${dtID}_info`).css({display: 'none'});
   
     
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

function dt_insertActionKeys(row,dataTable){
  let b_a = Object.assign(document.createElement('button'), {
    className: 'btn',
    type: 'button',
    textContent: '＋',
    id: 'btn_add'
  });
  
  let td = row.cells[0];
  td.appendChild(b_a);

}

function GetUserProducts() {
  
  fetch('/api/getuserp').then(response=>response.json()).then( (response)=>{
    
     _g_tableUser = $('#dataTable').DataTable({
            
           language: { url: 'https://cdn.datatables.net/plug-ins/2.0.5/i18n/pl.json'},
           dom: 'lp',
           data: response,
           "autoWidth": false,
           columns: [
               { "data": null, "defaultContent": "", "orderable": false}, //empty col
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
             dt_insertActionKeys(row,dataTable);    
          },
          
          "initComplete": function () {
            dt_createColumnSearch([1,2,3],this);     
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
        
          language: { url: 'https://cdn.datatables.net/plug-ins/2.0.5/i18n/pl.json'},
          dom: 'lp',
           data: response,
           "autoWidth": false,
           columns: [
               { "data": null, "defaultContent": "", "orderable": false}, //empty col
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
           ],
           // Add action buttons to row
           "createdRow": function( row, data, dataIndex ) {
              dt_insertActionKeys(row, this);
           },
           
           "initComplete": function () {
            dt_createColumnSearch([1,2,3,12],this); 
          }
          
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