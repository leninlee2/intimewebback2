import $ from 'jquery';
import ReactDOM from 'react-dom';
import Project from '../Project/Project.js';

function Load(){
  $(document).ready(function(){
    $('#projectaccess').click(function(e){
      ReactDOM.render(<Project />, document.querySelector("#region"));
    });
  });
}


function ProjectDashboard() {
  Load();
  return (
    <div>
        <br/>
        <h3>Dashboard de Projetos</h3>
        <div class="row" >
          <div class="col-sm-2" >
              <img src="./folder.png" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="projectaccess" value="Despesas" class="btn btn-sucess" />
              </div>
          </div>
          <div class="col-sm-2" >
              <img src="./folder.png" class="c100 h100" />
              <div class="text-center">
                <input type="button" id="projectaccess" value="Summário" class="btn btn-sucess" />
              </div>
          </div>
        </div>
    </div>
    
  );
}

export default ProjectDashboard;