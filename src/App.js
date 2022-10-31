/* eslint-disable */
import './App.css';
import './css/bootstrap/bootstrap.min.css';
import './css/bootstrap/Site.css';
import Login from '../src/Login/Login.js';
import Group from '../src/Group/Group.js';
import Page from '../src/Page/Page.js';
import User from '../src/User/User.js';
import UserGroup from '../src/UserGroup/UserGroup.js';
import Language from '../src/Language/Language.js';
import KeyWord from '../src/KeyWord/KeyWord.js';
import Employee from '../src/Employee/Employee.js';
import PageGroup from '../src/PageGroup/PageGroup.js';
import PlanType from '../src/PlanType/PlanType.js';
import Client from '../src/Client/Client.js';
import PaymentHistory from '../src/PaymentHistory/PaymentHistory.js';
import Dashboard from '../src/Dashboard/Dashboard.js';
import Restaurant from '../src/Restaurant/Restaurant';
import $ from 'jquery';
import ReactDOM from 'react-dom';
//import Project from './Project/Project';
import TrendStatus from './Status/Status';
import Category from './Category/Category';
import Product from './Product/Product';
import MapBox from './MapBox/MapBox';
import settings from './settings.json';
import {getTransaction
    //, getTransactionFilter
    , keyTranslates, postTransaction} from '../src/util/util.js';

var timeLoad = 0;

function Load(){

    $(document).ready(function(e){

       LoadLanguage();
       setInterval(function(){
            //var date = new Date();
            var url    = window.location.href;
            var mapbox = (url.indexOf('mapbox') > -1?true:false);
            //alert('mapbox:' + mapbox);

            if (readCookie("authentication") == null && mapbox==false ){
                //alert('will be reset');
                $('#topmenu').html('');
                $('#sidenav').html('');
                ResetPage();
            }else{
                if( (timeLoad==0 && readCookie("authentication") != null ) || (mapbox==true && timeLoad==0  ) ){

                    if(mapbox==true){
                        $('body').attr('style','padding-top:0px !important;padding-bottom:0px !important;');
                        $('#region').removeClass('container');//body-content
                        $('#region').removeClass('body-content');//body-content
                        $('.navbar.navbar-inverse.navbar-fixed-top').remove();
                        $('#topmenu').remove();
                        $('#sidenav').remove();
                    }

                    //alert('Mapbox - entry fixmenu');
                    if(mapbox==false)
                        LoadFixMenu();

                    CheckPage();

                    if(mapbox==false)
                        LoadUserGroup();

                    timeLoad = 1;
                }
            }

            Events();
       }, 1000);

       $('#description').hide();
       $('#login').click(function(){
            ResetPage();
       });

       $('.togdesc').mouseover(function(e){
            var description = $(this).attr('title');
            $('#description').html(description);
            $('#description').css( 'position', 'absolute' );
            $('#description').css( 'top', e.pageY );
            $('#description').css( 'left', e.pageX + 10 );
            $('#description').show();
            e.stopImmediatePropagation();
       });

       $('.reddashboard').click(function(){
            createCookie('currentpage','dashboard',null,30);
            SetDashboard();
       });
       
    });

    $(document).mouseover(function(){
        LoadLanguage();

        $('#language').change(function(e){
            LoadLanguage();
        });
    });
    
}

