// Sample movie data (In a real application, this would come from a backend)
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
async function handleSubscription() {
    try {
        const response = await fetch('/api/payments/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        });
        const session = await response.json();
        
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            alert(result.error.message);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
// Event listeners
document.getElementById('premium-btn').addEventListener('click', handleSubscription);
document.getElementById('watchlist-btn').addEventListener('click', () => {
    // Implement watchlist display logic
});

// Add movie card click handler
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${movie.thumbnail}" alt="${movie.title}">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.genre} | ${movie.year}</p>
            <div class="movie-actions">
                <button class="watch-btn">Watch Now</button>
                <button class="watchlist-btn">Add to Watchlist</button>
                <div class="rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-count">(${movie.ratings?.length || 0})</span>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    card.querySelector('.watch-btn').addEventListener('click', () => handleWatch(movie));
    card.querySelector('.watchlist-btn').addEventListener('click', () => handleWatchlist(movie._id));
    
    return card;
}
const movies = [
    {
        title: 'Sample Movie 1',
        genre: 'Action',
        thumbnail: 'https://source.unsplash.com/random/300x450/?movie',
        year: 2024
    },
    // Add more movie objects here
];

// Function to create movie cards
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${movie.thumbnail}" alt="${movie.title}">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.genre} | ${movie.year}</p>
        </div>
    `;
    return card;
}

// Function to display movies
function displayMovies(movies) {
    const movieGrid = document.querySelector('.movie-grid');
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        movieGrid.appendChild(createMovieCard(movie));
    });
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);
});

// Genre filter
const genreButtons = document.querySelectorAll('.genre-btn');
genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const genre = button.textContent;
        const filteredMovies = genre === 'All' 
            ? movies 
            : movies.filter(movie => movie.genre === genre);
        displayMovies(filteredMovies);
    });
});

// Initialize the page with all movies
displayMovies(movies);