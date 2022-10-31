/* eslint-disable */
import $ from 'jquery';
//import ReactDOM from 'react-dom';
import settings from '../settings.json';
import {createCookie,getTransaction
  ,postTransactionEmpty} from '../util/util.js';//getTransactionFilter,postTransaction,readCookie

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','keyword',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      //var name = $('#name').val();
      LoadKeyWord();
    });

    $('#groupname').click(function(e){
      LoadKeyWord();
      e.stopImmediatePropagation();
    });

    LoadLanguage();
    LoadKeyWord();
  });

  $(document).mouseover(function(){
    $('.deletekeyword').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });
  });
}

function Save(){

  var language = $("#groupname").val();
  var key = $("#key").val();
  var valuei = $("#value").val();

  var userentry = {
    user:{
      IdLanguage:language,
      name:key,
      valuepair:valuei
    }
  };

  postTransactionEmpty(settings.endpoints.keyword.POST,userentry,LoadKeyWord,'KeyWord recorded with success!');
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.keyword.PUT,userentry,LoadKeyWord,'KeyWord updated with success!');

}

function LoadKeyWordIntermediate(data){
  console.log(data);
  var language = $('#groupname').val();
  LoadKeyWordDetail(data,language);  
}

function LoadKeyWord(){
  getTransaction(settings.endpoints.keyword.GET,LoadKeyWordIntermediate,null);
}


function LoadLanguage(){
    getTransaction(settings.endpoints.language.GET,LoadLanguageDetail,null);
}

function LoadLanguageDetail(data){
    var html = '<option value="0">All</option>';
    $.each(data,function(c,comp){
        if(comp.active == 1)
            html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('#groupname').html(html);
}

function LoadKeyWordDetail(data,filter){
  var html = '';
  var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletekeyword" data-id="{0}" ></span>';
  $.each(data,function(c,comp){
    
    if(filter == null 
      || filter == "" 
      || filter == "0" 
      || comp.IdLanguage == filter ){
      html += '<tr>';
      html += '<td>{0}</td>'.replace('{0}',comp.IdLanguage);
      html += '<td>{0}</td>'.replace('{0}',comp.name);
      html += '<td>{0}</td>'.replace('{0}',comp.valuepair);
      if(comp.active == 1){
        html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
      }else{
        html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
      }
      html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
      html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
      html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
      html += '</tr>';
    }
  });
  $('.querybody').html(html);
}

function KeyWord() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="KEYRECORD" class="keycontainer" >KeyWord Management</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="LANGUAGE" class="keycontainer"  >Language</span>
            <select id="groupname" class="form-control c100" >

            </select>
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-2" >
            <span  data-key="KEY" class="keycontainer"  >Key</span>
            <input type="text" id="key" class="form-control c100" />
          </div>
          <div class="col-sm-2" >
            <span  data-key="VALUE" class="keycontainer"  >Value</span>
            <input type="text" id="value" class="form-control c100" />
          </div>
          <div class="col-sm-1" > 
            <br/>
            <input type="button" id="search" class="btn btn-sucess search keycontainerbutton" value="Search" data-key="SEARCH" />
          </div>
          <div class="col-sm-1" > 
            <br/>
            <input type="button" id="save" class="btn btn-sucess keycontainerbutton" value="Save" data-key="SAVE" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-8" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="LANGUAGE" class="keycontainer"  >Language</th>
                        <th  data-key="KEY" class="keycontainer"  >Key</th>
                        <th  data-key="VALUE" class="keycontainer"  >Value</th>
                        <th  data-key="ACTIVE" class="keycontainer"  >Active</th>
                        <th data-key="CREATE" class="keycontainer"  >Created</th>
                        <th  data-key="CHANGED" class="keycontainer"  >Changed</th>
                        <th>/</th>
                    </tr>
                </thead>
                <tbody class="querybody" >

                </tbody>
              </table>
          </div>
        </div>
        
        <br/>
        <br/>
    </div>
    
  );
}

export default KeyWord;