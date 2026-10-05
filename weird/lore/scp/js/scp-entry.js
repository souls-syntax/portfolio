const sidebar = document.querySelector('.sidebar')
const menuBtn = document.querySelector('.menu-btn')
const closeBtn = document.querySelector('.close-btn')


menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    console.log("Open")
})

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    console.log("close")
})
