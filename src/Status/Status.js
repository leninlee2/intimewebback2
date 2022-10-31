/* eslint-disable */
import $ from 'jquery';
import BreadCrumb from '../BreadCrumb/BreadCrumb.js';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  //,postTransactionFilter
  //,postTransactionThreeParameters
  ,readCookie
  ,postTransaction
  //, getTransaction
  , getTransactionFilter} from '../util/util.js';

//var trendstatus = {};

function Load(){
  $(document).ready(function(){
    createCookie('currentpage','trendstatus',null,30);
    var token = readCookie('token');
    $('#token').val(token);

    $('#save').click(function(e){
      var id = $('#id').val();
      var name = $('#name').val();
      var previous = $('#previous').val();
      var next = $('#next').val();
      if(id==""){
        Save();
      }else{        
        Edit(id,name,previous,next);
      }
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadTrendStatus(name);
    });

    $('.checkcontrol').click(function(e){
      if($(this).attr('checked') == null){
        $(this).attr('checked','checked');
      }else{
        $(this).removeAttr('checked');
      }
      e.stopImmediatePropagation();
    });

    LoadTrendStatus("");
  });

  $(document).mouseover(function(){
    $('.deletetrendstatus').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });

    $('.edit').click(function(e){

        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var previous = $(this).attr('data-previous');
        var next = $(this).attr('data-next');
        var laststep = $(this).attr('data-laststep');
        var operator = $(this).attr('data-operator');
        EditFormat(id,name,previous,next,laststep,operator);
        e.stopImmediatePropagation();
    });
  });
}

/*
function GetNameRecord(id){
  var item = {};
  if(id==0)
    return '-';

  $.each(trendstatus,function(c,comp){
      if(comp.id == id){
        item = comp;
      }
  });
  return item.name;
} 
*/

function Save(){

  var name = $("#name").val();

  var userentry = {
    user:{
      name:name
    }
  };

  postTransactionEmpty(settings.endpoints.status.POST,userentry,LoadTrendStatus,'Status was recorded with success!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.status.PUT,userentry,LoadTrendStatus,'Status was updated with success!');
 
}

function EditFormat(id,name,previus,next,laststep,operator){
    $('#id').val(id);
    $('#name').val(name);
    $('#previous').val(previus);
    $('#next').val(next);

    if(laststep==1 
      && $('#laststep').attr('checked') == null){
      $('#laststep').attr('checked','checked');
    }
    else{
      $('#laststep').removeAttr('checked');
    }
      
    if(operator==1)
      $('#operator').attr('checked','checked');
    else
      $('#operator').removeAttr('checked');
}

function EditDetail(data){
  $('#id').val('');
  $('#name').val('');
  $('#previous').val('0');
  $('#next').val('0');
  alert('Status Atualizado com sucesso!');
  LoadTrendStatus("");
}

function Edit(id,name,previus,next){

  var laststep = 0;
  var operator = 0;

  if($("#laststep").attr('checked') != null)
    laststep = 1;

  if($("#operator").attr('checked') != null)
    operator = 1;

    var userentry = {
      user:{
        id:id,
        name:name,
        IdPrevius:previus,
        IdNext:next,
        laststep:laststep,
        operator:operator
      }
    };

    postTransaction(settings.endpoints.trendstatus.PUT,userentry,EditDetail);
   
}

function LoadTrendStatusIntermediate(data,filter){
  //console.log(data);
  //trendstatus = data;
  LoadTrendStatusDetail(data,filter);
}

function LoadTrendStatus(filter){
  getTransactionFilter(settings.endpoints.status.GET,LoadTrendStatusIntermediate,filter);
}

function LoadTrendStatusDetail(data,filter){
    var html = '';
    var html_controls = '<option value="0" >Nenhum</option>';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletetrendstatus" data-id="{0}" ></span>';
    var edit = '<span class="glyphicon glyphicon glyphicon-edit pointer edit" data-id="{0}" data-name="{1}" data-previous="{2}" data-next="{3}" data-laststep="{4}" data-operator="{5}"  ></span>';

    $.each(data,function(c,comp){
      //alert('test');
      if(filter == null 
        || filter == "" 
        || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',comp.name);
          
        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + edit + '</td>').replace('{0}',comp.id).replace('{1}',comp.name).replace('{2}',comp.IdPrevius).replace('{3}',comp.IdNext).replace('{4}',comp.laststep).replace('{5}',comp.operator);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      }

      html_controls += '<option value="{0}" >{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('.querybody').html(html);
    $('#previous').html(html_controls);
    $('#next').html(html_controls);
}

/*
<form method="POST" action={settings.endpoints.trendstatus.POST}
           enctype="multipart/form-data"
        >
</form>
          <div class="col-sm-4" >
            <span>Arquivo</span>
            <input type="file" id="file" name="file" class="form-control c100" />
          </div>
*/

function TrendStatus() {
  Load();
  return (
    <div>
        <BreadCrumb local={'Projetos'} class="left" />
        <span class="left" >-- <span data-key="STATUS" class="keycontainer" >Status</span></span>
        <br/>
        <h3  class="keycontainer" data-key="TRENDSTATUS"  >Status Delivery</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <input type="hidden" id="token" name="token" />
            <input type="hidden" id="id" name="id" />
            <span  data-key="TRENDSTATUSNAME"  class="keycontainer"  >Name</span>
            <input type="text" id="name" name="name" class="form-control c100" />
          </div>
          <div class="col-sm-1" >
              <br/>
              <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH" />
          </div>
          <div class="col-sm-1" >
              <br/>
              <input type="button" value="Save" id="save"  class="btn btn-sucess keycontainerbutton"  data-key="SAVE" />
          </div>
        </div>
        <br/>
        <div class="row">
            
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-8" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="ID"  class="keycontainer"  >Id</th>
                        <th  data-key="STATUS"  class="keycontainer"  >Name</th>
                        <th  data-key="ACTIVE"  class="keycontainer" >Active</th>
                        <th  data-key="CREATE"  class="keycontainer" >Created</th>
                        <th  data-key="CHANGED"  class="keycontainer" >Changed</th>
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

export default TrendStatus;