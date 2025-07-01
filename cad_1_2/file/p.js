function openTab(index) {
      const tabs = document.querySelectorAll('.tab');
      const contents = document.querySelectorAll('.tab-content');

      tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        contents[i].classList.toggle('active', i === index);
      });
    }

    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle('active');
    }
	function toggleFullscreen(sliderId) {
        const slider = document.getElementById(sliderId);
        const button = document.getElementById('iframe-fullscreen-btn');
        
        if (!document.fullscreenElement) {
            if (slider.requestFullscreen) {
                slider.requestFullscreen();
            } else if (slider.mozRequestFullScreen) { // Firefox
                slider.mozRequestFullScreen();
            } else if (slider.webkitRequestFullscreen) { // Chrome, Safari and Opera
                slider.webkitRequestFullscreen();
            } else if (slider.msRequestFullscreen) { // IE/Edge
                slider.msRequestFullscreen();
            }
            button.classList.add('fullscreen'); // Add class for fullscreen
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            button.classList.remove('fullscreen'); // Remove class when exiting fullscreen
        }
    }

   function toggleMenu() {
    document.getElementById('menuPanel').classList.toggle('show');
  }

  // بستن منو وقتی بیرونش کلیک شد
  document.addEventListener('click', function (e) {
    const menu = document.getElementById('menuPanel');
    const toggle = document.querySelector('.menu-toggle');
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
