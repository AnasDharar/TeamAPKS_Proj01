gsap.registerPlugin(ScrollTrigger);
    
    /* Final positions for the inner card animation.
       Adjusted for wider separation between left and right groups,
       and the rightmost card now stays inside the viewport. */
    const finalPositions = [
      { x: -550, y: -300 }, // Card 1
      { x: -175, y: -200 }, // Card 2
      { x: 210,  y: -300 }, // Card 3
      { x: 550,  y: -200 }  // Card 4
    ];
    
    // Grab all inner card elements (the glass cards inside the wrappers)
    const innerCards = document.querySelectorAll('.about-capability-card');
    
    // Create a scrubbed timeline that pins the section and animates the inner cards
    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#about-capability-cards',
        start: 'top top',
        end: '+=1000',
        scrub: true,
        pin: true
      }
    });
    
    // Animate each inner card from a lower starting state (y: 50) with a flip,
    // to its final (x, y) state.
    innerCards.forEach((card, i) => {
      mainTL.fromTo(card, 
        { x: 0, y: 100, scale: 0.5, rotationY: 180 },
        { x: finalPositions[i].x, y: finalPositions[i].y, scale: 1.2, rotationY: 0, ease: 'power2.inOut' },
        i * 0.1 // stagger start times slightly
      );
    });
    
    // Animate the bag container scaling as the cards emerge
    gsap.to('.bag-container', {
      scrollTrigger: {
        trigger: '#about-capability-cards',
        start: 'top top',
        end: '+=1000',
        scrub: true,
        // pin: true,
        // onEnter: () => gsap.to('.bag-container', { position: 'fixed', bottom: '0' }),
        // onLeave: () => gsap.to('.bag-container', { position: 'absolute', bottom: '0' })
      },
      scale: 1.2,
      ease: 'power2.inOut'
    });
    
    // Animate the project popup text
    gsap.timeline({
      scrollTrigger: {
        trigger: '#about-capability-cards',
        start: 'top 90%',
        end: 'top 60%',
        scrub: true
      }
    })
    .fromTo('#projectPopup', 
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: -10, scale: 1, ease: 'power2.out' }
    )
    .to('#projectPopup', { opacity: 0, y: -40, ease: 'power2.in' });
    
    // Start a continuous bobbing tween on the card wrappers so the WHOLE card bobs,
    // even during scrolling.
    gsap.to('.card-wrapper', {
      y: '+=20',       // bob 20px down relative to its current position
      duration: 0.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });