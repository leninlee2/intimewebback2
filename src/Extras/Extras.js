import $ from 'jquery';
import ReactDOM from 'react-dom';
import settings from '../settings.json';
import { postTransaction, postTransactionEmpty } from '../util/util';

function Load(){
  $(document).ready(function(){
    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadGroup(name);
    });

    LoadGroup("");
  });

  $(document).mouseover(function(){
    $('.delete').click(function(e){
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

  postTransactionEmpty(settings.endpoints.group.POST,userentry,LoadGroup,'Grupo Gravado com sucesso!');

  /*
  $.ajax({
      url : settings.endpoints.group.POST,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data : userentry,
      success: function(data)
      {
          alert('Grupo Gravado com sucesso!');
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

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };


  $.ajax({
      url : settings.endpoints.group.PUT,
      type: "POST",
      contentType: "application/x-www-form-urlencoded",
      data : userentry,
      success: function(data)
      {
          alert('Grupo Atualizado com sucesso!');
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
}

function LoadGroup(filter){
 
  $.ajax({
      url : settings.endpoints.group.GET,
      type: "GET",
      success: function(data)
      {
          console.log(data.data);
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
}

function LoadGroupDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer delete" data-id="{0}" ></span>';
    $.each(data,function(c,comp){
      //alert('test');
      if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
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

function Extras() {
  Load();
  return (
    <div>
        <br/>
        <h3>Extras - Em Desenvolvimento</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span>Nome do Grupo</span>
            <input type="text" id="name" class="form-control c100" />
          </div>
          <div class="col-sm-1" >
            <br/>
            <input type="button" value="Pesquisar" id="search"  class="btn btn-sucess search" />
          </div>
          <div class="col-sm-1" >
            <br/>
            <input type="button" value="Gravar" id="save"  class="btn btn-sucess" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-6" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ativo</th>
                        <th>Criado</th>
                        <th>Alterado</th>
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

export default Extras;