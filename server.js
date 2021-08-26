'use strict';

// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

// create the server
const app = express();

// the backend server will parse json, not a form request
app.use(bodyParser.json());

// mock events data - for a real solution this data should be coming 
// from a cloud data store
const mockEvents = {
    events: [
        { title: 'Outlaw Music Festival Tour 2021', id: 1, description: 'Willie Nelson is bringing his Outlaw Music Festival to our stage along with friends Sturgill Simpson, Nathaniel Rateliff & The Night Sweats and more on Sept 22', location: 'Atlanta, GA', date: '21 Sep 2021'
    , imgsrc: "https://www.exploregeorgia.org/sites/default/files/styles/listing_slideshow/public/listing_images/event/43591/5fa9e0173eed73118a8b573d52f48947_Outlaw_festival.jpg?itok=82GsvPQU" },
        { title: 'Glass Animals – Dreamland Tour New', id: 2, description: 'This is an all ages show. Doors at 7pm. Show at 8pm. Support Act: Binki The floor is general admission standing room only. The balcony is reserved seating.',location: 'Austin, TX', 
        date: '22 Sep 2021', imgsrc: "https://travelcobb.org/wp-content/uploads/2021/08/4dbdbb2b-7ad9-4909-90c8-76a15c5a97f4-23.jpg" }
    ]
};




// health endpoint - returns an empty array
app.get('/', (req, res) => {
    res.json([]);
});

// version endpoint to provide easy convient method to demonstrating tests pass/fail
app.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});


// mock events endpoint. this would be replaced by a call to a datastore
// if you went on to develop this as a real application.
app.get('/events', (req, res) => {
    res.json(mockEvents);
});

// Adds an event - in a real solution, this would insert into a cloud datastore.
// Currently this simply adds an event to the mock array in memory
// this will produce unexpected behavior in a stateless kubernetes cluster. 
app.post('/event', (req, res) => {
    // create a new object from the json data and add an id
    const ev = { 
        title: req.body.title, 
        description: req.body.description,
        id : mockEvents.events.length + 1
     }
    // add to the mock array
    mockEvents.events.push(ev);
    // return the complete array
    res.json(mockEvents);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = 8082;
const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;