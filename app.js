
/////////////////////////////////////////////////////////////
// Constants

var stringLength = 17

var intervals =
    ['1', '♭9', '9', '♭3', '3', '4', '♭5', '5', '♯5', '6', '♭7', '7']

var noteNames =
    [
        { flat: 'C', sharp: 'C' },
        { flat: 'D♭', sharp: 'C♯' },
        { flat: 'D', sharp: 'D' },
        { flat: 'E♭', sharp: 'D♯' },
        { flat: 'E', sharp: 'E' },
        { flat: 'F', sharp: 'F' },
        { flat: 'G♭', sharp: 'F♯' },
        { flat: 'G', sharp: 'G' },
        { flat: 'A♭', sharp: 'G♯' },
        { flat: 'A', sharp: 'A' },
        { flat: 'B♭', sharp: 'A♯' },
        { flat: 'B', sharp: 'B' }
    ]

//////////////////////////////////////
// instrument Definitions

var guitar = {
    name: 'guitar',
    openStrings: [4, 11, 7, 2, 9, 4]
}

var fiddle = {
    name: 'fiddle',
    openStrings: [4, 9, 2, 7]
}

var ukulele = {
    name: 'ukulele',
    openStrings: [9, 4, 0, 7]
}

var bass = {
    name: 'bass',
    openStrings: [7, 2, 9, 4]
}

var dobro = {
    name: 'dobro',
    openStrings: [2, 11, 7, 2, 11, 7]
}

////////////////////////////////////////////////////////
// Get a fretboard

function getFretboard(theInstrument) {

    var fretboard = {
        key: 0,
        flats: true,
        showIntervals: true,
        instrument: theInstrument,
        strings: []
    }

    fretboard.clearPlayed = function () {
        fretboard.strings.forEach(function (theString) {
            theString.forEach(function (theSpot) {
                theSpot.played = false
            })
        })
    }

    fretboard.toggleAllLikeSpots = function (clickedSpot) {
        var wasPlayed = clickedSpot.played
        fretboard.strings.forEach(function (theString) {
            theString.forEach(function (theSpot) {
                if (theSpot.absolute === clickedSpot.absolute) {
                    theSpot.played = !wasPlayed
                }
            })
        })
    }

    // Init all the strings on the fretboard.
    // This is the first and last time the spots and strings are layed out.
    // Markers and absolute note offset never change
    for (var i = 0; i < fretboard.instrument.openStrings.length; i++) {
        var string = []
        for (var j = 0; j < stringLength; j++) {
            var spot = {}
            spot.absolute = (fretboard.instrument.openStrings[i] + j) % 12
            if (j == 0) {
                spot.openMarker = true
            }
            else if ([5, 7, 9, 12].indexOf(j) !== -1) {
                spot.marker = true
            }
            string.push(spot)
        }
        fretboard.strings.push(string)
    }

    fretboard.setShowIntervals = function (inputShowIntervals) {
        fretboard.showIntervals = (inputShowIntervals == "intervals")
        setSpotsText()
    }

    fretboard.setKey = function (theKey) {
        fretboard.key = theKey
        var keyName = noteNames[theKey].flat
        if (keyName == 'C') {
            fretboard.flats = true
        }
        else if (keyName.indexOf('♭') !== -1) {
            fretboard.flats = true
        }
        else {
            fretboard.flats = false
        }
        setSpotsText()
    }

    function setSpotsText() {
        for (var i = 0; i < fretboard.instrument.openStrings.length; i++) {
            for (var j = 0; j < stringLength; j++) {
                var spot = fretboard.strings[i][j]
                var intervalOffset = spot.absolute - fretboard.key
                if (intervalOffset < 0) {
                    intervalOffset += 12
                }
                spot.interval = intervals[intervalOffset]
                if (fretboard.flats)
                    spot.note = noteNames[spot.absolute].flat
                else {
                    spot.note = noteNames[spot.absolute].sharp
                }
                if (fretboard.showIntervals) {
                    spot.text = spot.interval
                }
                else {
                    spot.text = spot.note
                }
            }
        }
    }

    setSpotsText()

    return fretboard


    function getString(stringNum) {
        var string = [];
        var ptr = fretboard.instrument.openStrings[stringNum];
        for (var i = 0; i < stringLength; i++) {
            var spotNoteName = fretboard.flats ? noteNames[ptr].flat : noteNames[ptr].sharp
            var spot = { note: spotNoteName, text: spotNoteName, played: false }

            if (i == 0) {
                spot.openMarker = true
            }
            else if ([5, 7, 9, 12].indexOf(i) > -1) {
                spot.marker = true
            }
            string.push(spot)
            ptr++
            if (ptr > 11) {
                ptr = 0
            }
        }
        return string
    }
}

//////////////////////////////////////////////////////////////////////////////
// Controller

function FretsController($scope) {

    $scope.fretboard = getFretboard(guitar)
    $scope.noteNames = noteNames

    $scope.checked = true

    $scope.spotClicked = function (spot) {
        $scope.fretboard.toggleAllLikeSpots(spot)
    }

    $scope.keyClicked = function (key) {
        $scope.fretboard.setKey(key)
    }

    $scope.showRadioClicked = function (kind) {
        if (kind == "intervals") { }
        $scope.fretboard.setShowIntervals(kind)
    }

    $scope.getKeyClass = function (index) {
        if (index == $scope.fretboard.key) {
            return "key chosenKey"
        }
        else {
            return "key"
        }
    }
}
