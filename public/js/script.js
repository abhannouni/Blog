const activeCategories = []; // Track the currently active categories as an array
const categories = document.getElementById("cat_id_string");

function toggleCategory(category) {
    const categoryCards = document.querySelectorAll('.category-card');

    // Toggle the 'active' class for the clicked category card
    category.classList.toggle('active');

    // Check if the clicked category is active
    const isActive = category.classList.contains('active');

    if (isActive) {
        // Add the clicked category to the array of active categories
        activeCategories.push(category);
    } else {
        // Remove the clicked category from the array of active categories
        const index = activeCategories.indexOf(category);
        if (index !== -1) {
            activeCategories.splice(index, 1);
        }
    }

    // Move the active categories to the top
    const parent = category.parentElement;
    categoryCards.forEach(card => {
        if (activeCategories.includes(card)) {
            parent.prepend(card);
        }
    });

    ifIsActive();
}

function ifIsActive() {
    categories.value = ""; // Clear the input field value

    for (let index = 0; index < activeCategories.length; index++) {
        const element = activeCategories[index];
        categories.value += "," + element.querySelector('p').textContent;
    }

    // Remove the leading comma if it exists
    if (categories.value.startsWith(",")) {
        categories.value = categories.value.slice(1);
    }
}
