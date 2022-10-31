/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  //,postTransactionFilter
  //,postTransactionThreeParameters,readCookie,postTransaction
  //, getTransaction
  , getTransactionFilter} from '../util/util.js';

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','user',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadUser(name);
    });

    LoadUser("");
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
  var login = $("#name").val();
  var password = $("#password").val();

  var userentry = {
    user:{
      login:login,
      password:password
    }
  };

  postTransactionEmpty(settings.endpoints.user.POST,userentry,LoadUser,'User recorded with success!');
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.user.PUT,userentry,LoadUser,'User updated with success!');
 
}

function LoadUserDetail(data,filter){
  //console.log(data);
  LoadPageDetail(data,filter);
}

function LoadUser(filter){
  //alert('Load User');
  getTransactionFilter(settings.endpoints.user.GET,LoadUserDetail,filter);
 
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer delete" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      if(filter == null || filter == "" || comp.login.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.login);
        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        if(comp.IdEmployee != null && comp.IdEmployee > 0)
          html += '<td>{0}</td>'.replace('{0}',"Cadastrado");
        else
          html += '<td><a href="#" data-id="{0}" data-name="{1}" class="redirectworker" >Funcionário</a></td>'.replace('{0}',comp.id).replace('{1}',comp.login);
          
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      }
    });
    $('.querybody').html(html);
}

function Page() {
  Load();
  return (
    <div class="">
        <br/>
        <h3 data-key="USERCONTROL" class="keycontainer" >User Management</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span data-key="NAME" class="keycontainer" >Name</span>
            <input type="text" id="name" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row">
            <div class="col-sm-4" >
                <span data-key="PASSWORD" class="keycontainer" >Password</span>
                <input type="password" id="password" class="form-control c100" />
            </div>
            <div class="col-sm-1" >
                <br/>
                <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH"  />
            </div>
            <div class="col-sm-1" >
                <br/>
                <input type="button" value="Save" id="save"  class="btn btn-sucess keycontainerbutton" data-key="SAVE"  />
            </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-6" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th data-key="NAME" class="keycontainer" >Name</th>
                        <th data-key="ACTIVE" class="keycontainer" >Active</th>
                        <th data-key="EMPLOYEE" class="keycontainer" >Worker</th>
                        <th data-key="CREATE" class="keycontainer" >Created</th>
                        <th data-key="CHANGED" class="keycontainer" >Changed</th>
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