/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  ,readCookie
  , getTransaction} from '../util/util.js';//,postTransactionFilter,postTransaction,postTransactionThreeParameters,getTransactionFilter

var idLogin = 0;

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','employee',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      //var name = $('#name').val();
      LoadEmployee();
    });

    $('#groupname').click(function(e){
      LoadEmployee();
      e.stopImmediatePropagation();
    });

    // setter
    idLogin = readCookie("idLogin");
    var myname = readCookie("name");
      
    //LoadEmployee();

    if(myname != null ){
      console.log(myname);
      console.log(idLogin);
      console.log('Test 2');
      console.log('was set');
      ReactDOM.render(myname, document.querySelector("#logindescription"));
    }

  });

  $(document).mouseover(function(){
    $('.deleteemployee').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });
  });
}

function Save(){

  var name = $("#name").val();
  var cpf = $("#cpf").val();
  var phone = $("#phone").val();
  var email = $("#email").val();
  var address = $("#address").val();

  var userentry = {
    user:{
      name:name,
      cpf:cpf,
      phone:phone,
      email:email,
      address:address,
      idlogin:idLogin
    }
  };
 
  postTransactionEmpty(settings.endpoints.employee.POST,userentry,LoadEmployee,'Empregado Gravado com sucesso!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.employee.PUT,userentry,LoadEmployee,'Funcionário Atualizada com sucesso!');

}

function LoadEmployeeIntermediate(data){
  console.log(data);
  var name = $('#name').val();
  LoadEmployeeDetail(data,name); 
}

function LoadEmployee(){

  getTransaction(settings.endpoints.employee.GET,LoadEmployeeIntermediate,null);
 
}

function LoadEmployeeDetail(data,filter){
  var html = '';
  var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deleteemployee" data-id="{0}" ></span>';
  $.each(data,function(c,comp){

    if(filter == null 
      || filter == "" 
      || filter == "0" 
      || comp.name == null
      || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
      html += '<tr>';
      html += '<td>{0}</td>'.replace('{0}',comp.name);
      html += '<td>{0}</td>'.replace('{0}',comp.cpf);
      html += '<td>{0}</td>'.replace('{0}',comp.phone);
      html += '<td>{0}</td>'.replace('{0}',comp.email);
      html += '<td>{0}</td>'.replace('{0}',comp.address);
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

function Employee() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="EMPLOYEERECORD" class="keycontainer" >Cadastro de Funcionario</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="NAME"  class="keycontainer"  >Nome</span>
            <input id="name" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="PERSONALID"  class="keycontainer"  >CPF</span>
            <input id="cpf" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="PHONE"  class="keycontainer"  >Telefone</span>
            <input type="text" id="phone" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="EMAIL"  class="keycontainer"  >E-mail</span>
            <input type="text" id="email" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-8" >
            <span  data-key="ADDRESS"  class="keycontainer"  >Endereço</span>
            <input type="text" id="address" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-2" >
            <div id="logindescription" >
            </div>
          </div>
          <div class="col-sm-6" >
              &nbsp;
              <input type="button" value="Gravar" id="save" class="btn btn-sucess pull-right t10 keycontainerbutton" data-key="SAVE" />
              &nbsp;
              <input type="button" value="Pesquisar" class="btn btn-sucess search pull-right t10 keycontainerbutton" data-key="SEARCH" />
              &nbsp;
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-8" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="NAME"  class="keycontainer"  >Nome</th>
                        <th  data-key="PERSONALID"  class="keycontainer"  >CPF</th>
                        <th  data-key="PHONE"  class="keycontainer" >Telefone</th>
                        <th  data-key="EMAIL"  class="keycontainer"  >E-mail</th>
                        <th  data-key="ADDRESS"  class="keycontainer"  >Endereço</th>
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
        
        <br/>
        <br/>
    </div>
    
  );
}

export default Employee;