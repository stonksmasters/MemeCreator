// Get all category links and category elements
const categoryLinks = document.querySelectorAll('.category-link');
const categories = document.querySelectorAll('.category');

// Add click event listeners to category links
categoryLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        // Prevent the default behavior of the link
        event.preventDefault();

        // Get the selected category from the data-category attribute
        const selectedCategory = link.getAttribute('data-category');

        // Hide all categories
        categories.forEach(category => {
            category.classList.remove('active');
        });

        // Show the selected category
        document.querySelector(`.category[data-category="${selectedCategory}"]`).classList.add('active');
    });
});
// Trigger a click event on the default category link (e.g., 'funny' category)
document.querySelector('.category-link[data-category="funny"]').click();
