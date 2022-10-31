/* eslint-disable */
import $ from 'jquery';
//import Dashboard from '../Dashboard/Dashboard.js';
import {createCookie,getTransactionFilter,postTransactionEmpty} from '../util/util.js';//getTransaction,postTransaction,readCookie
//import ReactDOM from 'react-dom';
import settings from '../settings.json';

var groups = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','group',null,30);

    $('#save').click(function(e){
      if($('#IdGroup').val()=='')
        Save();
      else
        Edit();
        
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadGroup(name);
    });

    $('.checkbox2').click(function(e){
      if($(this).attr('checked')==null){
        $(this).attr('checked','checked');
      }else{
        $(this).removeAttr('checked');
      }
      e.stopImmediatePropagation();
    });

    //LoadGroup("");
  });

  $(document).mouseover(function(){
    $('.deletegroup').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });

    $('.editgroup').click(function(e){
      var id = $(this).attr('data-id');
      var name = $(this).attr('data-name');
      var father = $(this).attr('data-father');
      if(father==null || father=='null' 
      || father == '' || father == undefined){
        //alert('no father');
        father = 0;
      }
        
      var mainlevel = $(this).attr('data-mainlevel');
      EditFormat(id,name,father,mainlevel);
      e.stopImmediatePropagation();
    });

  });
}

function EditFormat(id,name,father,mainlevel){
  $('#IdGroup').val(id);
  $('#name').val(name);
  $('#father').val(father);
  if(mainlevel==1 && $('#mainlevel').attr('checked')==null)
    $('#mainlevel').click();
  else if((mainlevel==0 
    || mainlevel == null 
    || mainlevel == 'null' )
            && $('#mainlevel').attr('checked')!=null){
    $('#mainlevel').click();
  }
    

}

function SaveUpdateDetail(data){
  //alert('Grupo Gravado com sucesso!');
  CleanGroup();
  LoadGroup("");
}

function Save(){

  var name = $("#name").val();
  var father = $("#father").val();
  var mainlevel = ($("#mainlevel").attr('checked')!=null?1:0);

  var userentry = {
    user:{
      name:name,
      father:father,
      mainlevel:mainlevel
    }
  };

  postTransactionEmpty(settings.endpoints.group.POST,userentry,SaveUpdateDetail,'Grupo Gravado com sucesso!');
 
  /*
  $.ajax({
      url : settings.endpoints.group.POST,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data : userentry,
      success: function(data)
      {
          alert('Grupo Gravado com sucesso!');
          CleanGroup();
          LoadGroup("");
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var item_result = JSON.stringify(jqXHR);
        alert(textStatus);
        alert(errorThrown);
        alert(jqXHR);
        alert(item_result);
        alert('Falha na autenticacao');
      }
  });
  */

}

function Edit(){

  var name = $("#name").val();
  var father = $("#father").val();
  var mainlevel = ($("#mainlevel").attr('checked')!=null?1:0);
  var id = $('#IdGroup').val();

  var userentry = {
    user:{
      name:name,
      father:father,
      mainlevel:mainlevel,
      id:id
    }
  };

  postTransactionEmpty(settings.endpoints.group.PUT,userentry,SaveUpdateDetail,'Grupo Atualizado com sucesso!');

  /*
  $.ajax({
      url : settings.endpoints.group.PUT,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data : userentry,
      success: function(data)
      {
          alert('Grupo Atualizado com sucesso!');
          CleanGroup();
          LoadGroup("");
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var item_result = JSON.stringify(jqXHR);
        alert(textStatus);
        alert(errorThrown);
        alert(jqXHR);
        alert(item_result);
        alert('Falha na autenticacao');
      }
  });
  */
}

function CleanGroup(){
  $("#name").val('');
  $("#father").val(0);
  $('#IdGroup').val('');
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  }; 

  postTransactionEmpty(settings.endpoints.group.DELETE,userentry,SaveUpdateDetail,'Grupo Atualizado com sucesso!');

  /*
  $.ajax({
      url : settings.endpoints.group.DELETE,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data : userentry,
      success: function(data)
      {
          alert('Grupo Atualizado com sucesso!');
          CleanGroup();
          LoadGroup("");
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var item_result = JSON.stringify(jqXHR);
        alert(textStatus);
        alert(errorThrown);
        alert(jqXHR);
        alert(item_result);
        alert('Falha na autenticacao');
      }
  });
  */

}

