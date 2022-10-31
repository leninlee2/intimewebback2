/* eslint-disable */
import $ from 'jquery';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  ,postTransactionThreeParameters
  , getTransaction, getTransactionFilter} from '../util/util.js';


function Load(){
  $(document).ready(function(){
    createCookie('currentpage','usergroup',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      //var name = $('#name').val();
      LoadUser();
    });

    $('#addtem').click(function(e){
        SaveItem();
        e.stopImmediatePropagation();
    });

    $('#addall').click(function(e){
      SaveAll();
      e.stopImmediatePropagation();
    });

    //deleteall
    $('#deleteall').click(function(e){
      DeleteAll();
      e.stopImmediatePropagation();
    });

    $('#removeitem').click(function(e){
      DeleteItem();
      e.stopImmediatePropagation();
    });

    $('#groupname').change(function(e){
      LoadUser();
      e.stopImmediatePropagation();
    });

    //LoadGroup();
    //LoadUser();
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

  var idJoin = $('#destination option:selected').attr('data-id');
  var id = $('#destination').val();
  var name = $('#destination option:selected').text();

  var userentry = {
      user:{
        id:idJoin,
        active:0
      }
  };

  postTransactionThreeParameters(settings.endpoints.usergroup.PUT,userentry,DeleteItemDetail,id,name,null);

}

function SaveItemDetail(data,id,name){
  AddItem(id,name);
}

function SaveItem(){
    var id = $('#origin').val();
    var name = $('#origin option:selected').text();
    var IdGroup = $('#groupname').val();

    var userentry = {
        user:{
          IdUser:id,
          IdGroup:IdGroup
        }
    };

    postTransactionThreeParameters(settings.endpoints.usergroup.POST,userentry,SaveItemDetail,id,name,null);
    
}

function SaveAll(){
  var IdGroup = $('#groupname').val();

  var userentry = {
      user:{
        IdGroup:IdGroup
      }
  };

  postTransactionThreeParameters(settings.endpoints.usergroup.SAVEALL,userentry,SaveAllDetail,null,null,null);
  
}

function DeleteAll(){
  //alert('DeleteAll');
  var IdGroup = $('#groupname').val();

  var userentry = {
      user:{
        IdGroup:IdGroup,
        active:0
      }
  };

  //alert(settings.endpoints.usergroup.UPDATEALL);
  postTransactionThreeParameters(settings.endpoints.usergroup.UPDATEALL,userentry,Reload,null,null,null);
  
}

function Reload(data,id,name){
  window.location.reload();
}

function SaveAllDetail(data,id,name){
   LoadUser();
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

  postTransactionEmpty(settings.endpoints.user.POST,userentry,LoadUser,'Usuário Gravado com sucesso!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.user.PUT,userentry,LoadUser,'Usuário Atualizada com sucesso!');

}

function LoadUserDetailIntermediate(data){
  console.log(data);
  LoadUserDetail(data); 
  LoadUserJoinGroup(data);
}

function LoadUser(){

  getTransaction(settings.endpoints.user.GET,LoadUserDetailIntermediate,null);
 
}

function LoadUserJoinGroup(generaluser){

    getTransactionFilter(settings.endpoints.usergroup.GET,LoadUserJoinGroupDetail,generaluser);

}

function LoadUserJoinGroupDetail(data,generaluser){
    var group = $('#groupname').val();
    var html = '';

    $.each(data,function(c,comp){
        if(comp.IdGroup == group){

            $.each(generaluser,function(c2,comp2){
                if(comp2.id == comp.IdUser 
                  && comp.active == 1
                  && comp2.active == 1
                  && comp2.login != ''
                  && comp2.login != null
                  ){
                    html += '<option value="{0}" data-id="{2}" >{1}</option>'.replace('{0}',comp2.id).replace('{1}',comp2.login).replace('{2}',comp.id);
                    RemoveItemOrigin(comp2.id);
                }
            });
        }
    });
    $('#destination').html(html);
    return;
}

//function LoadGroup(){
//    getTransaction(settings.endpoints.group.GET,LoadGroupDetail,null);
//}

//function LoadGroupDetail(data){
//    var html = '';
//    $.each(data,function(c,comp){
//        html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
//    });
//    $('#groupname').html(html);
//}

function LoadUserDetail(data){
    var html = '';
    //globaluser = data;
    $.each(data,function(c,comp){
      if(comp.active == 1 && comp.login != '' && comp.login != null)
        html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.login);
    });

    if($('#origin').html()==''){
      $('#origin').html(html);
    }
}

function UserGroup() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="GROUPVSUSER" class="keycontainer" >Grupo Vs Usuário</h3>
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
              <span data-key="ORIGIN" class="keycontainer"  >Origem</span>
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
              <input type="button" class="btn btn-sucess wbuttonmove" value="<<" id="deleteall" />
          </div>
          <div class="col-sm-4" > 
              <span data-key="DESTINATION" class="keycontainer"  >Destino</span>
              <select size="10"  class="form-control c100" id="destination" >
              </select>
          </div>
        </div>
    </div>
    
  );
}

export default UserGroup;