function LoadFixMenu(){

     var menu = '' ;// '<a href="#" class="groupaccess" ><span class="glyphicon glyphicon glyphicon-folder-close fwhite togdesc"    title="Grupo" ></span></a>';
     //menu += '<a href="#" class="pageaccess" ><span class="glyphicon glyphicon glyphicon-open-file fwhite togdesc" title="Página" ></span></a>';
     menu += '<a href="#" class="useraccess" ><span class="glyphicon glyphicon glyphicon-user fwhite togdesc" title="Usuário" ></span></a>';
     //menu += '<a href="#" class="usergroupaccess"><span class="glyphicon glyphicon glyphicon-th-large fwhite togdesc" title="Grupo vs Usuário" ></span></a>';
     menu += '<a href="#" class="languageaccess"><span class="glyphicon glyphicon glyphicon-eye-open fwhite togdesc" title="Language" ></span></a>';
     menu += '<a href="#" class="keyaccess"><span class="glyphicon glyphicon glyphicon-book fwhite togdesc" title="Chave" ></span></a>';
     //menu += '<a href="#" class="employeeaccess"><span class="glyphicon glyphicon glyphicon-eur fwhite togdesc" title="Funcionário" ></span></a>';
     //menu += '<a href="#" class="pagegroupaccess"><span class="glyphicon glyphicon glyphicon-superscript fwhite togdesc" title="Grupo Vs Função" ></span></a>';
     //menu += '<a href="#" class="planttypepaccess"><span class="glyphicon glyphicon glyphicon-user fwhite togdesc" title="Pacote de Compra" ></span></a>';
     menu += '<a href="#" class="clientaccess"><span class="glyphicon glyphicon glyphicon-user fwhite togdesc" title="Cliente" ></span></a>';
     menu += '<a href="#" class="paymenthistoryaccess"><span class="glyphicon glyphicon glyphicon glyphicon-barcode fwhite togdesc" title="Pagamentos" ></span></a>';

     $('#sidenav').html(menu);     

}

function LoadLanguage(){
    getTransaction(settings.endpoints.language.GET,LoadLanguageDetail,null);
}

function LoadLanguageDetail(data){
    var html = '';
    $.each(data,function(c,comp){
        if(comp.active == 1)
            html += '<option value="{0}">{1}</option>'.replace('{0}',comp.id).replace('{1}',comp.name);
    });
    if($('#language').html() == '')
        $('#language').html(html);

    LoadKeyWord();
}

function LoadKeyWordIntermediate(data){
    //console.log(data);
    var language = $('#language').val();
    keyTranslates(data,language);
}

function LoadKeyWord(){
    getTransaction(settings.endpoints.keyword.GET,LoadKeyWordIntermediate,null);
}

function Events(){

    $('.togdesc').mouseleave(function(){
        $('#description').hide();
   });

   $('.groupaccess').click(function(){
        SetGroup();
   });

   $('.pageaccess').click(function(){
        SetPage();
   });

   $('.useraccess').click(function(){
        SetUser();
   });

   $('.usergroupaccess').click(function(){
        SetUserGroup();
   });

   //languageaccess
   $('.languageaccess').click(function(){
        SetLanguage();
   });

   $('.keyaccess').click(function(){
        SetKeyWord();
   });

   $('.employeeaccess').click(function(){
        SetEmployee();
   });

   //pagegroupaccess
   $('.pagegroupaccess').click(function(){
        SetPageGroup();
   });

   $('.planttypepaccess').click(function(){
        SetPlanType();
   });

   $('.clientaccess').click(function(){
        SetClient();
   });

   $('.paymenthistoryaccess').click(function(){
        SetPaymentHistory();
   });

   //logout
   $('#logout').click(function(){
      createCookie('authentication',null,null,10);
      createCookie('authenticationid',null,null,10);
      $('#topmenu').html('');
      $('#topmenu').html('');
      ResetPage();
   });

}

function CheckPage(){
    var url    = window.location.href;
    var mapbox = (url.indexOf('mapbox') > -1?true:false);

    if(mapbox==true)
        createCookie('currentpage','mapbox',null,60);

    var page = readCookie('currentpage');
    if(page != null && page != ''){

        switch(page){
            case "mapbox":
                //alert('mapbox');
                SetMapbox();
                break;
            case "dashboard":
                SetDashboard();
                break;
            case "client":
                SetClient();
                break;
            case "employee":
                SetEmployee();
                break;
            case "group":
                SetGroup();
                break;
            case "keyword":
                SetKeyWord();
                break;
            case "language":
                SetLanguage();
                break;
            case "page":
                SetPage();
                break;
            case "pagegroup":
                SetPageGroup();
                break;
            case "paymenthistory":
                SetPaymentHistory();
                break;
            case "category":
                SetCategory();
                break;
            case "plantype":
                SetPlanType();
                break;
            case "user":
                SetUser();
                break;
            case "usergroup":
                SetUserGroup();
                break;
            case "pagegroup":
                SetPageGroup();
                break;
            case "project":
                //SetProject();
                break;
            case "trendstatus":
                //SetTrendStatus();
                break;
            case "restaurant":
                SetRestaurant();
                break;
            case "product":
                SetProduct();
                break;
            default:
                break;
        }
    }
}

