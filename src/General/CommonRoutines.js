import BackgroundTimer from 'react-native-background-timer';

// Start a timer that runs continuous after X milliseconds
const intervalId = BackgroundTimer.setInterval(() => {
    // this will be executed every 200 ms
    // even when app is the background
    console.log('tic');
}, 200);

// Cancel the timer when you are done with it
BackgroundTimer.clearInterval(intervalId);

// Start a timer that runs once after X milliseconds
const timeoutId = BackgroundTimer.setTimeout(() => {
    // this will be executed once after 10 seconds
    // even when app is the background
    console.log('tac');
}, 10000);