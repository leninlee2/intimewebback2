/* eslint-disable */
import $ from 'jquery';
//import ReactDOM from 'react-dom';
import settings from '../settings.json';
import {createCookie,getTransactionFilter
  ,postTransactionEmpty} from '../util/util.js';//getTransaction,readCookie,postTransaction

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','language',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadLanguage(name);
    });

    LoadLanguage("");
  });

  $(document).mouseover(function(){
    $('.deletelanguage').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });
  });
}

function Save(){
  var name = $("#name").val();

  var userentry = {
    user:{
      name:name
    }
  };

  postTransactionEmpty(settings.endpoints.language.POST,userentry,LoadLanguage,'Language recorded with success!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.language.PUT,userentry,LoadLanguage,'Language updated with success!');

}

function LoadLanguage(filter){

  getTransactionFilter(settings.endpoints.language.GET,LoadPageDetail,filter);
 
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletelanguage" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      if(filter == null 
        || filter == "" 
        || comp.name == null
      || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.name);
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

function Language() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="LANGUAGERECORD" class="keycontainer" >Language Records</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="LANGUAGE"  class="keycontainer"   >Language</span>
            <input type="text" id="name" class="form-control c100" />
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
        <div class="row" >
          <div class="col-sm-6" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="NAME"  class="keycontainer"  >Nome</th>
                        <th  data-key="ACTIVE"  class="keycontainer"  >Ativo</th>
                        <th  data-key="CREATE"  class="keycontainer"  >Criado</th>
                        <th  data-key="CHANGED"  class="keycontainer"  >Alterado</th>
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

export default Language;