$(document).ready(function() {
  $(document).on('click', function() {
    $('.collapse').collapse('hide');
  });

  // default search buttons
  var giphyArray = ['toronto', 'soccer', 'nba', 'roses'];
  var moviesArray = ['avatar', 'lion king', 'Her', '300'];
  var bandsArray = ['Cher', 'Drake', 'Taylor Swift', 'Chaos'];

  // render buttons
  renderButtons(giphyArray, 'giphy');
  renderButtons(moviesArray, 'movies');
  renderButtons(bandsArray, 'bands');

  // clicking giphy fetch button
  $('#find-giphy').on('click', function(event) {
    event.preventDefault();
    var type = $(this)[0].id;
    // save inputs
    var params = {
      giphyTopic: $('#topic').val(),
      giphyLimit: parseInt($('#limit').val())
    };

    displayInfo(type, params);
  });
  // clicking movies fetch button
  $('#find-movie').on('click', function(event) {
    event.preventDefault();
    var type = $(this)[0].id;

    // save inputs
    var params = {
      movieTitle: $('#movie-title').val(),
      moviePlot: $('#movie-plot').val(),
      movieType: $('#movie-type').val()
    };

    displayInfo(type, params);
  });
  // clicking bands fetch button
  $('#find-band').on('click', function(event) {
    event.preventDefault();
    event.preventDefault();
    var type = $(this)[0].id;

    // save inputs
    var params = {
      bandTitle: $('#band-name').val(),
      bandVenue: $('#band-venue').val()
    };

    displayInfo(type, params);
  });

  // clicking on a giphy button
  $(document).on('click', '.giphy-btn', function(event) {
    var params = {
      giphyTopic: event.target.textContent,
      giphyLimit: parseInt($('#limit').val())
    };

    displayInfo('find-giphy', params);
  });
  // clicking on a movie button
  $(document).on('click', '.movie-btn', function(event) {
    var params = {
      movieTitle: event.target.textContent,
      moviePlot: $('#movie-plot')
        .val()
        .toLowerCase(),
      movieType: $('#movie-type').val()
    };

    displayInfo('find-movie', params);
  });
  // clicking on a band button
  $(document).on('click', '.band-btn', function(event) {
    var params = {
      bandTitle: event.target.textContent,
      bandVenue: $('#band-venue').val()
    };

    displayInfo('find-band', params);
  });

  // clear table upon clicking the reset buttons
  $(document).on('click', '.reset', function(event) {
    var id = event.currentTarget.id;
    
    if (id === 'reset-giphy') {
      $('#giphyButtons').empty();
      $('#giphy-tbody').empty();
      renderButtons(['toronto', 'soccer', 'nba', 'roses'], 'giphy');
    } else if (id === 'reset-movie') {
      $('#movieButtons').empty();
      $('#movie-tbody').empty();
      renderButtons(['avatar', 'lion king', 'Her', '300'], 'movies');
    } else {
      $('#bandsButtons').empty();
      $('#band-tbody').empty();
      renderButtons(['Cher', 'Drake', 'Taylor Swift', 'Chaos'], 'bands');
    }
  });

  // display table
  function displayInfo(type, params) {
    if (type === 'find-giphy') {
      if (params.giphyTopic !== '' && !isNaN(params.giphyLimit)) {
        giphyArray.push(params.giphyTopic);

        // display buttons
        renderButtons(giphyArray, 'giphy');

        // display table with metadata
        var queryGiphy = `https://api.giphy.com/v1/gifs/search?api_key=RiOoaXfWH40EgxNi08rN7WLGTFffEMgN&q=${
          params.giphyTopic
        }&limit=${params.giphyLimit}&lang=en`;

        $.ajax({
          url: queryGiphy,
          method: 'GET'
        })
          .then(result => {
            var cleanData = cleanAjax(result, 'giphy');
            makeTable(cleanData, 'giphy');
          })
          .catch(err => {
            console.log(err);
          });
      } else if (isNaN(params.giphyLimit)) {
        alert('Please put a number for the Limit');
      }
    } else if (type === 'find-movie') {
      if (
        params.movieTitle !== '' &&
        params.moviePlot !== '' &&
        params.movieType !== ''
      ) {
        moviesArray.push(params.movieTitle);

        // display buttons
        renderButtons(moviesArray, 'movies');

        // display table with metadata
        var queryMovie = `https://www.omdbapi.com/?t=${
          params.movieTitle
        }&y=&plot=${params.moviePlot}&type=${params.movieType}&apikey=trilogy`;

        $.ajax({
          url: queryMovie,
          method: 'GET'
        })
          .then(result => {
            var cleanData = cleanAjax(result, 'movies');
            if (cleanData.title === undefined) {
              return alert('No results were found!');
            } else {
              makeTable(cleanData, 'movies');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else if (type === 'find-band') {
      if (params.bandTitle !== '') {
        bandsArray.push(params.bandTitle);

        // display buttons
        renderButtons(bandsArray, 'bands');

        // display table with metadata

        var queryVenue = `https://rest.bandsintown.com/artists/${
          params.bandTitle
        }/events?app_id=codingbootcamp`;

        $.ajax({
          url: queryVenue,
          method: 'GET'
        })
          .then(result => {
            // if venue location is other
            if (
              params.bandVenue === 'United States' ||
              params.bandVenue === 'Canada'
            ) {
              var filteredResult = result.filter(country => {
                return country.venue.country === params.bandVenue;
              });
            } else {
              var filteredResult = result.filter(country => {
                return (
                  country.venue.country !== 'United States' &&
                  country.venue.country !== 'Canada'
                );
              });
            }

            if (filteredResult.length === 0) {
              alert('No results were found!');
            } else {
              var cleanData = cleanAjax(filteredResult, 'bands');
              makeTable(cleanData, 'bands');
            }
          })
          .catch(err => {
            console.log(err);
            alert('No results were found!');
          });
      }
    }
  }

  function renderButtons(arr, form) {
    arr = Array.from(new Set(arr));
    if (form === 'giphy') {
      $('#giphyButtons').empty();
      for (let i = 0; i < arr.length; i++) {
        var newButton = $('<button>');
        newButton.text(arr[i]);
        newButton.addClass('btn');
        newButton.addClass('btn-info');
        newButton.addClass('giphy-btn');
        newButton.attr('data-name', arr[i]);
        $('#giphyButtons').prepend(newButton);
      }
    } else if (form === 'movies') {
      $('#movieButtons').empty();
      for (let i = 0; i < arr.length; i++) {
        var newButton = $('<button>');
        newButton.text(arr[i]);
        newButton.addClass('btn');
        newButton.addClass('btn-info');
        newButton.addClass('movie-btn');
        newButton.attr('data-name', arr[i]);
        $('#movieButtons').prepend(newButton);
      }
    } else if (form === 'bands') {
      $('#bandsButtons').empty();
      for (let i = 0; i < arr.length; i++) {
        var newButton = $('<button>');
        newButton.text(arr[i]);
        newButton.addClass('btn');
        newButton.addClass('btn-info');
        newButton.addClass('band-btn');
        newButton.attr('data-name', arr[i]);
        $('#bandsButtons').prepend(newButton);
      }
    }
  }

  function cleanAjax(result, form) {
    if (form === 'giphy') {
      var url = [];
      var title = [];
      var rating = [];
      var trending_datetime = [];
      for (let i = 0; i < result.data.length; i++) {
        url.push(result.data[i].images.fixed_height.url);
        title.push(result.data[i].title);
        rating.push(result.data[i].rating);
        trending_datetime.push(result.data[i].trending_datetime);
      }
      return {
        title: title,
        trending_datetime: trending_datetime,
        url: url,
        rating: rating
      };
    } else if (form === 'movies') {
      var title = result.Title;
      var year = result.Year;
      var url = result.Poster;
      var plot = result.Plot;
      return { title: title, year: year, url: url, plot: plot };
    } else if (form === 'bands') {
      var artist = [];
      var date = [];
      var venue = [];
      var tickets = [];
      for (let i = 0; i < result.length; i++) {
        artist.push(result[i].lineup[0]);
        date.push(result[i].datetime);
        venue.push(
          `${result[i].venue.name}, ${result[i].venue.city}, ${
            result[i].venue.country
          }`
        );
        tickets.push(result[i].url);
      }
      return { artist: artist, date: date, venue: venue, tickets: tickets };
    }
  }

  function makeTable(ajaxResult, form) {
    if (form === 'giphy') {
      for (let i = 0; i < ajaxResult.rating.length; i++) {
        var tBody = $('#giphy-tbody');
        var tRow = $('<tr>');
        var titleTd = $('<td>').text(ajaxResult.title[i]);
        var dateTd = $('<td>').text(ajaxResult.trending_datetime[i]);
        var imageTd = $('<td>').html(
          `<img class="img-thumbnail gif" src=${ajaxResult.url[i].replace(
            '.gif',
            '_s.gif'
          )} data-still=${ajaxResult.url[i].replace(
            '.gif',
            '_s.gif'
          )} data-animate=${ajaxResult.url[i]} state="still">`
        );
        var ratingTd = $('<td>').text(ajaxResult.rating[i].toUpperCase());
        tRow.append(titleTd, dateTd, imageTd, ratingTd);
        tBody.prepend(tRow);
      }
    } else if (form === 'movies') {
      var tBody = $('#movie-tbody');
      var tRow = $('<tr>');
      var titleTd = $('<td>').text(ajaxResult.title);
      var yearTd = $('<td>').text(ajaxResult.year);
      var imageTd = $('<td>').html(
        `<img class="img-thumbnail gif" src=${ajaxResult.url}>`
      );
      var plotTd = $('<td>').text(ajaxResult.plot);
      tRow.append(titleTd, yearTd, imageTd, plotTd);
      tBody.prepend(tRow);
    } else if (form === 'bands') {
      for (let i = 0; i < ajaxResult.artist.length; i++) {
        var tBody = $('#band-tbody');
        var tRow = $('<tr>');
        var artistTd = $('<td>').text(ajaxResult.artist[i]);
        var dateTd = $('<td>').text(ajaxResult.date[i]);
        var venueTd = $('<td>').text(ajaxResult.venue[i]);
        var ticketsTd = $('<td>').html(
          `<a href=${
            ajaxResult.tickets[i]
          } target="_blank"><button class="btn btn-info">Get tickets!</button></a>`
        );
        tRow.append(artistTd, dateTd, venueTd, ticketsTd);
        tBody.prepend(tRow);
      }
    }
  }

  // add play and pause functionality to gifs
  $(document).on('click', '.gif', function() {
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
});
