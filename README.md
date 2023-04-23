![image](https://user-images.githubusercontent.com/78304408/233866653-a959999d-7b98-4c11-8d5f-6eb8d7dff16c.png)

## Spoontastic Overview

Spoontastic is a Web-Application that  implements a Reccomender System that utilises Data Analytics techniques to provide users with personalized recommendations that adhere to user specific dietary restrictions. Moreover, it provides users ability to easily search, filter thousands of recipes, and add them to favourites in order to provide users with ability to save and keep track of recipes that match their requirements. Furthremore, users are able to change their dietary needs and intolerances at any given moment,recipes that don't match users dietary needs will display a warning message to ensure their safety.
 

Key features:

- Reccomender System Based on User Interactions and Similarity to other Users
- Dynamic & User Friendly Interface
- Comprehensive Search And Filtering System
- Thausands of available recipes

## Component Overview

### Client

An isomorphic application built in JavaScript with React and MUI used to interact with the server.

- JavaScript
- React
- Mui

### Server

The server is a Node.js application that was built with JavaScript, Express and MongoDB. Servers handles requests from client and also requests from Spoonacular API

- Node.js
- Express.js
- JavaScript

### Prerequisites

- Node.js v16+
- npm v8+
- Docker

### Setup

#### Installation

1. Install the prerequisites
2. Clone the repository
3. Run `npm install`

This will install all the dependencies required to run the application. From here, you can start it with `npm start`.

## Code Structure

```txt
root
└─ public
│
└─ src
   │  index.js  // the main entry-point to the application for Razzle
   └─ client
   │  │  index.js   // entry point to the client
   │  │  App.js     // the main component (used in both SSR and CSR)
   │  └─ api         // api requests matching the structure of src/server/api
   │  └─ components  // common components used across the app
   │  │  │
   │  │  └─ [ComponentName].js
   │  │
   │  │
   │  |
   │  └─ hooks  // any custom hooks used across the app
   │  └─ views  // main views of the app
   │     │  [screenName].js  // a screeen e.g. dashboard.js
   │     └─ [screen]          // a sub-directory for a view e.g. LoginRegister
   │        │  [ComponentName].component.js // a component used in this view
   │        └─ components                    // components used specifically on this screen e.g.
   │        │                                // e.g. RecipeList.js
   │        └─ hooks                // custom hooks used specifically on this screen
   │           │  use[HookName].js  // a custom hook used specifically on this screen
   │
   └─ server
      │  index.js  // entry point to the server
      └─ api        // the routes of the api
      │  |
      │  │
      │  │
      │  └─ index.js  // entry point for the routes  api routes
      │  │
      │  │
      │  └─ [apiRoutes]  // routes for the specified service
      │    │
      │    └─ [nameAPI].js  //api end points for specific requests
      │
      │
      |
      └─ services
      │    └─ [serviceName]
      │         │
      │         └─[name].model.js   // the service's Mongoose Model
      │
      │
      └─ utils.js  // for utility functions aka. render app
```

## System Diagram

you can find system diagram [here](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=syetemDiagram.drawio#R5Vptj9o4EP41SHcfWOWFAP24kG33pO7dClRd79PJJCa4NXFqGxb668%2BObUjipAQayva6WmntsTO2n3lm4plsz5%2Bud%2B8oyFZPJIa45znxrueHPc9zB57Xk79OvFeS0XioBAlFsZ50FMzRV6iFjpZuUAxZaSInBHOUlYURSVMY8ZIMUEpeytOWBJdXzUACLcE8AtiW%2Fo1ivlLSceAc5Y8QJSuzsuvokTUwk7WArUBMXgoi%2F6HnTykhXLXWuynEEjyDi3rubcPoYWMUprzNA%2BMP2%2FD90%2Bzf2dZ5nKz%2Bep88b1lfa9kCvNEHnmIkFXpDsM56%2FiRdMPlH9LFYZbKgopXI1kRiC6k%2BG98bwCjZpDGUa7pi1ssKcTjPQCRHXwRFhGzF11gP69Uh5XDXeCz3AJZgGSRryOleTNEPDDW8ml%2FueHQXKMnL0V6uMcKqYCtvpIVAcyQ5KD%2FCKBoayTNQ9SxUbw6TF1RwMv0CSgOnBiXfOQDaOU5%2BDU6KZywDaQmw4ZeNdJTJkqS8z%2FIwcS8muEG2U%2FTU44aeRpGc34mihRG8pUrlQxqbMXH4hTWfnpbEaFu7N2Fm3gcYJanaHIZL%2Fs3NNcK1ANHnJOdaPyKYUKUPpYgjgGtV9sX4DIKIFw6n1JeXFOJ8%2Bz%2FHiZ426KLzCKlikCUu67i1d4%2FK3u05tne7bl0M9K%2Fl24NG327tksO2LjkRnOj%2FT%2F2xM9SkG%2Fwp7md3n9i57P7ZPL5TzB52GYWMdQybTT5L6%2FfEFA18GIkAIi5pnQSZgdsiyLypCzKDa120hqcvWjCN72UeIMHAgDEUlZE6wuqInoCC7j8WO%2F%2FIzp0XmH64K46Ge91T68LYyiYq6Ir0BdAE8lO3ItsKBZSDGpCNjEIMONqWt1EHvF7hmaDcSQwrxhUjDyu2Y2RDI6ifKqYbFUUHozcpUjhYinIeHI59OTXGFjVm8MsGMm4xREaqE94j%2FQaJpPBeD6xRHMvHJyIyoK9gkauSNMjkcfIDBpNeEEpdG05UpMlVM07JZzhVcSxMSSq1LBHGFVEH%2FmqZ0rf9dVR747%2BSt5r40Z27tvW6W3lT9V7mD7xqMtXWn6rW9Af%2BD%2FUn1y4VzCDLSMrgL%2BtRvmOXGsY%2F1KNaVBoKHqWRaH777RD%2FqEdkW737At07vvlk5%2FwXn2L6qZThVq56KH4cbHvhi29YDbvV20%2BDowojgX1hmiZ%2B44ar6%2Fjl%2Bp9oKI3dRoG6ks3lhHvt8fukLduSYuRdRorO7FaXjl%2Ffbi1uu27wmgxsnOi7DTyoho8reb1Z57peH9Sw57z0n4nzfzv%2FN8m6%2BQRk5nnFR5wliMrD7whJxNqeMwepwE0c0JmRBeGk2A4pWHIleIR4C%2BXVQ3XvqSwi5E0mFPQZpGhZWlHXHMKi0Pfyn86KGTRZ%2FOYFgdpHsfF7LWTzjJAURBsMqDzC8x%2BnSxANBYtSZeLGRcyqC%2Fnm8nzqQ041s%2BzuemXXF55ImpDw9YF1%2BGBaBKvue871wLIzbqtQe25hzhs1FObm89lpci8aqW0nKG2ziPaJTB0Hym9RuW39xVswrRNa%2BG%2FKtKj7zDcOml%2BnZ7BCdI8fr9Wb5vgvAP7Dfw%3D%3D)
