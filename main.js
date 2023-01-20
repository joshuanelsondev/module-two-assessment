const BASE_URL = 'https://resource-ghibli-api.onrender.com/films';
const PEOPLE_URL = 'https://resource-ghibli-api.onrender.com/people';
const movieArr = [];
const peopleArr = [];
const addReviewHeader = document.querySelector('.addReviewHeader');
const displayMovieDetails = document.querySelector('#display-info');
const form = document.querySelector('form');
const resetReviewsButton = document.querySelector('#reset-reviews');
const reviewInputField = document.querySelector('.reviewInputField');
const reviewsList = document.querySelector('.reviewsList');
const reviewSubmitButton = document.querySelector('.reviewSubmitButton');
const selectMovieElement = document.querySelector('#movie');
const showPeopleList = document.querySelector('.showPeopleList');
const showPeopleButton = document.querySelector('#show-people');
const removeMovieDetails = () => displayMovieDetails.textContent = '';
const removePeopleList = () => showPeopleList.textContent = '';
const resetReviews = () => reviewsList.textContent = '';
let showPeopleArr = [];



form.addEventListener('submit', appendReview);
resetReviewsButton.addEventListener('click', resetReviews);
selectMovieElement.addEventListener('change', appendMovieDetails);
showPeopleButton.addEventListener('click', filterPeopleArray);



function appendMovieDetails(event) {
    removeMovieDetails();
    removePeopleList();

    if (selectMovieElement.value !== '') {
        const movieMatch = movieArr.find(movieObj => movieObj.title === event.target.value);
        const movieTitle = document.createElement('h3');
        const movieReleaseYear = document.createElement('p');
        const movieDescription = document.createElement('p');
        console.log(movieMatch.released)
        movieTitle.textContent = event.target.value;
        movieReleaseYear.textContent = movieMatch.released;
        movieDescription.textContent = movieMatch.description;

        displayMovieDetails.append(movieTitle, movieReleaseYear, movieDescription);
    }
    
}

function appendReview(event) {
    event.preventDefault();
    const userReview = event.target.review.value; 

    if (!selectMovieElement.value) {
        window.alert("Please select a movie first");
    }
    if (userReview !== '' && selectMovieElement.value !== '') {
        form.review.value = '';
        const reviewLi = document.createElement('li');
        reviewLi.innerHTML = `<strong>${selectMovieElement.value}:</strong> ${userReview}`;
        reviewsList.append(reviewLi);
    }
}

function compileMovieData(response) {

    response.forEach(movieObj => {
        const currentMovieObj = {
            id: movieObj.id, 
            title: movieObj.title,
            released: movieObj.release_date,
            description: movieObj.description,
            people: movieObj.people 
        };
        // console.log(currentMovieObj);
        movieArr.push(currentMovieObj);
    });
    populateMovieOptionElements(movieArr);
}

function compilePeopleData(response) {
    response.forEach(peopleData => {
        const movieId = (peopleData.films[0]).slice(7);
        peopleArr.push({[`${movieId}`]: peopleData.name});
    });  
}

function filterPeopleArray() { 
    
    if (selectMovieElement.value) { 
        if (!showPeopleList.textContent) {
            const selectedMovieObj = movieArr.find(movieObj => movieObj.title === selectMovieElement.value);
            const selectedMovieId = selectedMovieObj.id;
            const filteredPeopleArr = peopleArr.filter(person => person[selectedMovieId]);
            showPeople(filteredPeopleArr, selectedMovieId);
        }
    }
}


function populateMovieOptionElements() {
    movieArr.forEach(movieObj => {
        const movieOptionElement = document.createElement('option');
        movieOptionElement.setAttribute('value', movieObj.title);
        movieOptionElement.textContent = movieObj.title;
        selectMovieElement.append(movieOptionElement);
    });
}

function retrieveApiData() {
    [BASE_URL, PEOPLE_URL].forEach(url => {
        fetch(url)
            .then((response) => response.json())
            .then((response) => {
                if (url === BASE_URL) {
                    compileMovieData(response);
                } else {
                    compilePeopleData(response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    });
    
}

function showPeople(personArr, id) {
    personArr.forEach(personObj => {
        const personLi = document.createElement('li');
        personLi.textContent = personObj[id];
        showPeopleList.append(personLi);
    });
}   

// To ensure Cypress tests work as expected, add any code/functions that you would like to run on page load inside this function

function run() {
    retrieveApiData();
}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run(BASE_URL), 1000);

