const BASE_URL = 'https://resource-ghibli-api.onrender.com/films';
const movieArr = [];






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
}
// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function

function run() {
    fetch(BASE_URL)
        .then((response) => response.json())
        .then((response) => compileMovieData(response))
        .catch((error) => {
            console.log(error);
        });
}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);
