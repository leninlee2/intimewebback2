/* eslint-disable */
import $ from 'jquery';
import {createCookie,postTransactionEmpty,postTransactionFilter
  ,postTransactionThreeParameters
  //,readCookie,postTransaction
  , getTransaction, getTransactionFilter} from '../util/util.js';
//import ReactDOM from 'react-dom';
import settings from '../settings.json';

//var globaluser = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','pagegroup',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      //var name = $('#name').val();
      LoadPageGroup();
    });

    $('#addtem').click(function(e){
        SaveItem();
        e.stopImmediatePropagation();
    });

    $('#addall').click(function(e){
      SaveAll();
      e.stopImmediatePropagation();
    });

    $('#removeitem').click(function(e){
      DeleteItem();
      e.stopImmediatePropagation();
    });

    $('#removeall').click(function(e){
      DeleteAll();
      e.stopImmediatePropagation();
    });

    $('#groupname').click(function(e){
      LoadPageGroup();
      e.stopImmediatePropagation();
    });

    LoadGroup();
    LoadPageGroup();
  });

  $(document).mouseover(function(){
    $('.delete').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });
  });
}

function DeleteItemDetail(data,id,name){
  AddItemOrigin(id,name);
}

function DeleteItem(){

  var id = $('#destination').val();
  var name = $('#destination option:selected').text();

  var userentry = {
      user:{
        id:id,
        active:0
      }
  };

  postTransactionThreeParameters(settings.endpoints.pagegroup.PUT
    ,userentry,DeleteItemDetail,id,name,null
    );
   
}

function SaveItem(){
    var id = $('#origin').val();
    var name = $('#origin option:selected').text();
    var IdGroup = $('#groupname').val();

    var userentry = {
        user:{
          IdPage:id,
          IdGroup:IdGroup
        }
    };

    postTransactionFilter(settings.endpoints.pagegroup.POST
      ,userentry,AddItem,name,null
      );
     
}

function SaveAll(){
  //var id = $('#origin').val();
  var name = $('#origin option:selected').text();
  var IdGroup = $('#groupname').val();

  var userentry = {
      user:{
        IdGroup:IdGroup
      }
  };

  postTransactionFilter(settings.endpoints.pagegroup.SAVEALL
    ,userentry,SaveAllDetail,name,null
    );
   
}

function SaveAllDetail(data,filter){
  window.location.reload();
}

function AddItem(id,name){
    var html = '<option value="{0}">{1}</option>'.replace('{0}',id).replace('{1}',name);
    $('#destination').append(html);
    RemoveItemOrigin(id);
}

function AddItemOrigin(id,name){
  var html = '<option value="{0}">{1}</option>'.replace('{0}',id).replace('{1}',name);
  $('#origin').append(html);
  RemoveItemDestination(id);
}

function RemoveItemDestination(id){
  $("#destination option[value='" + id  + "']").remove();
}

function RemoveItemOrigin(id){
  $("#origin option[value='" + id  + "']").remove();
}

function Save(){
  
  var login = $("#name").val();
  var password = $("#password").val();

  var userentry = {
    user:{
      login:login,
      password:password
    }
  };

  postTransactionFilter(settings.endpoints.user.POST
    ,userentry,LoadPageGroup,'Usuário Gravado com sucesso!'
    );
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.user.PUT
    ,userentry,LoadPageGroup,'Usuário Atualizada com sucesso!'
    );
 
}

function DeleteAll(){

  var IdGroup = $('#groupname').val();

  var userentry = {
    user:{
      IdGroup:IdGroup,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.pagegroup.UPDATEALL
    ,userentry,SaveAllDetail,'Funcionalidade atualizada com sucesso!'
    );
 
}

function LoadPageGroup(){
  getTransaction(settings.endpoints.pagegroup.GET,LoadPage);
}

function LoadGroup(){
    getTransaction(settings.endpoints.group.GET,LoadGroupDetail);
 
}

function LoadGroupDetail(data){
    var html = '';
    $.each(data,function(c,comp){
        html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('#groupname').html(html);
}

function LoadPageDetail(data,pagegroup){
    var htmldestination = '';
    var htmlorigin = '';
    //globaluser = data;
    var group = $('#groupname').val();
    var bookedpages = [];
    var count = 0;
    
    $.each(pagegroup,function(c0,comp0){
      if(comp0.IdGroup == group && comp0.active == 1 ){
        $.each(data,function(c,comp){
           if(comp.id == comp0.IdPage){
            htmldestination += '<option value="{0}">{1}</option>'.replace('{0}',comp0.id).replace('{1}',comp.name);
            bookedpages[count] = comp.id;
            count+=1;
           }            
        });
      }
    });

    $.each(data,function(c,comp){
       if(!bookedpages.includes(comp.id) && comp.active == 1){
          htmlorigin += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
       }
    });
    
    $('#origin').html(htmlorigin);
    $('#destination').html(htmldestination);
}

function LoadPage(pagegroup){

  getTransactionFilter(settings.endpoints.page.GET
    ,LoadPageDetail,pagegroup
    );
 
}

function UserGroup() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="GROUPFUNCTION" class="keycontainer" >Grupo Vs Funcionalidade</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span data-key="GROUPNAME" class="keycontainer"  >Nome do grupo</span>
            <select id="groupname" class="form-control c100" >

            </select>
          </div>
        </div>
        <br/>
        <br/>
        <div class="row" >
          <div class="col-sm-4" > 
              <span  data-key="ORIGIN" class="keycontainer" >Origem</span>
              <select size="10"  class="form-control c100" id="origin" >
              </select>
          </div>
          <div class="col-sm-1" > 
              <br/>
              <input type="button" class="btn btn-sucess wbuttonmove" value=">" id="addtem" />
              <br/>
              <input type="button" class="btn btn-sucess wbuttonmove" value=">>" id="addall" />
              <br/>
              <input type="button" class="btn btn-sucess wbuttonmove" value="<" id="removeitem" />
              <br/>
              <input type="button" class="btn btn-sucess wbuttonmove" value="<<" id="removeall" />
          </div>
          <div class="col-sm-4" > 
              <span  data-key="DESTINATION" class="keycontainer"  >Destino</span>
              <select size="10"  class="form-control c100" id="destination" >
              </select>
          </div>
        </div>
    </div>
    
  );
}

export default UserGroup;