/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import BreadCrumb from '../BreadCrumb/BreadCrumb.js';
import {createCookie,getTransactionFilter
  ,postTransactionEmpty} from '../util/util.js';//readCookie
import settings from '../settings.json';

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
      LoadOrderAuctions(name);
    });

    //LoadPlan();
    LoadOrderAuctions("");
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

  var userentry = {
    user:{
        name:name
    }
  };

  postTransactionEmpty(settings.endpoints.category.POST,userentry
    ,LoadOrderAuctions,'Order was recorded successfully!');
 
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.category.PUT,userentry
    ,LoadOrderAuctions,'Order was updated successfully!');


}


function LoadOrderAuctions(filter){
  getTransactionFilter(settings.endpoints.orderauction.GET,LoadPageDetail,filter);
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer delete" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      //if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',comp.IdProduct);
        html += '<td>{0}</td>'.replace('{0}',comp.IdClient);
        html += '<td>{0}</td>'.replace('{0}',comp.IdAddress);
        html += '<td>{0}</td>'.replace('{0}',comp.statusOrder);
        html += '<td>{0}</td>'.replace('{0}',comp.IdRestaurant);
        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
      //}
    });

    $('.querybody').html(html);
}

function Order() {
  Load();
  return (
    <div>
        <BreadCrumb local={<span>Projetos</span>} class="left" /><span class="left" >-- Order Auctions</span>
        <br/>
        <h3 data-key="CATEGORY" class="keycontainer" >Orders</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span  data-key="NAME"  class="keycontainer"  >Product</span>
            <select id="IdProject"  class="form-control c100"  >

            </select>
          </div>
          <div class="col-sm-4" >
            <span  data-key="CLIENT"  class="keycontainer"  >Client</span>
            <select id="IdClient"  class="form-control c100"  >

            </select>
          </div>
          <div class="col-sm-4" >
            <span  data-key="ADDRESS"  class="keycontainer"  >Address</span>
            <select id="IdAddress"  class="form-control c100"  >

            </select>
          </div>
          
        </div>
        <br/>
        <div class="row" >
            <div class="col-sm-4" >
                <span  data-key="STATUS"  class="keycontainer"  >Status</span>
                <select id="statusOrder"  class="form-control c100"  >

                </select>
            </div>
            <div class="col-sm-1 right" >
                    <br/>
                    <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton" data-key="SEARCH" />
            </div>
            <div class="col-sm-1 right" >
                    <br/>
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
                        <th  data-key="PRODUCT"     class="keycontainer"  >Product</th>
                        <th  data-key="CLIENT"      class="keycontainer"  >Client</th>
                        <th  data-key="ADDRESS"     class="keycontainer"  >Address</th>
                        <th  data-key="STATUS"      class="keycontainer"  >Status</th>
                        <th  data-key="RESTAURANT"  class="keycontainer"  >Restaurant</th>
                        <th  data-key="ACTIVE"      class="keycontainer"  >Active</th>
                        <th  data-key="CREATE"      class="keycontainer"  >Created</th>
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

export default Order;