import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import BreadCrumb from '../BreadCrumb/BreadCrumb.js';
import Project from '../Project/Project.js';
import settings from '../settings.json';
import {createCookie,getTransaction,getTransactionFilter
  ,postTransactionEmpty,readCookie, postTransaction2,postTransaction3 } from '../util/util.js';

var trendstatus = {};
var documentcategories = {};
var generalcategories = {};
var trendstatusoperation = {};
var employees = {};
var users = {};

function Load(){
  $(document).ready(function(){

    var userId = readCookie('authenticationid');
    var token = readCookie('token');

    $('#token').val(token);
    $('#IdUser').val(userId);

    $('.search').click(function(){
      var name = $('#name').val();
      LoadDocument(name);
    });

    $('#validate').click(function(e){
      Validate();
      e.stopImmediatePropagation();
    });
    //projects
    $('#projects').click(function(e){
      ReactDOM.render(<Project />, document.querySelector("#region"));
    });

    LoadStatusOperation();
    LoadCategory();
    LoadTrendStatus();
    LoadProject();
    LoadDocument("");
  });

  $(document).mouseover(function(){
    $('.deletedocument').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });

    $('.redirectworker').click(function(e){
      var idLogin = $(this).attr('data-id');
      var name = $(this).attr('data-name');
      RedirectEmployee(idLogin,name);
      e.stopImmediatePropagation();
    });

    //approval
    $('.approval').click(function(e){
      var id = $(this).attr('data-id');
      var IdStatus = $(this).attr('data-status');
      var record = GetRecord(trendstatus,IdStatus);
      var IdUser = $('#IdUser').val();
      UpdateDocumentStatus(id,record.IdNext,IdUser);
      e.stopImmediatePropagation();
    });

    $('.reproval').click(function(e){
      var id = $(this).attr('data-id');
      var IdStatus = $(this).attr('data-status');
      var record = GetRecord(trendstatus,IdStatus);
      var IdUser = $('#IdUser').val();
      UpdateDocumentStatus(id,record.IdPrevius,IdUser);
      e.stopImmediatePropagation();
    });

    $('.categoryitem').click(function(e){
      if($(this).attr('checked') == null){
        $(this).attr('checked','checked');
      }else{
        $(this).removeAttr('checked');
      }
      e.stopImmediatePropagation();
    });

    //viewcategory
    $('.viewcategory').click(function(e){
      var id = $(this).attr('data-id');
      GetCategoriesByDocument(id);
      $('#modalcategory').show();
      e.stopImmediatePropagation();
    });

    $('#close').click(function(e){
      $('#modalcategory').hide();
      e.stopImmediatePropagation();
    });

  });
}

function IsLastStatus(IdStatus){
  var record = GetRecord(trendstatus,IdStatus);
  if(record.laststep == 1)
    return true;
  else
    return false;
}

function RedirectEmployee(idLogin,name){
  createCookie("idLogin",idLogin,null,10);
  createCookie("name",name,null,10);
  ReactDOM.render(<Employee />, document.querySelector("#region"));
}

function Validate(){
  var catlist = GetCategoryList();

  if(catlist.length == 0){
    alert('Favor selecionar ao menos uma categoria');
    return false;
  }else{
    var categories = Serialize(catlist);
    $('#categories').val(categories);
    $('#save').click();
    return true;
  }
}

function Serialize(data){
    var result = '';
    $.each(data,function(c,comp){
      result += ',' + comp;
    });
    if(result.length > 1)
      result = result.substring(1,result.length);
    return result;
}

function GetCategoryList(){
  var catlist = [];
  var i = 0;
  $('.categoryitem').each(function(c,comp){
       var checked = $(this).attr('checked');
       var id = $(this).val();

       //alert(id);
       if(checked != null && checked != ''){
          catlist[i] = id;
          i+=1;
       }
  });

  return catlist;
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.document.DELETE
    ,userentry,LoadDocument,'Documento Atualizado/Excluido com sucesso!');
 
}

function UpdateDocumentStatus(id,IdStatus,IdUser){

  var userentry = {
    user:{
      id:id,
      IdStatus:IdStatus,
      IdUser:IdUser
    }
  };

  postTransactionEmpty(settings.endpoints.document.PUT
    ,userentry,LoadDocument,'Documento Atualizado com sucesso!');
 
}

