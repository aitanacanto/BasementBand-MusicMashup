# Music Mashup-241 project

# Setting up the prototype on your machine

First if you do not have Node.js installed you will need to do so by navigating to their website and installing version v20.19.1 for your operating system onto your machine. We are using this version because it is stable and the closest to the version on my computer which should reduce potential errors created by changes in new versions of node.

Clone the repository which will contain the backend and frontend folders containing the project files. In your cloned repository navigate to the backend folder and type:
npm install

This will install all necessary backend dependencies required for the project on your computer.

Repeat this for the frontend folder (there will probably be less dependencies here)

In order to test the app both the backend server and frontend need to be running, here is how"

## Running backend

type: npm run dev
This will run the development script and start the backend

backend should run on port 5000 unless there is something else running on that port.

If your port is occupied terminate whatever is running on it.

## Running frontend

type: npm run dev
This will run the development script and start the frontend

Frontend should run on port 3000 unless there is something else running on that port. If this is the case REACT will ask you if you want to run the frontend on a different port.

## How it works

In your browser navigate to the frontend url: http://localhost:3000
Assuming your frontend is running you should see whatever is on the frontend in your browser window. You do not need to navigate to the backend url.

The backend needs to be running in order to send and recieve requests from the frontend. The frontend sends GET requests to the backend which performs some sort of logic and returns data via a POST request in the JSON format. The frontend can then do whatever it wants with this data.

If you are testing your backend code you can use the terminal to see the output of your error handling. If you want to test it with the frontend both need to be running.

## Development

Make changes to the files as you develop the project. Refer to the github workflow guide by Aitana for how to commit your work to the repo.
