document.addEventListener("DOMContentLoaded", () => {
    // ----- Background Music Toggle -----
    const bgMusic = document.getElementById("bgMusic");
    const musicToggle = document.getElementById("musicToggle");
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
      }
    });
  
    // ----- Modal for "Yes, Always" Button -----
    const yesBtn = document.getElementById("yesBtn");
    const thankModal = document.getElementById("thankModal");
    const closeModal = document.querySelector(".close");
  
    yesBtn.addEventListener("click", () => {
      thankModal.style.display = "flex";
    });
  
    closeModal.addEventListener("click", () => {
      thankModal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === thankModal) {
        thankModal.style.display = "none";
      }
    });
  
    // ----- Improved "Not Today" Button Movement -----
    const buttonGroup = document.querySelector(".button-group");
    const noBtn = document.getElementById("noBtn");
  
    // Set button group as relative positioning context
    buttonGroup.style.position = 'relative';
    buttonGroup.style.minHeight = '200px';
  
    // Initialize button position
    noBtn.style.position = 'absolute';
    noBtn.style.transition = 'all 0.3s ease';
  
    function moveButton() {
      const buttonGroupRect = buttonGroup.getBoundingClientRect();
      const yesBtnRect = yesBtn.getBoundingClientRect();
      const noBtnRect = noBtn.getBoundingClientRect();
      
      // Calculate safe boundaries within button group
      const minX = 0;
      const maxX = buttonGroupRect.width - noBtnRect.width;
      const minY = 0;
      const maxY = buttonGroupRect.height - noBtnRect.height;
      
      // Function to generate random position
      function getRandomPosition() {
        const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        return { x, y };
      }
      
      // Function to check if positions overlap
      function isOverlapping(x, y) {
        const noBtnNewRect = {
          left: buttonGroupRect.left + x,
          right: buttonGroupRect.left + x + noBtnRect.width,
          top: buttonGroupRect.top + y,
          bottom: buttonGroupRect.top + y + noBtnRect.height
        };
        
        const buffer = 10; // Extra space between buttons
        
        return !(noBtnNewRect.right < yesBtnRect.left - buffer ||
                 noBtnNewRect.left > yesBtnRect.right + buffer ||
                 noBtnNewRect.bottom < yesBtnRect.top - buffer ||
                 noBtnNewRect.top > yesBtnRect.bottom + buffer);
      }
      
      // Try to find a non-overlapping position
      let newPos;
      let attempts = 0;
      const maxAttempts = 50;
      
      do {
        newPos = getRandomPosition();
        attempts++;
      } while (isOverlapping(newPos.x, newPos.y) && attempts < maxAttempts);
      
      // Apply new position
      noBtn.style.left = `${newPos.x}px`;
      noBtn.style.top = `${newPos.y}px`;
    }
    
    // Move button on hover and click
    noBtn.addEventListener("mouseover", moveButton);
    noBtn.addEventListener("click", moveButton);
    
    // Initial positioning
    setTimeout(() => {
      moveButton();
    }, 0);
  
    // ----- Falling Hearts Animation -----
    const canvas = document.getElementById("heartsCanvas");
    const ctx = canvas.getContext("2d");
    let hearts = [];
    const heartCount = 30;
  
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
  
    function drawHeart(x, y, size, color, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size/2, 0, -size/2, topCurveHeight);
      ctx.bezierCurveTo(-size/2, size, 0, size + topCurveHeight, 0, size * 1.5);
      ctx.bezierCurveTo(0, size + topCurveHeight, size/2, size, size/2, topCurveHeight);
      ctx.bezierCurveTo(size/2, 0, 0, 0, 0, topCurveHeight);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
  
    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 10,
        speed: Math.random() * 1 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: `rgba(168,0,0,${Math.random() * 0.5 + 0.3})`
      });
    }
  
    function animateHearts() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach(heart => {
        drawHeart(heart.x, heart.y, heart.size, heart.color, heart.rotation);
        heart.y += heart.speed;
        heart.rotation += heart.rotationSpeed;
        if (heart.y > canvas.height + heart.size) {
          heart.y = -heart.size;
          heart.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animateHearts);
    }
    animateHearts();
  });