function LoadDocument(filter){
 
  getTransactionFilter(settings.endpoints.document.GET,LoadEmployees,filter);

}

function LoadEmployeesDetail(data,filter,documents){
  console.log(data.data);
  employees = data.data;
  users = data.users;
  LoadPageDetail(documents,filter); 
}

function LoadEmployees(documents,filter){

  var ids = [];
  var count = 0;
  $.each(documents,function(c,comp){
    if(comp.lastWorker != null && comp.lastWorker > 0){
      ids[count] = comp.lastWorker;
      count+=1;
    }
  });

  var userentry = {
    user:{
      ids:ids
    }
  };

  postTransaction3(settings.endpoints.user.WORKERSBYID,userentry,LoadEmployeesDetail,filter,documents);
 
}

function GetResponsible(id){
  var name = '';
  for(var i = 0;i < users.length;i++){
    if(id == users[i].id){
      if(users[i].IdEmployee != null && users[i].IdEmployee > 0){
        var IdEmployee = users[i].IdEmployee;
        for(var j = 0;j < employees.length;j++){
          if(employees[j].id == IdEmployee){
            name = employees[j].name;
            j = employees.length;
          }
        }
        i = users.length;
      }else{
        i = users.length;
      }
    }
  }
  return name;
}

function LoadStatusOperationDetail(data){
  console.log(data);
  if(data.length > 0){
      trendstatusoperation = data;
      $('#IdStatus').val(data[0].id);
  }
}

function LoadStatusOperation(){

  getTransaction(settings.endpoints.trendstatus.OPERATIONS,LoadStatusOperationDetail,null);

}

function GetStatusOperation(IdStatus){
  var response = false;
  $.each(trendstatusoperation,function(c,comp){
    if(comp.id == IdStatus)
      response = true;
  });
  return response;
}

function LoadDocumentCategoryDetail(data){
  console.log(data);
  documentcategories = data;
}

function LoadDocumentCategory(){ 
  getTransaction(settings.endpoints.documentcategory.GET,LoadDocumentCategoryDetail,null);
}

function LoadCategoryIntermediary(data){
  console.log(data);
  generalcategories = data;
  LoadCategoryDetail(data); 
  LoadDocumentCategory();
}

function LoadCategory(){
 
  getTransaction(settings.endpoints.category.GET,LoadCategoryIntermediary,null);

}

function LoadCategoryDetail(data){
  var html = '';
  $.each(data,function(c,comp){
    html += '<br/><input type="checkbox" class="categoryitem" value="{0}" />{1}'.replace('{0}',comp.id).replace('{1}',comp.name);
  });
  $('#category').html(html);
}

function LoadTrendStatusDetail(data){
  console.log(data);
  trendstatus = data;
}

function LoadTrendStatus(){
 
  getTransaction(settings.endpoints.trendstatus.GET,LoadTrendStatusDetail,null);

}

function GetRecord(data,id){
  var item = {};
  $.each(data,function(c,comp){
      if(comp.id == id){
        item = comp;
      }
  });
  return item;
}

function GetNameRecord(data,id){
  var item = {};
  $.each(data,function(c,comp){
      if(comp.id == id){
        item = comp;
      }
  });
  return item.name;
}

