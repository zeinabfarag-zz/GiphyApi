var topics = [
  "pizza",
  "tacos",
  "fried chicken",
  "french fries",
  "milk shake",
  "cookies",
  "nachos",
  "ice cream",
  "burrito"
];

$("#submit").click(function() {
  var userInput = [];

  userFood = $("#addFood").val();
  userInput.push(userFood);

  makeButton(userInput);

  gif();
});

function makeButton(x) {
  for (var i = 0; i < x.length; i++) {
    var button = $('<input type="button" class="button" />');
    button.attr("value", x[i]);
    $("#buttons").append(button);
  }
}
makeButton(topics);

gif();

function gif() {
  var gifArray = [];

  $(".button").on("click", function() {
    topic = $(this).attr("value");
    var queryURL =
      "https://api.giphy.com/v1/gifs/search?q=" +
      topic +
      "&api_key=WOuzlEHSd8jNzl1hIO12Qida55zyLDzb&limit=10&rating=G";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        var image = $("<img data-type='still' class= 'images'>");

        image.attr("src", response.data[i].images.fixed_height_still.url);
        image.attr(
          "data-still",
          response.data[i].images.fixed_height_still.url
        );
        image.attr("data-animate", response.data[i].images.fixed_height.url);

        gifArray.push(image);

        $("#gifs").html(gifArray);
      }
      gifArray.length = 0;

      $(".images").on("click", function() {
        if ($(this).attr("data-type") === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-type", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-type", "still");
        }
      });
    });
  });
}
