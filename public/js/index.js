const morebutton = document.querySelector('.more');
const knowtheani = document.querySelector('.know-the-anime');


morebutton.addEventListener('click', ()=>{
    knowtheani.style.height = "auto";
    morebutton.style.display = "none";
})