function SetLanguage(){
    ReactDOM.render(<Language />, document.querySelector("#region"));
}

function SetKeyWord(){
    ReactDOM.render(<KeyWord />, document.querySelector("#region"));
}

function SetEmployee(){
    ReactDOM.render(<Employee />, document.querySelector("#region"));
}

function SetPlanType(){
    ReactDOM.render(<PlanType />, document.querySelector("#region"));
}

function SetClient(){
    ReactDOM.render(<Client />, document.querySelector("#region"));
}

function SetRestaurant(){
    ReactDOM.render(<Restaurant />, document.querySelector("#region"));
}

function SetProduct(){
    ReactDOM.render(<Product />, document.querySelector("#region"));
}

function SetCategory(){
    ReactDOM.render(<Category />, document.querySelector("#region"));
}

function SetPaymentHistory(){
    ReactDOM.render(<PaymentHistory />, document.querySelector("#region"));
}

function SetPageGroup(){
    ReactDOM.render(<PageGroup />, document.querySelector("#region"));
}

function SetProject(){
   // ReactDOM.render(<Project />, document.querySelector("#region"));
}

function SetTrendStatus(){
    ReactDOM.render(<TrendStatus />, document.querySelector("#region"));
}

function SetGroup(){
    ReactDOM.render(<Group />, document.querySelector("#region"));
}

function SetPage(){
    ReactDOM.render(<Page />, document.querySelector("#region"));
}

function SetUser(){
    ReactDOM.render(<User />, document.querySelector("#region"));
}

function SetUserGroup(){
    ReactDOM.render(<UserGroup />, document.querySelector("#region"));
}

function LoadUserGroupIntermediate(data){
    //console.log(data);
    LoadUserGroupDetail(data);
    LoadLanguage();
}

