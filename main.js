const BASE_URL = 'https://resource-ghibli-api.onrender.com/films';
const movieArr = [];
const selectMovieElement = document.querySelector('#movie');
const addReviewHeader = document.querySelector('.addReviewHeader');
const displayInfo = document.querySelector('#display-info');


selectMovieElement.addEventListener('change', appendMovieDetails);



function compileMovieData(response) {
    response.forEach(movieObj => {
        const currentMovieObj = {
            id: movieObj.id, 
            title: movieObj.title,
            released: movieObj.release_date,
            description: movieObj.description,
            people: movieObj.people 
        };
        movieArr.push(currentMovieObj);
    });
    
    populateMovieOptionElements();

}

function appendMovieDetails(event) {
    const movieMatch = movieArr.find(movieObj => movieObj.title === event.target.value);
    const movieTitle = document.createElement('h3');
    const movieReleaseYear = document.createElement('p');
    const movieDescription = document.createElement('p');
    movieTitle.textContent = event.target.value;
    movieReleaseYear.textContent = movieMatch.released;
    movieDescription.textContent = movieMatch.description;
    
    displayInfo.append(movieTitle, movieReleaseYear, movieDescription);
   
    console.log(movieMatch);
}

function populateMovieOptionElements() {
    movieArr.forEach(movieObj => {
        const movieOptionElement = document.createElement('option');
        movieOptionElement.setAttribute('value', movieObj.title);
        movieOptionElement.textContent = movieObj.title;
        selectMovieElement.append(movieOptionElement);
    });
}
// To ensure Cypress tests work as expected, add any code/functions that you would like to run on page load inside this function

function run() {
    fetch(BASE_URL)
        .then((response) => response.json())
        .then((response) => {
            compileMovieData(response);

        })
        .catch((error) => {
            console.log(error);
        });
}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);
