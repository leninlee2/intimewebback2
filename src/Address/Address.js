import $ from 'jquery';
//import ReactDOM from 'react-dom';
//import Employee from '../../src/Employee/Employee.js';
import BreadCrumb from '../BreadCrumb/BreadCrumb.js';
import {createCookie,getTransaction,getTransactionFilter
  ,postTransactionEmpty} from '../util/util.js';
import settings from '../settings.json';

var clients = {};
var restaurants = {};

function Load(){
  $(document).ready(function(){

    //console.log(settings);
    createCookie('currentpage','orderauctions',null,30);
    $('#save').click(function(e){
      Save();
      e.stopImmediatePropagation();
    });

    $('.search').click(function(){
      var name = $('#name').val();
      LoadAddress(name);
    });

    LoadClient();
    LoadRestaurants();
    LoadAddress("");
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

function LoadRestaurants(){
    getTransaction(settings.endpoints.restaurant.GET,LoadRestaurantsDetail,null);
}

function LoadRestaurantsDetail(data){
    restaurants = data;
    var html = '<option value="0">None</option>';
    $.each(data,function(c,comp){
        if(comp.active*1 === 1)
            html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('#IdRestaurant').html(html);
}

function LoadClient(){
    getTransaction(settings.endpoints.client.GET,LoadClientDetail,null);
}

function LoadClientDetail(data){
    clients = data;
    var html = '<option value="0">None</option>';
    $.each(data,function(c,comp){
        if(comp.active*1 === 1)
            html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('#IdClient').html(html);
}

function getClientName(IdClient){
    var name = '';
    for(var i = 0;i < clients.length;i++){
        if(clients[i].id*1 === IdClient*1){
            name = clients[i].name;
        }
    }
    return name;
}

function getRestaurantName(IdRestaurant){
    var name = '';
    for(var i = 0;i < restaurants.length;i++){
        if(restaurants[i].id*1 === IdRestaurant*1){
            name = restaurants[i].name;
        }
    }
    return name;
}

function RedirectEmployee(idLogin,name){
  createCookie("idLogin",idLogin,null,10);
  createCookie("name",name,null,10);
  //ReactDOM.render(<Employee />, document.querySelector("#region"));
}

function Save(){

  var IdRestaurant  = $("#IdRestaurant").val();
  var IdClient      = $("#IdClient").val();
  var phonenumber   = $("#phonenumber").val();
  var zipcode       = $("#zipcode").val();
  var address       = $("#address").val();
  var itemnumber    = $("#itemnumber").val();
  var state         = $("#state").val();
  var country       = $("#country").val();

  var userentry = {
    user:{
        IdRestaurant:IdRestaurant,
        IdClient:IdClient,
        phonenumber:phonenumber,
        zipcode:zipcode, 
        address:address,
        itemnumber:itemnumber,
        state:state,
        country:country
    }
  };


  postTransactionEmpty(settings.endpoints.address.POST,userentry
    ,LoadAddress,'Address was recorded successfully!');
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.address.PUT,userentry
    ,LoadAddress,'Address was updated successfully!');


}


function LoadAddress(filter){

  getTransactionFilter(settings.endpoints.address.GET,LoadPageDetail,filter);
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer delete" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      //if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',getClientName(comp.IdClient));
        html += '<td>{0}</td>'.replace('{0}',getRestaurantName(comp.IdRestaurant));
        html += '<td>{0}</td>'.replace('{0}',comp.phonenumber);
        html += '<td>{0}</td>'.replace('{0}',comp.zipcode);
        html += '<td>{0}</td>'.replace('{0}',comp.address);
        if(comp.active*1 === 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.state);
        html += '<td>{0}</td>'.replace('{0}',comp.country);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      //}
    });

    $('.querybody').html(html);
}

function Address() {
  Load();

  return (
    <div>
        <BreadCrumb local={<span>Address</span>} class="left" /><span class="left" >-- Addresses</span>
        <br/>
        <h3 data-key="CATEGORY" class="keycontainer" >Address</h3>
        <div class="row" >
          <div class="col-sm-2" >
            <span  data-key="RESTAURANT"  class="keycontainer"  >Restaurant</span>
            <select id="IdRestaurant"  class="form-control c100"  >
            </select>
          </div>
          <div class="col-sm-2" >
            <span  data-key="CLIENT"  class="keycontainer"  >Client</span>
            <select id="IdClient"  class="form-control c100"  >
            </select>
          </div>
          <div class="col-sm-2" >
            <span  data-key="CLIENT"  class="keycontainer"  >Phone</span>
            <input type="text" id="phonenumber" name="phonenumber"  class="form-control c100" />
          </div>
          <div class="col-sm-6" >
            <span  data-key="ADDRESS"  class="keycontainer"  >Address</span>
            <input type="text" id="address" name="address"  class="form-control c100" />
          </div>
          
        </div>
        <br/>
        <div class="row" >
            <div class="col-sm-2" >
                <span  data-key="ZIPCODE"  class="keycontainer"  >Zip Code</span>
                <input type="text" id="zipcode" name="zipcode"  class="form-control c100" />
            </div>
            <div class="col-sm-4" >
                <span  data-key="ITEMNUMBER"  class="keycontainer"  >Number</span>
                <input type="text" id="itemnumber" name="itemnumber"  class="form-control c100" />
            </div>
            <div class="col-sm-2" >
                <span  data-key="COUNTRY"  class="keycontainer"  >Country</span>
                <input type="text" id="country" name="country"  class="form-control c100" />
            </div>
            <div class="col-sm-4" >
                <span  data-key="STATE"  class="keycontainer"  >State</span>
                <input type="text" id="state" name="state"  class="form-control c100" />
            </div>
            
        </div>
        <br/>
        <div class="row" >
            <div class="col-sm-12 text-right" >
                    <br/>
                    <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton" data-key="SEARCH" />
                    <span>&nbsp;</span>
                    <input type="button" value="Save" id="save"  class="btn btn-sucess keycontainerbutton" data-key="SAVE"  />
            </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-12" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="ID"          class="keycontainer"  >Id</th>
                        <th  data-key="CLIENT"      class="keycontainer"  >Client</th>
                        <th  data-key="RESTAURANT"  class="keycontainer"  >Restaurant</th>
                        <th  data-key="PHONE"       class="keycontainer"  >Phone</th>
                        <th  data-key="ZIPCODE"     class="keycontainer"  >Zip Code</th>
                        <th  data-key="ADDRESS"     class="keycontainer"  >Address</th>
                        <th  data-key="NUMBER"      class="keycontainer"  >Number</th>
                        <th  data-key="STATE"       class="keycontainer"  >State</th>
                        <th  data-key="COUNTRY"     class="keycontainer"  >Country</th>
                        <th  data-key="CHANGED"     class="keycontainer"  >Changed</th>
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

export default Address;