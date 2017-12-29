import './css/index.css';
import './sass/index.scss';
import Str from './com.js'

window.onload = function() {
    let h1 = document.createElement('h1');
    h1.innerHTML = Str.toUpperCase();
    document.body.appendChild(h1);
    let h2 = document.createElement('h2');
    h2.innerHTML = Str.toLowerCase();
    document.body.appendChild(h2);
};