function LoadUserGroup(){
    console.log('Load - LoadUserGroup');
    var IdUser = readCookie('authenticationid');

    if(IdUser == null || IdUser == '' || IdUser == 'null'){
        ResetPage();
        return;
    }

    if(IdUser==-345){
        //LoadPageMaster();
        LoadLanguage();
        return;
    }

    var userentry = {
        user:{
            IdUser:IdUser
        }
    };

    postTransaction(settings.endpoints.usergroup.GETBYUSER,userentry,LoadUserGroupIntermediate);

    /*
    $.ajax({
        url : settings.endpoints.usergroup.GETBYUSER,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        success: function(data)
        {
            console.log(data.data);
            LoadUserGroupDetail(data.data);
            LoadLanguage();
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

    /*
    $.ajax({
        url : "http://localhost:5107/pagegroup/getbygroup",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        success: function(data)
        {
            console.log(data.data);
            LoadFunctionDetail(data.data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          alert('Error no page group');
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

    var userentry = {
        user:{
            ids:pages
        }
    };

    postTransaction(settings.endpoints.page.GETBYID,userentry,LoadPageDetail);

    /*
    $.ajax({
        url : "http://localhost:5102/page/getbyids",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        success: function(data)
        {
            console.log(data.data);
            LoadPageDetail(data.data);   
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

function LoadPageMaster(){

    console.log('Load - LoadPage');
    getTransaction(settings.endpoints.page.GET,LoadPageDetail,null);

    /*
    $.ajax({
        url : "http://localhost:5102/page/get",
        type: "GET",
        success: function(data)
        {
            console.log(data.data);
            LoadPageDetail(data.data);   
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

function LoadPageDetail(data){
    //menu
    var point = [];
    var i = 0;
    $.each(data,function(c,comp){

        //Side menu
        if(comp.name.indexOf("M_") > -1 
            && Contains(comp.name,point) == false 
            && comp.active == 1
            ){
            $('#sidenav').append(comp.style);
            point[i] = comp.name;
            i+=1;

        }
    });

    point = [];
    i = 0;
    if($('#topmenu').html() == ''){

        $.each(data,function(c,comp){
            //Side menu
            if(comp.name.indexOf("MT_") > -1 
                && Contains(comp.name,point) == false 
                && comp.active == 1
                ){
                //console.log(comp.active);
                //$('#sidenav').append(comp.style);
                $('#topmenu').append(comp.style);
                point[i] = comp.name;
                i+=1;
    
            }
        });

        //language menu:
        $('#topmenu').append('&nbsp<select id="language"  ></select>');

    }
    
}

function Contains(value,arr){
    //alert(arr.length);
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

function ResetPage(){
    $('#sidenav').html('');
    $('#topmenu').html('');
    ReactDOM.render(<Login />, document.querySelector("#region"));
}

// Cookies
function createCookie(name, value, hours,minutes) {
    if (hours || hours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }else if(minutes || minutes > 0){
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }else{
        var expires = "";
    } 
        
    document.cookie = name + "=" + value + expires + "; path=/";
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

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function SetDashboard(){
    ReactDOM.render(<Dashboard />, document.querySelector("#region"));
}

function SetMapbox(){
    ReactDOM.render(<MapBox />, document.querySelector("#region"));
}

function App() {
  Load();
  return (
    <div>        
        <div class="navbar navbar-inverse navbar-fixed-top hide">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <span class="navbar-brand reddashboard pointer" >In The Time</span> 
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav" id="topmenu" >
                        
                        
                    </ul>
                </div>
            </div>
        </div>
        <div class="sidenav hide" id="sidenav" >
            <a href="#" class="groupaccess" ><span class="glyphicon glyphicon glyphicon-folder-close fwhite togdesc"    title="Grupo" ></span></a>
            <a href="#" class="pageaccess" ><span class="glyphicon glyphicon glyphicon-open-file fwhite togdesc" title="Página" ></span></a>
            <a href="#" class="useraccess" ><span class="glyphicon glyphicon glyphicon-user fwhite togdesc" title="Usuário" ></span></a>
            <a href="#" class="usergroupaccess"><span class="glyphicon glyphicon glyphicon-th-large fwhite togdesc" title="Grupo vs Usuário" ></span></a>
            <a href="#" class="languageaccess"><span class="glyphicon glyphicon glyphicon-eye-open fwhite togdesc" title="Language" ></span></a>
            <a href="#" class="keyaccess"><span class="glyphicon glyphicon glyphicon-book fwhite togdesc" title="Chave" ></span></a>
            <a href="#" class="employeeaccess"><span class="glyphicon glyphicon glyphicon-eur fwhite togdesc" title="Funcionário" ></span></a>
            <a href="#" class="pagegroupaccess"><span class="glyphicon glyphicon glyphicon-superscript fwhite togdesc" title="Grupo Vs Função" ></span></a>
            <a href="#" class="clientaccess"><span class="glyphicon glyphicon glyphicon-user fwhite togdesc" title="Cliente" ></span></a>
            <a href="#" class="paymenthistoryaccess"><span class="glyphicon glyphicon glyphicon glyphicon-barcode fwhite togdesc" title="Pagamentos" ></span></a>
        </div>
        <div class="container body-content" id="region"  >
            
        </div>
        <div id="description" class="messagelabel overlay"  >
            <div class="row">
               <div class="col-sm-2" >
                    <span>The test</span>
               </div>
            </div>
        </div>
    </div>
  );
}

export default App;
