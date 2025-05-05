document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.querySelector('.content');
  
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
  
        const href = this.getAttribute('href');
        const animationType = this.dataset.animation; // Get the animation type
  
        contentDiv.classList.add(animationType); // Add the corresponding animation class
  
        contentDiv.addEventListener('animationend', function() {
          window.location.href = href;
        }, { once: true });

        contentDiv.addEventListener('animationend', function(){
            contentDiv.classList.remove(animationType);
          },{once:true});
      });
    });
  });