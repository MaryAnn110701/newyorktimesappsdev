const apiKey = "k8XrW9L8Us9nRH4XHw7KlYH6s47A3uaV"; // Your API key
const newsContainer = document.getElementById("news-container");
const searchField = document.getElementById("searchField");
const homeLink = document.getElementById("homeLink");
const newsLink = document.getElementById("newsLink");
const booksLink = document.getElementById("booksLink");
async function fetchData(query = "") {
    try {
        const apiURL = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${apiKey}`;
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Network response was not ok: " + response.statusText);
        const data = await response.json();
        displayArticles(data.results, query, "topStories");
    } catch (error) {
        console.error("Error fetching data:", error);
        newsContainer.innerHTML = "<p>Unable to fetch news. Please try again later.</p>";
    }
}
async function fetchMostPopularData(query = "") {
    try {
        const apiURL = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${apiKey}`;
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Network response was not ok: " + response.statusText);
        const data = await response.json();
        displayArticles(data.results, query, "mostPopular");
    } catch (error) {
        console.error("Error fetching most popular data:", error);
        newsContainer.innerHTML = "<p>Unable to fetch news. Please try again later.</p>";
    }
}
async function fetchBooks() {
    try {
        const apiURL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`;
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Network response was not ok: " + response.statusText);
        const data = await response.json();
        if (data.results && data.results.books.length > 0) displayBooks(data.results.books);
        else newsContainer.innerHTML = "<p>No books found.</p>";
    } catch (error) {
        console.error("Error fetching books data:", error);
        newsContainer.innerHTML = "<p>Unable to fetch books. Please try again later.</p>";
    }
}
function displayArticles(articles, query, type) {
    newsContainer.innerHTML = "";
    const filteredArticles = articles.filter((item)=>{
        const hasImage = type === "topStories" && item.multimedia && item.multimedia.length > 0 || type === "mostPopular" && item.media && item.media.length > 0; // Check for images based on type
        const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.abstract.toLowerCase().includes(query.toLowerCase());
        return hasImage && matchesQuery;
    });
    filteredArticles.forEach((item)=>{
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        let imageHTML = "";
        if (type === "topStories") {
            const photo = item.multimedia && item.multimedia.length > 0 ? item.multimedia[0] : null;
            imageHTML = photo ? `<img src="${photo.url}" alt="${item.title}" class="news-image">` : '<img src="https://via.placeholder.com/300" alt="Placeholder Image" class="news-image">';
        } else if (type === "mostPopular") {
            const media = item.media && item.media.length > 0 ? item.media[0] : null;
            imageHTML = media ? `<img src="${media["media-metadata"][0].url}" alt="${item.title}" class="news-image">` : '<img src="https://via.placeholder.com/300" alt="Placeholder Image" class="news-image">';
        }
        newsItem.innerHTML = `
            ${imageHTML}
            <h2>${item.title}</h2>
            <p>${item.abstract}</p>
            <a href="${item.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}
function displayBooks(books) {
    newsContainer.innerHTML = "";
    books.forEach((book)=>{
        const bookItem = document.createElement("div");
        bookItem.classList.add("news-item");
        // Create an image element for the book cover
        const imageHTML = book.book_image ? `<img src="${book.book_image}" alt="${book.title}" class="news-image">` : "<p>No image available.</p>";
        bookItem.innerHTML = `
            ${imageHTML}
            <h2>${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Publisher: ${book.publisher}</p>
            <a href="${book.amazon_product_url}" target="_blank">Buy on Amazon</a>
        `;
        newsContainer.appendChild(bookItem);
    });
}
searchField.addEventListener("input", (event)=>{
    const query = event.target.value.trim();
    fetchData(query);
});
homeLink.addEventListener("click", (event)=>{
    event.preventDefault();
    fetchData();
});
newsLink.addEventListener("click", (event)=>{
    event.preventDefault();
    fetchMostPopularData();
});
booksLink.addEventListener("click", (event)=>{
    event.preventDefault();
    fetchBooks();
});
fetchData();

//# sourceMappingURL=index.672d4772.js.map
