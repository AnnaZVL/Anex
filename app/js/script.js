const btn = document.getElementById('burger');
const menu = document.getElementById('menu');

btn.addEventListener('click', () => { 
  btn.classList.toggle('open'); 
  menu.classList.toggle('open');
})

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
            spaceBetween: 32,
            width: 256
          },   
          1024: {             
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
    '.hotels__slider': {    
        loop: true,
        slidesPerView: 'auto', 
        centeredSlides: true,    
        // autoplay: {
        //     delay: 2500,
        //     disableOnInteraction: false,
        // },             
        watchSlidesProgress: true,
        spaceBetween: 12,
        resistanceRatio: 0,
        touchRatio: 1,
        pagination: {
            el: '.hotels__slider-pagination',
            clickable: true,
        },
        on: {
            init: function(swiper) {                
                swiper.autoplay.start(); 
            }
        }        
      },
      '.revievs__slider': {        
          direction: 'horizontal', 
          spaceBetween: 12,  
          slidesPerView: 1.2,
          breakpoints: {
            1024: {             
              slidesPerView: 4,
              spaceBetween: 32,          
            }, 
          } ,    
          navigation: {
            nextEl: '.revievs__slider-next',
            prevEl: '.revievs__slider-prev',
          },
          pagination: {
            el: '.revievs__slider-pagination',
            clickable: true,
          },
      }
}
// const swiperConfigs = {
//     // '.tours__slider': {
//     //     loop: true,
//     //     direction: 'horizontal',         
//     //     slidesPerView: 'auto', 
//     //     width: 248,      
//     //     spaceBetween: 12,
//     //      breakpoints: {
//     //       640: {
//     //         width: 248,            
//     //       },
//     //       768: {            
//     //         spaceBetween: 32,
//     //         width: 256
//     //       },   
//     //       1024: {             
//     //         width: 256          
//     //       },          
//     //     },
//     //     navigation: {
//     //       nextEl: '.tours__slider-next',
//     //       prevEl: '.tours__slider-prev',
//     //     },
//     //     pagination: {
//     //       el: '.tours__slider-pagination',
//     //       clickable: true,
//     //     },
//     // },
//     // '.hotels__slider': {    
//     //     loop: true,
//     //     slidesPerView: 'auto', 
//     //     centeredSlides: true,    
//     //     autoplay: {
//     //         delay: 2500,
//     //         disableOnInteraction: false,
//     //     },             
//     //     watchSlidesProgress: true,
//     //     spaceBetween: 12,
//     //     resistanceRatio: 0,
//     //     touchRatio: 1,
//     //     pagination: {
//     //         el: '.hotels__slider-pagination',
//     //         clickable: true,
//     //     },
//     //     on: {
//     //         init: function(swiper) {                
//     //             swiper.autoplay.start(); 
//     //         }
//     //     }        
//     //   },
//       '.revievs__slider': {        
//         direction: 'horizontal',         
//         // slidesPerView: 'auto',        
//         // width: 248,      
//         // spaceBetween: 12,
//         //  breakpoints: {
//         //   640: {
//         //     width: 248,            
//         //   },
//         //   768: {            
//         //     spaceBetween: 32,
//         //     width: 352
//         //   },   
//         //   1024: {                        
//         //     width: 352          
//         //   },          
//         // },
//         // slidesPerView: 1.2,              
//         spaceBetween: 12,       
//         navigation: {
//           nextEl: '.revievs__slider-next',
//           prevEl: '.revievs__slider-prev',
//         },
//         pagination: {
//           el: '.revievs__slider-pagination',
//           clickable: true,
//         },
//       },
//     }

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

//MORE
const btnMore = document.getElementById('more');
const hotelsList = document.querySelectorAll('.hotels__card--mobile');

if (btnMore) {
  btnMore.addEventListener('click', () => {
    console.log('object, ', hotelsList.length);
    hotelsList.forEach(item => {
          item.classList.remove('hidden');
      });
  })
}