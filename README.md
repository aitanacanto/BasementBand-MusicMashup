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

## Additional dependancies

In order to use most of these functions you will need a number of command line tools installed on your machine. These will also need to be configured to the path of your machine.

### yt-dlp

1. Go to this link and download the recommended yt-dlp.exe:
   https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#installation

2. Create a folder called yt-dlp in your C drive and put the .exe file inside it

3. Type Edit the environment and system variables (on windows) into the start menu search bar.

4. Open the environment and system variables editor and click the environment variables button.

5. Click on the variable Path under system variables (The bottom box) then click the edit button

6. Click the new button then put the path to the yt-dlp folder in the text box Then press okay.

7. Press okay again to save your changes. You can restart your machine now or better after you have done all of your command line dependancy installations.

### FFMPEG

1. Download ffmpeg-git-full.7z from https://www.gyan.dev/ffmpeg/builds/

2. Extract the .zip file to your C drive and rename the folder ffmpeg

3. Type Edit the environment and system variables (on windows) into the start menu search bar.

4. Open the environment and system variables editor and click the environment variables button.

5. Click on the variable Path under system variables (The bottom box) then click the edit button

6. Click the new button then put the path to the ffmpeg folders bin directory in the text box Then press okay.

7. Press okay again to save your changes. You can restart your machine now or better after you have done all of your command line dependancy installations.

Your path variables should look something like:

C:\yt-dlp
C:\FFMPEG\bin
