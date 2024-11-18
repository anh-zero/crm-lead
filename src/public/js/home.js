
const sidebar = document.querySelector('.sidebar__PC');
const toggle_menu = document.querySelector('.toggle_menu');
const content = document.querySelector('.content__main');
const content6 = document.querySelector('.content__main-list-shortcut');
const content1 = document.querySelector('.one');
const content2 = document.querySelector('.two');
const content3 = document.querySelector('.three');
const content4 = document.querySelector('.four');
const content5 = document.querySelector('.five');


toggle_menu.onclick = function () {
    sidebar.classList.toggle('hide');
    content.classList.toggle('expand');
    content1.classList.toggle('expand');
    content2.classList.toggle('expand');
    content3.classList.toggle('expand');
    content4.classList.toggle('expand');
    content5.classList.toggle('expand');
    content6.classList.toggle('expand');
}