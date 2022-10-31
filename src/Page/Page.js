/* eslint-disable */
import $ from 'jquery';
import {createCookie,getTransactionFilter,postTransactionEmpty} from '../util/util.js';//readCookie
//import ReactDOM from 'react-dom';
import settings from '../settings.json';

var pagerecords = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','page',null,30);

    $('#save').click(function(e){
      var id = $('#id').val();
      if(id=='')
        Save();
      else
        Edit();
        
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadPage(name);
    });

    LoadPage("");
  });

  $(document).mouseover(function(){
    $('.deletepage').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });

    $('.editpage').click(function(e){

      var id = $(this).attr('data-id');
      var name = $(this).attr('data-name');
      var style = GetStyle(id);

      $('#id').val(id);
      $('#name').val(name);
      $('#mystyle').val(style);

      e.stopImmediatePropagation();
    });
  });
}

function GetStyle(id){
  var style = '';
  $.each(pagerecords,function(c,comp){
    if(comp.id == id)
      style = comp.style;
  });
  return style;
}

function Save(){

  var name = $("#name").val();
  var style = $("#mystyle").val();

  var userentry = {
    user:{
      name:name,
      style:style
    }
  };

  postTransactionEmpty(settings.endpoints.page.POST,userentry,LoadPage,'Página Gravado com sucesso!');

}

function EditDetail(data){
  $('#id').val('');
  $('#name').val('');
  $('#mystyle').val('');
  LoadPage("");
}

function Edit(){

  var name = $("#name").val();
  var style = $("#mystyle").val();
  var id = $("#id").val();

  var userentry = {
    user:{
      name:name,
      style:style,
      id:id
    }
  };

  postTransactionEmpty(settings.endpoints.page.PUT,userentry,EditDetail,'Página Gravado com sucesso!');
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.page.DELETE
    ,userentry,LoadPage,'Pagina Atualizada com sucesso!'
    );
 
}

function LoadPageIntermediary(data,filter){
  //console.log(data);
  pagerecords = data;
  LoadPageDetail(data,filter);
}

function LoadPage(filter){
 
  getTransactionFilter(settings.endpoints.page.GET,LoadPageIntermediary,filter);
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletepage" data-id="{0}" ></span>';
    var edit = '<span class="glyphicon glyphicon glyphicon-edit pointer editpage" data-id="{0}" data-name="{1}"  ></span>';
    $.each(data,function(c,comp){

      if(filter == null || filter == "" 
      || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){

        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',comp.name);
        html += '<td>{0}</td>'.replace('{0}',(comp.style != null?comp.style:"") );
        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + edit + '</td>').replace('{0}',comp.id).replace('{1}',comp.name);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      }
    });
    $('.querybody').html(html);
}

function Page() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="FUNCTIONREC" class="keycontainer" >Controle de Páginas/Funcionalidades</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <input type="hidden" id="id" />
            <span  data-key="FUNCTIONNAME" class="keycontainer" >Nome da Funcionalidade</span>
            <input type="text" id="name" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row">
            <div class="col-sm-4" >
                <span  data-key="FUNCTIONSTYLE"  class="keycontainer" >Estilo/Informação Adicional</span>
                <input type="text" id="mystyle" class="form-control c100" />
            </div>
            <div class="col-sm-1" >
                <br/>
                <input type="button" value="Pesquisar" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH"  />
            </div>
            <div class="col-sm-1" >
                <br/>
                <input type="button" value="Gravar" id="save"  class="btn btn-sucess keycontainerbutton"  data-key="SAVE"  />
            </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-10" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="ID"  class="keycontainer" >Id</th>
                        <th  data-key="NAME"  class="keycontainer" >Nome</th>
                        <th  data-key="STYLE"  class="keycontainer" >Estilo</th>
                        <th  data-key="ACTIVE"  class="keycontainer" >Ativo</th>
                        <th  data-key="CREATE"  class="keycontainer" >Criado</th>
                        <th  data-key="CHANGED"  class="keycontainer" >Alterado</th>
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

export default Page;