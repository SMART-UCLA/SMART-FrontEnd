import './App.css';
import imgimg from "../assets/SMARTlogo.jpeg";
// import './../styles/globals.css'
import coolerowl from '../assets/coolerowl.gif'

function Home() {
  return (
	  <div className = "bg-white left-0">
		<div className ="description-panel bg-white absolute z-50 inset-y-0 right-0 rounded-md flex flex-col m-4">
			<img src = {imgimg} alt = "cool logo :3"/>
			<p>Welcome to the SMART Project</p>
		</div>
	  </div>
  );
}

export default Home;