/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  //,postTransactionFilter
  //,postTransactionThreeParameters
  ,readCookie
  //,postTransaction, getTransaction
  , getTransactionFilter} from '../util/util.js';

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','plantype',null,30);
    var token = readCookie('token');
    $('#token').val(token);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadPlanType(name);
    });

    LoadPlanType("");
  });

  $(document).mouseover(function(){
    $('.delete').click(function(e){
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

  });
}

function RedirectEmployee(idLogin,name){
  createCookie("idLogin",idLogin,null,10);
  createCookie("name",name,null,10);
  ReactDOM.render(<Employee />, document.querySelector("#region"));
}

function Save(){

  var name = $("#name").val();
  var value = $("#value").val();

  var userentry = {
    user:{
        name:name,
        value:value
    }
  };

  postTransactionEmpty(settings.endpoints.plantype.POST,userentry,LoadPlanType,'Plano Gravado com sucesso!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.plantype.PUT,userentry,LoadPlanType,'Plano Atualizado com sucesso!');

}

function LoadPlanType(filter){

  getTransactionFilter(settings.endpoints.plantype.GET,LoadPageDetail,filter);
 
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer delete" data-id="{0}" ></span>';
    $.each(data,function(c,comp){
      if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.name);
        html += '<td>{0}</td>'.replace('{0}',comp.value);          
        html += '<td>{0}</td>'.replace('{0}',comp.extra);
        html += '<td>{0}</td>'.replace('{0}',comp.limits);
        html += '<td>{0}</td>'.replace('{0}',comp.imagedesc);
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

function PlanType() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="PAYMENTPLAN" class="keycontainer" >Planos de Pagamento</h3>
        <form
          method="POST" action={settings.endpoints.plantype.POST}
          enctype="multipart/form-data"
        >
          <div class="row" >
            <div class="col-sm-4" >
              <input type="hidden" id="token" name="token"  />
              <span data-key="PLANNAME" class="keycontainer"  >Nome do Plano</span>
              <input type="text" id="name" name="name" class="form-control c100" />
            </div>
            <div class="col-sm-2" >
                  <span data-key="VALUE" class="keycontainer"  >Valor</span>
                  <input type="text" id="value" name="value" class="form-control c100" />
            </div>
            <div class="col-sm-2" >
                  <span data-key="LIMIT" class="keycontainer"  >Limite</span>
                  <input type="text" id="limits" name="limits" class="form-control c100" />
            </div>
          </div>
          <br/>
          <div class="row">
              <div class="col-sm-4" >
                  <span data-key="IMAGELAYOUT" class="keycontainer"  >Imagem Layout</span>
                  <input type="file" id="file" name="file" class="form-control c100" />
              </div>
              <div class="col-sm-4" >
                  <span data-key="EXTRA" class="keycontainer"  >Extra</span>
                  <input type="type" id="extra" name="extra" class="form-control c100" />
              </div>
          </div>
          <div class="row" >
              <div class="col-sm-6" ></div>
              <div class="col-sm-1" >
                  <br/>
                  <input type="button" value="Pesquisar" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH"  />
              </div>
              <div class="col-sm-1" >
                  <br/>
                  <input type="submit" value="Gravar"   class="btn btn-sucess keycontainerbutton" data-key="SAVE"  />
              </div>
          </div>
        </form>
        <br/>
        <div class="row" >
          <div class="col-sm-8" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th data-key="NAME" class="keycontainer"  >Nome</th>
                        <th data-key="VALUE" class="keycontainer"  >Valor</th>
                        <th data-key="EXTRA" class="keycontainer"  >Extra</th>
                        <th data-key="LIMIT" class="keycontainer"  >Limite</th>
                        <th data-key="IMAGE" class="keycontainer"  >Imagem</th>
                        <th data-key="ACTIVE" class="keycontainer"  >Ativo</th>
                        <th data-key="CREATE" class="keycontainer"  >Criado</th>
                        <th data-key="CHANGED" class="keycontainer"  >Alterado</th>
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

export default PlanType;