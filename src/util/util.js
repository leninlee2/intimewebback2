/* eslint-disable */
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Login from '../../src/Login/Login.js';
//import Restaurant from '../../src/Restaurant/Restaurant';

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

function keyTranslates(keys,language){

    $('.keycontainer').each(function(c,comp){
        $.each(keys,function(c2,comp2){
            var keydestination = $(comp).attr('data-key');
            if(comp2.IdLanguage == language
                && comp2.name == keydestination
                && comp2.active == 1
                ){
                $(comp).html(comp2.value);
            }
        });
    });

    $('.keycontainerbutton').each(function(c,comp){
        $.each(keys,function(c2,comp2){
            var keydestination = $(comp).attr('data-key');
            if(comp2.IdLanguage == language
                && comp2.name == keydestination
                && comp2.active == 1
                ){
                $(comp).val(comp2.value);
            }
        });
    });
}

function getToken(){
    var token = readCookie("token");
    if(token == null)
        token = '';
    return "Bearer " + token;
}

function getTransaction(url,getSucess,withrepository){
    var token = getToken();
    //alert(token);
    $.ajax({
        url : url,
        type: "GET",
        headers:{Authentication:token},
        success: function(data)
        {
            //console.log(data.data);
            if(withrepository != null && withrepository != undefined)
                withrepository = data.data;

            getSucess(data.data);   
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          //alert('getTransaction' + url);
          var item_result = JSON.stringify(jqXHR);
          //console.log(textStatus);
          //console.log(errorThrown);
          //console.log(jqXHR);
          //console.log(item_result);
          //alert('getTransaction' + item_result);
          ResetPage();
        }
    });
}

function getTransactionCharge(url,loaddata){
    $.ajax({
        url : url,
        type: "GET",
        headers:{Authentication:getToken()},
        success: function(data)
        {
            //console.log(data.data);
            loaddata = data.data;   
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          //console.log(textStatus);
          //console.log(errorThrown);
          //console.log(jqXHR);
          //console.log(item_result);
          ResetPage();
        }
    });
}

function getTransactionFilter(url,getSucess,filter){
    $.ajax({
        url : url,
        type: "GET",
        headers:{Authentication:getToken()},
        success: function(data)
        {
            console.log(data.data);
            getSucess(data.data,filter);   
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function getTransactionThree(url,getSucess,par1,par2){
    $.ajax({
        url : url,
        type: "GET",
        headers:{Authentication:getToken()},
        success: function(data)
        {
            console.log(data.data);
            getSucess(data.data,par1,par2);   
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransaction(url,userentry,postSuccess){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            postSuccess(data.data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransaction2(url,userentry,postSuccess,filter){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            postSuccess(data,filter);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransaction3(url,userentry,postSuccess,filter,p2){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            postSuccess(data,filter,p2);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransactionFilter(url,userentry,postSuccess,filter,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            if(message != null && message != '')
                alert(message);

            postSuccess(data.data,filter);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransactionCustom(url,userentry,postSuccess,par1,par2,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            if(message != null && message != '')
                alert(message);

            postSuccess(par1,par2);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postLoadProject(url,userentry,getSuccess){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            if(data.data != null && data.data != ''){
              var projectids = [];
              $.each(data.data,function(c,comp){
                projectids[c] = comp.IdProject;
              });
       
              getSuccess("",projectids);
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          console.log('Error - LoadProjectGroup');
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransactionFilterEmpty(url,userentry,postSuccess,filter,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            alert(message);
            postSuccess("",filter);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransactionEmpty(url,userentry,postSuccess,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            alert(message);
            postSuccess("");
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);

          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postTransactionThreeParameters(url,userentry,postSuccess
    ,second,third,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            if(message != null && message != '')
                alert(message);

            postSuccess(data.data,second,third);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          //alert(item_result);
          ResetPage();
        }
    });
}

function postTransactionFourParameters(url,userentry,postSuccess
    ,second,third,four,message){
    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            if(message != null && message != '')
                alert(message);

            postSuccess(data.data,second,third,four);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function postLoadEmployees(url,userentry,getSuccess
    ,documents,employees,users,filter){

    $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : userentry,
        headers:{Authentication:getToken()},
        success: function(data)
        {
            console.log(data.data);
            employees = data.data;
            users = data.users;
            getSuccess(documents,filter);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          var item_result = JSON.stringify(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
          console.log(item_result);
          ResetPage();
        }
    });
}

function ResetPage(){
    $('#sidenav').html('');
    $('#topmenu').html('');
    ReactDOM.render(<Login />, document.querySelector("#region"));
}

function SetProjectDetail(){
   // ReactDOM.render(<ProjectDetail />, document.querySelector("#region"));
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


export { eraseCookie, createCookie, readCookie, keyTranslates
    ,getTransaction
    ,getTransactionFilter
    ,postTransaction
    ,postTransactionFilterEmpty
    ,postTransactionThreeParameters
    ,postTransactionFourParameters
    ,postTransactionFilter 
    ,postLoadProject
    ,getTransactionCharge
    ,postLoadEmployees
    ,postTransactionEmpty
    ,postTransactionCustom
    ,postTransaction2
    ,postTransaction3
    ,getTransactionThree
    ,SetProjectDetail
};