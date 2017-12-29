import config from './config.json';
import styles from './Greeter.css';//导入

function Greeter(){
	let h1=document.createElement('h1');
	h1.innerHTML=config.greetText;
	h1.className=styles.root;
	document.querySelector('#root').appendChild(h1);
}


export default Greeter
