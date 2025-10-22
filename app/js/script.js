const btn = document.getElementById('burger');
const menu = document.getElementById('menu');

btn.addEventListener('click', () => { 
  btn.classList.toggle('open'); 
  menu.classList.toggle('open');
})

// const swiper = new Swiper('.tours__slider', {
//     // Optional parameters
//     direction: 'horizontal',
//     loop: true,
//     spaceBetween: 32,

//     // // If we need pagination
//     // pagination: {
//     //   el: '.swiper-pagination',
//     // },
  
//     // // Navigation arrows
//     // navigation: {
//     //   nextEl: '.swiper-button-next',
//     //   prevEl: '.swiper-button-prev',
//     // },
  
//     // And if we need scrollbar
//     // scrollbar: {
//     //   el: '.swiper-scrollbar',
//     // },
//   });

const swiperConfigs = {
    '.tours__slider': {
        loop: true,
        direction: 'horizontal',         
        slidesPerView: 'auto', 
        width: 248,      
        spaceBetween: 12,
         breakpoints: {
          640: {
            width: 248,            
          },
          768: {
            //slidesPerView: 2.3,
            spaceBetween: 32,
            width: 256
          },   
          1024: {
            // slidesPerView: 5.3,  
            width: 256          
          },          
        },
        navigation: {
          nextEl: '.tours__slider-next',
          prevEl: '.tours__slider-prev',
        },
        pagination: {
          el: '.tours__slider-pagination',
          clickable: true,
        },
    },
}
document.addEventListener('DOMContentLoaded', function() {  
    const initSwipers = () => {    
        if (typeof Swiper === 'undefined') {
          console.log('Swiper not found, retrying...');
            setTimeout(initSwipers, 500);
            return;
        }

        Object.entries(swiperConfigs).forEach(([selector, config]) => {
            if (document.querySelector(selector)) {
                new Swiper(selector, config);                
            }
        });
    };

    initSwipers();
});