<h1><a href="https://github.com/PrakharAgarwal135/CampQuest?tab=readme-ov-file#">CampQuest </a> (Major Project)</h1>
<h3>A FullStack web application where users can EXPLORE, CREATE, and REVIEW campgrounds. </h3>

---

<h3>Deployment:</h3>

- 🚀 **Live Demo**: Check out the live version of CampQuest <a href="https://campquest-c1yx.onrender.com/">here</a>

---

<h3>CampQuest Features:</h3>

- 🔑 **User Authentication and Authorisation**: Sign up and log in to manage your campgrounds and reviews.
- 🏕  **Campground Management**: Create, edit, and delete campgrounds.
- 🌟 **Ratings and Reviews**: Share your thoughts and rate campgrounds.
- 🗺️ **Map Integration**: See campground locations on an interactive map (Maptiler).
- 📷 **Image Upload**: Upload photos of campgrounds (Cloudinary).

---

<h3>Technologies Used:</h3>

### Frontend:
-  **HTML5**: Structured the content web page.
-  **CSS3**: Styling for layout and design of web page.
-  **Bootstrap**: Front-end framework for responsive web development.
-  **JavaScript**: For client-side interactivity and dynamic content manipulation.
-  **EJS**: Embedded JavaScript
-  **Maptiler**: Interactive maps for displaying campground locations.

### Backend:
-  **Node.js**: JavaScript runtime for back-end development.
-  **Express.js**: Web application framework for building RESTful APIs.
-  **Mongoose**: Creates a connection between MongoDB and the Node.js (ODM).
-  **Passport.js**: Middleware for user authentication and session management.
-  **Helmet.js**: Helps secure the app by setting various HTTP headers.
-  **Express Sessions**: Manages user sessions for persistent login functionality.

### Database:
-  **MongoDB**: NoSQL database for storing campground and user data.
-  **MongoDB Atlas**: Cloud-hosted version of MongoDB for managing the database.

### Others:
-  **Cloudinary**: Cloud-based image hosting and management for campground images.
-  **Render**: Cloud platform for deploying the application.

---

<h3>Screenshots:</h3>

>HomePage
![home](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/home.png)

>Register page
![register](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/register.png)

>Showing All Campgrounds
![show](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/main%20map.png)
![show](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/all%20camps2.png)

>Showing Single Campground
![show](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/single%20camp2.png)

>New Campground
![new](https://github.com/PrakharAgarwal135/CampQuest/blob/main/public/images/readme%20ss/new%20camp.png)

---

<h3>How to run:</h3>

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (with npm)
- [MongoDB](https://www.mongodb.com/) (Make sure MongoDB is running if you’re using a local instance)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PrakharAgarwal135/CampQuest.git
   cd CampQuest
   
2. **Install dependencies:**

   ```bash
   npm install
   
3. **Set up environment variables:**
-  Create a `.env` file in the project's root directory.
-  Add the following variables, replacing the values with your own:
  
      ```bash
      CLOUDINARY_CLOUD_NAME=<your_cloud_name>
      CLOUDINARY_KEY=<your_cloudinary_key>
      CLOUDINARY_SECRET=<your_cloudinary_secret>
      MAPTILER_API_KEY=<your_maptile_api_key>
      DB_URL=<your_mongo_db_connection_string>
      SECRET=<your_secret_key>

4. **Run the application:**

   ```bash
   node app.js

5. **The application should now be running on `http://localhost:3000`**

### Additional Notes

- Ensure MongoDB is running locally, or use a cloud database provider like MongoDB Atlas.


