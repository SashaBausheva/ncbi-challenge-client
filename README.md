# NCBI Visual DNA Database Representation

## Links
- Link to deployed site: https://sashabausheva.github.io/ncbi-challenge-client
- Link to the API repository: https://github.com/SashaBausheva/ncbi-challenge-api
- Link to the deployed API: https://vast-hollows-72654.herokuapp.com/

## Application Description
This is a single-page application allowing users to access a database of DNA sequences and add new sequences along with their names and descriptions. The back end was built using Express.js and MongoDB. The front end was built using React.js and Axios for http requests.

## Technologies Used
- React
- JavaScript
- Axios
- HTML5
- CSS3
- Material UI
- API
- Git & GitHub

## Setup and Installation
1. Fork and clone this repository.
2. Install dependencies using `npm install`.
3. `git add` and `git commit` your initial changes.
4. View changes by running local server `npm run start`.

## Planning, Process, and Problem-solving Strategy
I approached this project by first creating my back-end schema to ensure I understand the required structure for my http requests. The sequence model includes: sequence name (string, unique), sequence description (string), and the sequence itsel. I also needed to ensure every sequence in the database is unique, which I addressed in my POST routes.<br/><br/>
After my backend skeleton was set up and tested with cURL scripts, I focused on the view-sequences view. I implemented the ReactTable component on the front end to GET (index) and display sequence data. The component allows users to filter and/or sort the data by name, description, and sequence itself. I then included a Model component to display each sequence entry separately by clicking on the truncated sequence in the table.<br/><br/>
After the basic aspects of the table were functioning, I swithed to the add-sequence view. The form in it allows users to manually input sequence information and submit it firing a POST request. If the data is added to the database successfully, the application redirects to the view-sequences view where the new sequence is rendered along with the rest.<br/><br/>
Finally, I added two more features to view-sequences: Users can now upload multiple sequences via a JSON file and download the entire database as a JSON file as well.

## Feature Summary
    - View all DNA sequences
    - Sort sequences by name, description, or sequence itself
    - Filter sequences by name, description, or sequence itself
    - Change number of sequences displayed on one page
    - Manually add sequence by filling out a form
    - Add multiple sequences via a JSON file
    - Download the database as a JSON file
    - Display signle sequence entries in a modal with nucleotide bases rendered in different colors
    - Duplicate sequences or sequence names are not accepted
    - Sequences containing letters other than A, C, T, and G are not accepted
    - Cool gif on homepage

## Unsolved Problems / Future Iterations
Not an unsolved problem, but an interesting discovery: Mongoose will not allow you to set sequences as indexes and make them unique via sequence schema since most sequences are too long. I had to find an alternative solution via Sequence.count(parameters) in sequence routes.<br/><br/>
Also solved, but interesting to note: I had to implement Promises.all in the POST route for JSON file upload. When a user uploads a file, the back-end has to only send the response data that will trigger table refresh after it has added all the sequences from the file to the database. In order to do that, I needed to create promises for each sequence from the file and only send a response back to client after all of the promises have been resolved.<br/><br/>
I would like to style the JSON file input form in a more aesthetically pleasing way in the future.<br/><br/>
I would like to allow users to remove or edit sequences. However, this might result in unwanted data alteration, so I would need to think how to approach this problem (perhaps by implementing authentication). This would depend on the ultimate goal of the application.

#### User Stories
* As a user, I want to be able to view all DNA sequences in the database.
* As a user, I want to be able to sort the sequence by name, description, and sequences themselves.
* As a user, I want to be able to filter the sequence by name, description, and sequences themselves.
* As a user, I want to be able to view single sequence entries in a modal (with nucleotide bases rendered in different colors).
* As a user, I want to be able to manually add a sequence to the database by submitting a form.
* As a user, I want to be able to upload multiple sequences via a JSON file.
* As a user, I want to be able to download the entire database as a JSON file.
