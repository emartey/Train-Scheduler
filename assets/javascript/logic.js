
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDHZc2Uk8pkYiuepx6lSShXsLBrwx3AH8g",
    authDomain: "train-train-94763.firebaseapp.com",
    databaseURL: "https://train-train-94763.firebaseio.com",
    projectId: "train-train-94763",
    storageBucket: "train-train-94763.appspot.com",
    messagingSenderId: "472091414175",
    appId: "1:472091414175:web:22854e7e6544a8f0465caa",
    measurementId: "G-YG2QNJ1QNB"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();

let arrivalTime = "null"

let minutesAway = "null"

// when something is added to the database
database.ref().on("child_added", function (snapshot) {
    let check = false;
    // checking that values aren't blank
    if (snapshot.val().firstTrain != "" && snapshot.val().frequency != "") {
        let time = moment(snapshot.val().firstTrain, "h:mm");
        while (!check) {
            if (moment().isAfter(time)) {
                time.add(snapshot.val().frequency, 'minutes');
            }
            else {
                check = true;
            }
        }
        arrivalTime = time.format("h:mm a");
        minutesAway = moment(arrivalTime, "h:mm a").fromNow(true);

        // creating new table row with data from firebase
        $("#newRow").append("<tr>" +
            "<td>" + snapshot.val().train + "</td>" +
            "<td>" + snapshot.val().destination + "</td>" +
            "<td>" + snapshot.val().frequency + "</td>" +
            "<td>" + arrivalTime + "</td>" +
            "<td>" + minutesAway + "</td>" +
            "</tr>");
    }
});

// when add train button is clicked
$("#addTrain").on("click", function (event) {
    event.preventDefault();
    // pushing input data to firebase
    database.ref().push({
        train: $("#train").val().trim(),
        destination: $("#destination").val().trim(),
        frequency: $("#frequency").val().trim(),
        firstTrain: $("#firstTrain").val().trim(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // clearing input fields
    $("#train").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

});

// displays current time
function clock() {
    let clock = moment().format("h:mm:ss a")
    $("#clock").text("Current Time: " + clock);
    // updates clock every second
    setInterval(function () {
        this.clock();
    }, 1000);
}

clock();
