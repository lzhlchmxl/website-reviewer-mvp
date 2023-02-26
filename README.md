# Goals

Create a minimum viable web solution that can achieve the followings (Note: starred items have lower priorities):
1. Load any website based on a given URL
2. Give user visual indicators to selected elements
3. Let user to visually create, edit*, remove* notes
4. A way to store the review info
5. Load review info in a visual manner

# Plans

Pre-dev plans to achieve each of the above mentioned goals:
1. ~~Use a typescript-friendly iframe library to load URL~~
__2.26 Update: cross origin limitations make this approach impossible. Going with a screenshot-coordinate based approach with third party snapshot API.__

2. On mouse click, create a circle object that has a relative position to the selected element
3. When a circle indicator is created, we create a "note" object with the following type:
```
{
  URL: string,
  attachedNode: string, // DOM tree path of the selected element, eg. something like "html/body/p[2]" points to the third P tag in body.
  message: string,
}
```
__2.26 Update: note type for coordinates based approach:__
```
{
  id: string,
  x: number,
  y: number,
  message: string,
}
```
 
4. Not decided yet. Write to file, database, or send as an email could all work.
5. Not decided yet, need more research on Iframe-parent communications.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
