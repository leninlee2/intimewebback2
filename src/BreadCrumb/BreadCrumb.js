import $ from 'jquery';
import Dashboard from '../Dashboard/Dashboard.js';
import ReactDOM from 'react-dom';

function Load(local){
    $(document).ready(function(){
        $('#local').html(local);

        $('#maindashboard').click(function(){
            ReactDOM.render(<Dashboard />, document.querySelector("#region"));
        });
    });
}

function BreadCrumb(local) {
    //alert(local);
    Load(local);
    return (
      <div>
          <br/>
          {/*
          <a href="javascript:void()" id="maindashboard" >DashBoard</a><span id="local" >props.local</span>
          */}
      </div>
    );
  }
  
export default BreadCrumb;