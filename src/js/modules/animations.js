export const initAnimations = () => {
    console.log('Initializing custom micro-animations...');
    
    // Example: Add intersection observer for smooth reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    const products = document.querySelectorAll('.product, .product-view, .categories-item');
    products.forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
    });
};
