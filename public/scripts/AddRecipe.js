var _g_tableUser, _g_tablePublic, _g_tableRecipe; // handles to tables

function dt_getID(dataTable) {
  return dataTable.api().table().node().id;
}

function dt_createColumnSearch(colums_idxArr , dataTable) { //colums_idxArr,
  // ID of passed table
   const dtID=dt_getID(dataTable);
      
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

function dt_insertAddButton(row,data,dataTable){
  let b_a = Object.assign(document.createElement('button'), {
    className: 'btn_add',
    type: 'button',
    textContent: '＋'
  
  });
  let th_footer = dataTable.api()
    .table()
    .footer()
    .getElementsByTagName('tr')[0];
    
  btn_add_Init(b_a,data,th_footer);
  
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
             dt_insertAddButton(row,data,this);    
          },
          
          "initComplete": function () {
            dt_createColumnSearch([1,2,3],this);
           
          },
          order: [[ 1, "desc" ]]
          
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
              dt_insertAddButton(row,data, this);
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

/* RecipeList */
function dt_insertDelButton(row,dataTable){
  let b_a = Object.assign(document.createElement('button'), {
    className: 'btn_del',
    type: 'button',
    textContent: 'X',
    color:red
  });
  
  let td = row.cells[0];
  td.appendChild(b_a);
}

const input_Porcja_str = '<input type="number" name="portion" class="input_portion" required step="1" required pattern="^\d+$">';

function btn_add_Init(btn,data, th_footer) {
  btn.addEventListener("click", (event) => {
    let dataForRecipe = { name: data.name, brand: data.brand, portion:input_Porcja_str, portion_list: ''};    
    let newRow = _g_tableRecipe.row.add(dataForRecipe).draw().node();
    
    let b_d = Object.assign(document.createElement('button'), {
        className: 'btn_del',
        type: 'button',
        textContent: 'X'
     });
    
    $(newRow).find('td:last').append(b_d);
  });
}



function CreateRecipeTable() {
  
  _g_tableRecipe = $("#dataTable_recipe").DataTable({
      language: { url: 'https://cdn.datatables.net/plug-ins/2.0.5/i18n/pl.json'},
      dom: '',
      pageLength: 100,
      autoWidth: false,
      data: [],
      columns: [
         { "data": 'name', "defaultContent": ""},
         { "data": 'brand', "defaultContent": ""},
         { "data": 'portion', "defaultContent": ""},
         { "data": 'portion_list', "defaultContent": ""},
        { "data": null, "defaultContent": "", "orderable": false}
                
      ],
      "initComplete": function () {            
                                      
        }
     
  });

}

CreateRecipeTable() ;
