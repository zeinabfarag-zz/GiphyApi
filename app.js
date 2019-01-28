// Giphy API key
var apiKey = 'kVEh3AuPwGkBkRK9x540E5QC5E7RGekm';

// List of topics
var topics = [
  'Anne',
  'Alias Grace',
  'Travelers',
  'Peaky Blinders',
  'Mindhunter',
  'The People v. O.J. Simpson: American Crime Story',
  'Mad Men',
  'Breaking Bad',
  'Better Call Saul',
  'The West Wing',
  'The Returned'
];

// Create buttons
function createButtons(elementID) {
  //Loop through the topics array
  for (var i = 0; i < topics.length; i++) {
    //Create buttons for each index
    $('#' + elementID).append(
      '<button type="button" class = "btn btn-primary" id = ' +
        i +
        '>' +
        topics[i] +
        '</button>'
    );

    //Assign click function to each index
    $('#' + i).click(function(topics) {
      queryGiphy(this.id);
    });
  }
}

function populateImages(response) {
  // Grab 10 static non-animated gif images from the GIPHY API and place it on this page
  for (var i = 0; i < response.data.length; i++) {
    // Create container for gif
    var giphyS = $('<section>');

    // Add rating
    giphyS.append('Rating: ' + response.data[i].rating);

    // Add image
    var giphyImg = $('<img>');
    giphyImg.attr('src', response.data[i].images.fixed_height_still.url);
    giphyImg.attr('data-still', response.data[i].images.fixed_height_still.url);
    giphyImg.attr('data-animate', response.data[i].images.fixed_height.url);
    giphyImg.attr('data-state', 'still');
    giphyImg.addClass('gif');
    giphyS.addClass('img-fluid');

    // Add image to container
    giphyS.append(giphyImg);

    // Add bootstrap layout
    giphyS.addClass('col-3');

    // Add container to html
    $('#images').prepend(giphyS);
  }

  $('.gif').on('click', function() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr('data-state');
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === 'still') {
      $(this).attr('src', $(this).attr('data-animate'));
      $(this).attr('data-state', 'animate');
    } else {
      $(this).attr('src', $(this).attr('data-still'));
      $(this).attr('data-state', 'still');
    }
  });
}

function queryGiphy(callingElement) {
  //Create giphy URL
  var queryURL =
    'https://api.giphy.com/v1/gifs/search?q=' +
    topics[callingElement] +
    '&api_key=' +
    apiKey +
    '&limit=10';

  //Make API call to Giphy
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response);
    populateImages(response);
  });
}

// Clear buttons from html
function clearButtons() {
  $('#buttons').html('');
}

$(document).ready(function() {
  // When page is initially loaded, create buttons from default list
  createButtons('buttons');

  // When "Submit" for add new button is clicked, add button
  $('.addNewButton').click(function() {
    // Add to button array
    topics.push($('#addButton').val());

    // Remove all buttons from html to prepare for population
    clearButtons();

    // Create all buttons
    createButtons('buttons');
  });
});
