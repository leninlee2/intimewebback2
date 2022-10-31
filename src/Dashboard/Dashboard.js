import $ from 'jquery';
import ReactDOM from 'react-dom';
import Status from '../Status/Status.js';
import Category from '../Category/Category.js';
import Restaurant from '../Restaurant/Restaurant';
import Product from '../Product/Product';
import OrderAuctions from '../OrderAuctions/OrderAuctions';
import Address from '../Address/Address';

function Load(){
  $(document).ready(function(){

    createCookie('currentpage','dashboard',null,30);

    $('#restaurantaccess').click(function(e){
      ReactDOM.render(<Restaurant />, document.querySelector("#region"));
    });

    $('#productsaccess').click(function(e){
      ReactDOM.render(<Product />, document.querySelector("#region"));
    });

    $('#categoryaccess').click(function(e){
      ReactDOM.render(<Category />, document.querySelector("#region"));
    });

    //orderauctionsaccess
    $('#orderauctionsaccess').click(function(e){
      ReactDOM.render(<OrderAuctions />, document.querySelector("#region"));
    });

    //addressaccess
    $('#addressaccess').click(function(e){
      ReactDOM.render(<Address />, document.querySelector("#region"));
    });


    //statusaccess
    $('#statusaccess').click(function(e){
      ReactDOM.render(<Status />, document.querySelector("#region"));
    });

  });
}

// Cookies
function createCookie(name, value, hours,minutes) {
  var date = new Date();
  var expires = '';
  if (hours || hours > 0) {
      //var date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }else if(minutes || minutes > 0){
      //var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }else{
      expires = "";
  } 
      
  document.cookie = name + "=" + value + expires + "; path=/";
}


function Dashboard() {
  Load();
  return (
    <div>
        <br/>
        <h3 class="keycontainer" data-key="DASH" >[DASH]</h3>
        <div class="row" >
          <div class="col-sm-4 " >
            <br/>
            <span  data-key="DASH" >Dashboard</span>
            <span> --</span>
            <a href="/"  alt=""  id="logout">Logout</a>
          </div>
        </div>
        <div class="row" >
          <div class="col-sm-2" >
              <img src="./folder.png" alt="" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="restaurantaccess"  data-key="RESTAURANTS" value="RESTAURANTS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png" alt=""  class="c100 h100" />
              <div class="text-center">
                <input type="button" id="categoryaccess"  data-key="CATEGORY" value="CATEGORIES" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png"  alt=""  class="c100 h100" />
              <div class="text-center">
                <input type="button" id="productsaccess" data-key="PRODUCTS" value="PRODUCTS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png"  alt=""  class="c100 h100" />
              <div class="text-center">
                <input type="button" id="statusaccess"  data-key="STATUS" value="STATUS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png" alt="" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="orderauctionsaccess"  data-key="ORDERS" value="ORDERS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png" alt="" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="addressaccess"  data-key="ADDRESS" value="ADDRESS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>
          
        </div>
        <div class="row" >
          <div class="col-sm-2" >
              <img src="./folder.png" alt="" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="orderauctionsaccess"  data-key="ORDERS" value="ORDERS" class="btn btn-sucess keycontainerbutton" />
              </div>
          </div>

        </div>
    </div>
    
  );
}

export default Dashboard;