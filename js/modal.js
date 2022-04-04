'use strict';


/*-------------------------
listener para fechar as janelas modais
-------------------------*/
const modalCloseButtons = document.querySelectorAll('.closeModal');
const modalWindows = document.querySelectorAll('.w3-modal');
const modalTop10 = document.querySelector('#modal-top10');
const modalGameOver = document.querySelector('#modal-gameOver');



function closeModal(element) {
     const btSelected = element;
     document.querySelector('#modal-' + btSelected.dataset.modalid).style.display = 'none'
     if (btSelected.dataset.modalid == "gameOver") reset();
}
modalCloseButtons.forEach(x => x.addEventListener('click', () => {
     document.querySelector('#modal-' + x.dataset.modalid).style.display = 'none'
     if (x.dataset.modalid == "gameOver") reset();
}));

document.body.addEventListener('keydown', function (e) {
     if (e.key === 'Escape') {
          modalWindows.forEach(x => {
               if (x.style.display == "block") {
                    x.style.display = 'none';
                    if (x.id == "modal-gameOver") reset();
               }
          })
     }
});

btTop.addEventListener('click', () => { modalTop10.style.display = 'block'; });
