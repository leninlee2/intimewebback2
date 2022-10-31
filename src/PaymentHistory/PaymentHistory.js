/* eslint-disable */
import $ from 'jquery';
//import Dashboard from '../Dashboard/Dashboard.js';
//import {createCookie,readCookie} from '../util/util.js';
//import ReactDOM from 'react-dom';
import settings from '../settings.json';
import {createCookie,postTransactionEmpty
  //,postTransactionFilter
  //,postTransactionThreeParameters,readCookie
  ,postTransaction, getTransaction
  //, getTransactionFilter
} from '../util/util.js';

var firsttime = 0;
//var plantype = {};
//var plantypedata = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','paymenthistory',null,30);

    $('.search').click(function(){
        LoadClients();
    });

    $('#clientid').change(function(){
        LoadClients();
    });

    //LoadPlanType();
    LoadClients();
  });

  $(document).mouseover(function(){
    $('.deletepaymenthistory').click(function(e){
      var id = $(this).attr('data-id');
      Delete(id);
      e.stopImmediatePropagation();
    });
  });
}

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.paymenthistory.PUT,userentry,LoadPaymentHistory,'Payment History updated with success!');

}

function LoadClients(){
    getTransaction(settings.endpoints.client.GET,LoadClientsDetail,null);
}

function LoadClientsDetail(data){
    var html = '';
    if(firsttime == 0){
        $.each(data,function(c,comp){
            html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
        });
        $('#clientid').html(html);
        firsttime = 1;
    }
    
    LoadPaymentHistory();
}

function LoadPaymentHistory(){

  var IdClient = $('#clientid').val();

  if(IdClient==null || IdClient == '')
    IdClient = 0;

  var userentry = {
    user:{
       IdClient:IdClient
    }
  };

  postTransaction(settings.endpoints.wallet.GETBYID,userentry,LoadPageDetail);

}

function LoadPageDetail(data){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deletepaymenthistory" data-id="{0}" ></span>';
    $.each(data,function(c,comp){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.IdClient);
        html += '<td>{0}</td>'.replace('{0}',comp.value );
        html += '<td>{0}</td>'.replace('{0}',comp.orderID );
        if(comp.regular == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }

        if(comp.active == 1){
          html += '<td><span class="glyphicon glyphicon-ok-circle activeicon"  ></span></td>';
        }else{
          html += '<td><span class="glyphicon glyphicon-ban-circle inactiveicon"></span></td>';
        }
        html += '<td>{0}</td>'.replace('{0}',comp.createdAt);
        html += '<td>{0}</td>'.replace('{0}',comp.updatedAt);
        html += ('<td>' + trash + '</td>').replace('{0}',comp.id);
        html += '</tr>';
    });
    $('.querybody').html(html);
}

//function LoadPlanTypeDetail(data){
//  plantype = data;
//}

//function LoadPlanType(){
//  getTransaction(settings.endpoints.plantype.GET,LoadPlanTypeDetail,null);
//}

//function GetPlanTypeName(id){
//  var name = '';
//  $.each(plantype,function(c,comp){
//    if(comp.id == id)
//      name = comp.name;
//  });
//  return name;
//}

function PaymentHistory() {
  Load();
  return (
    <div>
        <br/>
        <h3 data-key="PAYMENTHISTORY" class="keycontainer" >Payment History</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span data-key="CLIENT" class="keycontainer">Client</span>
            <select id="clientid"  class="form-control c100" >

            </select>
          </div>
          <div class="col-sm-1" >
                <br/>
                <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton"  data-key="SEARCH" />
            </div>
        </div>
        <br/>
        <div class="row" >
          <div class="col-sm-10" > 
              <table id="groups" class="table table-striped table-bordered" >
                 <thead>
                    <tr>
                        <th  data-key="CLIENT" class="keycontainer">Client</th>
                        <th data-key="VALUE" class="keycontainer">Value</th>
                        <th data-key="ORDERID" class="keycontainer">OrderID</th>
                        <th data-key="REGULAR" class="keycontainer">Regular</th>
                        <th data-key="ACTIVE" class="keycontainer">Active</th>
                        <th data-key="CREATE" class="keycontainer">Created</th>
                        <th data-key="CHANGED" class="keycontainer">Changed</th>
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

export default PaymentHistory;