function LoadGroupIntermediate(data,filter){
  console.log(data);
  groups = data;
  LoadGroupDetail(data,filter);
}

function LoadGroup(filter){

  getTransactionFilter(settings.endpoints.group.GET,LoadGroupIntermediate,filter);
 
  /*
  $.ajax({
      url : settings.endpoints.group.GET,
      type: "GET",
      success: function(data)
      {
          console.log(data.data);
          groups = data.data;
          LoadGroupDetail(data.data,filter);   
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var item_result = JSON.stringify(jqXHR);
        alert(textStatus);
        alert(errorThrown);
        alert(jqXHR);
        alert(item_result);
        alert('Falha na autenticacao');
      }
  });
  */
}

function GetGroupName(id){
  var name = '';
  $.each(groups,function(c,comp){
    if(comp.id == id)
      name = comp.name;
  });
  return name;
}

function LoadGroupDetail(data,filter){
    var html = '';
    //fill combo - father:
    html = '<option value="0" >Nenhum<option>';
    if($('#father').html()==''){
      $.each(data,function(c,comp){
        html += '<option value="{0}" >{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
      });
      $('#father').html(html);
    }

    html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletegroup" data-id="{0}" ></span>';
    var edit = '<span class="glyphicon glyphicon glyphicon-edit pointer editgroup" data-id="{0}" data-name="{1}" data-father="{2}" data-mainlevel="{3}"  ></span>';

    $.each(data,function(c,comp){

      if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',comp.name);
        if(comp.father == null || comp.father == 0 || comp.father == 'null')
          html += '<td>{0}</td>'.replace('{0}','-');
        else
          html += '<td>{0}</td>'.replace('{0}',GetGroupName(comp.father) );

        //html += '<td>{0}</td>'.replace('{0}',comp.mainlevel);
        if(comp.mainlevel == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }

        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + edit + '</td>').replace('{0}',comp.id).replace('{1}',comp.name).replace('{2}',comp.father).replace('{3}',comp.mainlevel);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      }
    });
    $('.querybody').html(html);
}

function Group() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="MANAGEMENTGROUP" class="keycontainer" >Controle de Grupos de Acesso</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <input type="hidden" id="IdGroup" />
            <span data-key="GROUPNAME"  class="keycontainer"  >Nome do Grupo</span>
            <input type="text" id="name" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span data-key="FATHERGROUP"  class="keycontainer"  >Grupo Pai</span>
            <select id="father" class="form-control c100" >
            </select>
          </div>
        </div>
        <div class="row" >
          <div class="col-sm-6">
              <br/>
              <input type="checkbox" id="mainlevel" class="checkbox2" />&nbsp;<span  data-key="FIRSTLEVEL"  class="keycontainer"  >Nível Master</span>
          </div>
          <div class="col-sm-1" >
            <br/>
            <input type="button" value="Pesquisar" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH"  />
          </div>
          <div class="col-sm-1" >
            <br/>
            <div class="text-right" >
              <input type="button" value="Gravar" id="save"  class="btn btn-sucess keycontainerbutton"  data-key="SAVE" />
            </div>
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-8" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="ID"  class="keycontainer"  >Id</th>
                        <th  data-key="NAME" class="keycontainer"  >Nome</th>
                        <th  data-key="FATHERGROUP" class="keycontainer"  >Grupo Pai</th>
                        <th  data-key="FIRSTLEVEL" class="keycontainer"  >Master</th>
                        <th  data-key="ACTIVE" class="keycontainer"  >Ativo</th>
                        <th  data-key="CREATE" class="keycontainer"  >Criado</th>
                        <th  data-key="CHANGED" class="keycontainer"  >Alterado</th>
                        <th>/</th>
                        <th>/</th>
                    </tr>
                </thead>
                <tbody class="querybody" >

                </tbody>
              </table>
          </div>
        </div>
    </div>
    
  );
}

export default Group;