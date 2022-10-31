/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import settings from '../settings.json';
import {createCookie,getTransactionFilter
  ,postTransactionEmpty} from '../util/util.js';//readCookie,getTransaction

//var plantypes = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','client',null,30);

    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadUser(name);
    });

    //LoadPlan();
    LoadUser("");
  });

  $(document).mouseover(function(){
    $('.deleteclient').click(function(e){
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

  var name        = $("#name").val();
  var phone       = $("#phone").val();
  var zipcode     = $("#zipcode").val();
  var email       = $("#email").val();
  var address     = $("#address").val();
  var itemnumber  = $("#itemnumber").val();
  var state       = $("#state").val();
  var country     = $("#country").val();

  /*
  var name              = req.body.user.name;
  var phonenumber       = req.body.user.phonenumber; 
  var zipcode           = req.body.user.zipcode; 
  var address           = req.body.user.address; 
  var itemnumber        = req.body.user.itemnumber;
  var state             = req.body.user.state;
  var country           = req.body.user.country;
  */

  var userentry = {
    user:{
        name:name,
        phonenumber:phone,
        email:email,
        zipcode:zipcode,
        address:address,
        itemnumber:itemnumber,
        state:state,
        country:country
    }
  };

  postTransactionEmpty(settings.endpoints.client.POST,userentry,LoadUser,'Client was saved with success!');

}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.client.PUT,userentry,LoadUser,'Client was updated sucessfully!');

}

//function LoadPlan(){
//    getTransaction(settings.endpoints.plantype.GET,LoadPlanDetail,null);
//}

//function LoadPlanDetail(data){
//  plantypes = data;
//  var html = '<option value="0">Todos</option>';
//  $.each(data,function(c,comp){
//    html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
//  });
//  $('#plan').html(html);
//}

//function GetPlanName(IdPlan){
//  var name = '';
//  $.each(plantypes,function(c,comp){
//      if(comp.id == IdPlan)
//        name = comp.name;
// });
//  return name;
//}

function LoadUser(filter){ 
  getTransactionFilter(settings.endpoints.client.GET,LoadPageDetail,filter);

}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deleteclient" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.name);
        html += '<td>{0}</td>'.replace('{0}',(comp.email!=undefined?comp.email:""));
        html += '<td>{0}</td>'.replace('{0}',comp.phonenumber);
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

function Client() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="CLIENT" class="keycontainer" >Clients</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="NAME" class="keycontainer"  >Name</span>
            <input type="text" id="name" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="EMAIL" class="keycontainer"  >E-mail</span>
            <input type="text" id="email" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="PHONE" class="keycontainer"  >Phone</span>
            <input type="text" id="phone" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="ADDRESS" class="keycontainer"  >Address</span>
            <input type="text" id="address" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="NUMBER" class="keycontainer"  >Number</span>
            <input type="text" id="itemnumber" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="NUMBER" class="keycontainer"  >Zip Code</span>
            <input type="text" id="zipcode" class="form-control c100" />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="STATE" class="keycontainer"  >State</span>
            <input type="text" id="state" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <span  data-key="COUNTRY" class="keycontainer"  >Country</span>
            <input type="text" id="country" class="form-control c100" />
          </div>
          <div class="col-sm-4" >
            <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton" data-key="SEARCH" />
            &nbsp;
            <input type="button" value="Save" id="save"  class="btn btn-sucess keycontainerbutton" data-key="SAVE"  />
          </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-12" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="NAME" class="keycontainer"  >Name</th>
                        <th  data-key="EMAIL"  class="keycontainer" >E-mail</th>
                        <th  data-key="EMAIL"  class="keycontainer" >Phone</th>
                        <th  data-key="ACTIVE" class="keycontainer"  >Active</th>
                        <th  data-key="CREATE" class="keycontainer" >Created</th>
                        <th  data-key="CHANGED" class="keycontainer" >Changed</th>
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

export default Client;