function GetCategoriesByDocument(id){
    var html = '';
    $.each(documentcategories,function(c,comp){
        if(comp.IdDocument == id){
          $.each(generalcategories,function(c2,comp2){
              if(comp2.id == comp.IdCategory){
                html += '<br/>' + comp2.name;
              }
          });
        }
    });
    $('#categorybody').html(html);
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletedocument" data-id="{0}" ></span>';
    var operations = '<input type="button" class="btn btn-sucess approval w80" value="Aprovar" data-id="{0}" data-status="{1}" /><br/><input type="button" class="btn btn-sucess reproval w80 mt5" value="Reprovar"  data-id="{2}" data-status="{3}" />';
    var operationsrep = '<input type="button" class="btn btn-sucess reproval w80 mt5" value="Reprovar"  data-id="{2}" data-status="{3}" />';
    var IdProject = $("#project").val();

    $.each(data,function(c,comp){

      if(comp.IdProject ==  IdProject){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td><a href="./P_{0}/{1}" >{2}</a></td>'.replace('{0}',comp.IdProject).replace('{1}',comp.file).replace('{2}',comp.file);
        html += '<td><a href="#" class="viewcategory" data-id="{0}" >Categorias</a></td>'.replace('{0}',comp.id);
        //html += '<td>{0}</td>'.replace('{0}',GetNameRecord(trendstatus,comp.IdStatus));

        /*
        if(GetStatusOperation(comp.IdStatus)){
          html += '<td>{0}</td>'.replace('{0}','Não passivel de Aprovação');
        }else if(IsLastStatus(comp.IdStatus)==false){
          html += '<td>{0}</td>'.replace('{0}',operations).replace('{0}',comp.id).replace('{1}',comp.IdStatus).replace('{2}',comp.id).replace('{3}',comp.IdStatus);
        }else{
          html += '<td>{0}</td>'.replace('{0}',operationsrep).replace('{2}',comp.id).replace('{3}',comp.IdStatus);
        }
        */
        
        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);

        if(comp.lastWorker == null || comp.lastWorker == '')
          html += '<td>{0}</td>'.replace('{0}','-');
        else
          html += '<td>{0}</td>'.replace('{0}',GetResponsible(comp.lastWorker) );

        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      }
    });
    $('.querybody').html(html);
}

function LoadProject(){
  var id = readCookie("idprojectdocument");
  var name = readCookie("idprojectdocumentname");
  var html = '<option value="{0}" >{1}</option>'.replace('{0}',id).replace('{1}',name);
  $('#project').html(html);
}

function Document() {
  Load();
  return (
    <div>
        <BreadCrumb local={<span>Projetos</span>} class="left" />
        <span class="left" ><a href="#" id="projects" >--Projetos</a></span> 
        <br/>
        <h3 data-key="DOCUMENTPROJECT" class="keycontainer" >Documentos Por Projeto</h3>
        <form method="POST" action={settings.endpoints.document.POST}
           enctype="multipart/form-data"
        >
        <div class="row" >
          <div class="col-sm-6" >
            <input type="hidden" id="categories" name="categories" />
            <input type="hidden" id="IdUser" name="IdUser" />
            <input type="hidden" id="IdClient" name="IdClient" />
            <input type="hidden" id="IdStatus" name="IdStatus" />
            <input type="hidden" id="IdWorker" name="IdWorker" value="1" />
            <input type="hidden" id="token" name="token"  />
            <span data-key="PROJECTNAME" class="keycontainer" >Projeto</span>
            <select id="project" name="project"  class="form-control c100" >

            </select>
          </div>
          <div class="col-sm-6" >
            <span data-key="FILE"  class="keycontainer" >Arquivo</span>
            <input type="file" id="file" name="file" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row">
            <div class="col-sm-10" >
                <div id="category"  class="form-control c100 h100 scroll" >

                </div>
            </div>
            <div class="col-sm-1 right" >
                <br/>
                <input type="button" value="Pesquisar" id="search"  class="btn btn-success search keycontainerbutton" data-key="SEARCH" />
            </div>
            <div class="col-sm-1 right" >
                <br/>
                <input type="button" value="Gravar"  id="validate" class="btn btn-success keycontainerbutton"  data-key="SAVE" />
                <input type="submit" value="Gravar2" id="save"   class="btn btn-success hide" />
            </div>
        </div>
        </form>
        <br/>
        <div class="row" >
          <div class="col-sm-12" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th data-key="IDDOC" class="keycontainer" >Id-Doc</th>
                        <th data-key="DOCUMENT" class="keycontainer" >Documento</th>
                        <th data-key="CATEGORY" class="keycontainer" >Categoria</th>
                        <th data-key="ACTIVE" class="keycontainer" >Ativo</th>
                        <th data-key="CREATE" class="keycontainer" >Criado</th>
                        <th data-key="CHANGED" class="keycontainer" >Alterado</th>
                        <th data-key="RESPONSIBLE" class="keycontainer" >Responsável</th>
                        <th>/</th>
                    </tr>
                </thead>
                <tbody class="querybody" >

                </tbody>
              </table>
          </div>
        </div>

        <div class="modal" tabindex="-1" role="dialog" id="modalcategory" >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title keycontainer" data-key="CATEGORY" >Categorias</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" id="categorybody" >
                <p></p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="close" >Close</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Document;