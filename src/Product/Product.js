/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Employee from '../../src/Employee/Employee.js';
import settings from '../settings.json';
import {createCookie,getTransactionFilter
  ,postTransactionEmpty,
  readCookie} from '../util/util.js';

//getTransaction
//readCookie

var categories = {};

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','product',null,30);
    var authentication = readCookie('authenticationid');
    //alert(authentication);
    $('#IdUser').val(authentication);

    //$('#save').click(function(e){
    //  Save();
    //  e.stopImmediatePropagation();
    //});

    $('.search').click(function(){
      var name = $('#name').val();
      LoadProduct(name);
    });

    LoadCategory("");
    LoadProduct("");
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

function LoadCategory(filter){
    getTransactionFilter(settings.endpoints.category.GET,LoadCategoryDetail,filter);
}

function LoadCategoryDetail(data){
    var html = '';
    categories = data;
    $.each(data,function(c,comp){
        html += '<option value="{0}" >{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    $('#IdCategory').html(html);
}

function getCategoryName(IdCategory){
    var result = '';
    $.each(categories,function(c,comp){
        if(comp.id == IdCategory)
            result = comp.name;
    });
    return result;
}

function RedirectEmployee(idLogin,name){
  createCookie("idLogin",idLogin,null,10);
  createCookie("name",name,null,10);
  ReactDOM.render(<Employee />, document.querySelector("#region"));
}

/*
function Save(){

  var name        = $("#name").val();
  var IdCategory  = $("#IdCategory").val();
  

  var userentry = {
    user:{
        name:name,
        IdCategory:IdCategory
    }
  };

  postTransactionEmpty(settings.endpoints.product.POST,userentry,LoadProduct,'Product was saved successfully!');

}
*/

function Delete(id){

  var userentry = {
    user:{
      id:id,
      active:0
    }
  };

  postTransactionEmpty(settings.endpoints.product.DELETE,userentry,LoadProduct,'Product was updated sucessfully!');

}


function LoadProduct(filter){ 
  getTransactionFilter(settings.endpoints.product.GET,LoadPageDetail,filter);
}

function LoadPageDetail(data,filter){
    var html = '';
    var trash = '<span class="glyphicon glyphicon glyphicon-trash pointer deleteclient" data-id="{0}" ></span>';
    $.each(data,function(c,comp){

      if(filter == null || filter == "" || comp.name.toLowerCase().indexOf(filter.toLowerCase()) > -1 ){
        html += '<tr>';
        html += '<td>{0}</td>'.replace('{0}',comp.id);
        html += '<td>{0}</td>'.replace('{0}',comp.name);
        html += '<td>{0}</td>'.replace('{0}',getCategoryName(comp.IdCategory));
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

function Product() {
  Load();
  return (
    <div>
        <br/>
        <form method="POST" action={settings.endpoints.product.POST} enctype="multipart/form-data" >
            <h3 data-key="CLIENT" class="keycontainer" >Products</h3>
            <input type="hidden" name="IdUser" id="IdUser" />
            <div class="row" >
              <div class="col-sm-4" >
                <span  data-key="NAME" class="keycontainer"  >Name</span>
                <input type="text" id="name" name="name" class="form-control c100" />
              </div>
              <div class="col-sm-4" >
                <span  data-key="PARENT" class="keycontainer"  >Category</span>
                <select id="IdCategory" name="IdCategory" class="form-control c100"  >

                </select>
              </div>
            </div>
            <br/>
            <div class="row" >
              <div class="col-sm-4" >
                <input type="file" name="file" id="file" />
              </div>
              <div class="col-sm-4 text-right" >
                <input type="button" value="Search" id="search"  class="btn btn-sucess search keycontainerbutton" data-key="SEARCH" />
                &nbsp;
                <input type="submit" value="Save" id="save"  class="btn btn-sucess keycontainerbutton" data-key="SAVE"  />
              </div>
            </div>
            <br/>
            <div class="row" >
              <div class="col-sm-8" > 
                  <table id="groups" class="table table-striped table-bordered" >
                    <thead>
                        <tr>
                            <th  data-key="ID" class="keycontainer"  >Id</th>
                            <th  data-key="NAME" class="keycontainer"  >Name</th>
                            <th  data-key="CATEGORY"  class="keycontainer" >Category</th>
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
        </form>
        
    </div>
    
  );
}

export default Product;