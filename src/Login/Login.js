/* eslint-disable */
import $ from 'jquery';
import Dashboard from '../Dashboard/Dashboard.js';
import ReactDOM from 'react-dom';
import settings from '../settings.json';
import {  postTransaction, postTransaction2,eraseCookie } from  '../util/util.js';//getTransaction

function Load(){
  $(document).ready(function(){
    $('#access').click(function(e){
      Authentication();
      e.stopImmediatePropagation();
    });
  });
}

function AuthenticationDetail(data,login){
  //alert(JSON.stringify(data));
  if(data.success == 'true' ){
    //alert('flash point');
    createCookie("authentication", login, null,5);
    if(login != 'sofocles')
      createCookie("authenticationid", data.data, null,5);
    else
      createCookie("authenticationid", "-345", null,5);

    //alert(data.token);
    createCookie("token", data.token, null,10);

    LoadUserGroup();

    ReactDOM.render(<Dashboard />, document.querySelector("#region"));
  }else{
    alert('Failure on authentication');
  }
}

function Authentication(){

  var login = $("#user").val();
  var password = $("#password").val();

  var userentry = {
    user:{
      login:login
      ,password:password
    }
  };

  eraseCookie("token");

  postTransaction2(settings.endpoints.user.LOGIN,userentry,AuthenticationDetail,login);

}

function LoadUserGroup(){
  console.log('Load - LoadUserGroup');
  var IdUser = readCookie('authenticationid');

  if(IdUser == null || IdUser == '' || IdUser == 'null'){
      ResetPage();
      return;
  }

  if(IdUser==-345){
      LoadPageMaster();
      return;
  }

  var userentry = {
      user:{
          IdUser:IdUser
      }
  };

  postTransaction(settings.endpoints.usergroup.GETBYUSER,userentry,LoadUserGroupDetail);

}

function LoadUserGroupDetail(data){
  var groups = [];
  $.each(data,function(c,comp){
      groups[c] = comp.IdGroup;
  });
  LoadFunction(groups);
}

function LoadFunction(groups){
  console.log('Load - LoadFunction');

  var userentry = {
      user:{
          groups:groups
      }
  };

  postTransaction(settings.endpoints.pagegroup.GETBYGROUP,userentry,LoadFunctionDetail);

}

function LoadFunctionDetail(data){

  if(data != null && data != '' && data != undefined){

      var pages = [];
      $.each(data,function(c,comp){
          pages[c] = comp.IdPage;
      });
  
      LoadPage(pages);

  }
  
}

function LoadPage(pages){

  console.log('Load - LoadPage');

  //var userentry = {
  //    user:{
  //        ids:pages
  //    }
  //};

  //postTransaction(settings.endpoints.page.GETBYID,userentry,LoadPageDetail);

}

function LoadPageMaster(){


  //getTransaction(settings.endpoints.page.GET,LoadPageDetail,null);
}


/*
function Contains(value,arr){
  if(arr.length == 0){
      console.log('Primeira rodada');
      return false;
  }

  var mresult = false;
      
  for(var i = 0;i < arr.length;i++){
      console.log('current running')
      if(arr[i] == value){
          console.log('found it');
          i = arr.length;
          mresult = true;
      }
  }
  return mresult;
}
*/

function ResetPage(){
  $('#sidenav').html('');
  ReactDOM.render(<Login />, document.querySelector("#region"));
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Cookies
function createCookie(name, value, hours,minutes) {
  var date    = new Date();
  var expires = '';
  if (hours || hours > 0) {
      //var date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }else if(minutes || minutes > 0){
      //var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      console.log('expiration');
      expires = "; expires=" + date.toGMTString();
  }else{
      expires = "";
  } 
      
  document.cookie = name + "=" + value + expires + "; path=/";
}

function Login() {
  Load();
  return (
    <div class="hide" >
        <br/>
        <h3>Administrative Area</h3>
        <div class="row" >
          <div class="col-sm-4" >
            <span>Login</span>
            <input type="text" id="user" class="form-control c100" />
          </div>
        </div>
        <div class="row" >
          <div class="col-sm-4" >
            <span>Password</span>
            <input type="password" id="password" class="form-control c100" />
          </div>
        </div>
        <div class="row" >
          <div class="col-sm-4 right" >
            <br/>
            <div class="pull-right" >
              <input type="button" value="Access" id="access"  class="btn btn-sucess" />
            </div>
          </div>
        </div>
    </div>
    
  );
}

export default Login;