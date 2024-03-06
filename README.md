# Travel App 🌍

Welcome to the Travel App! This is a simple web application that allows users to plan their trips by checking the weather forecast and images of their destination.

![img]('./img/appForm.png')
![img]('./img/appTrip.png')

## How to Run ⚙️

Before running the application, ensure you have [Node.js](https://nodejs.org/) installed on your system.

1. Clone this repository to your local machine.
    ```sh
    git clone https://github.com/thaisaraujom/project-travel-app.git
    ```
3. Create a .env in the root directory and add your API's key, replacing `<api-key>` with your actual key:
    ```sh
    GEONAMES_USERNAME=<api-key>
    PIXABAY_API_KEY=<api-key>
    WEATHERBIT_API_KEY=<api-key>
    ```
4. Install the required dependencies:
    ```sh
    npm install
    ```
5. Build the project:
    ```sh
    npm run build-prod
    ```
6. Start the server:
    ```sh
    npm start
    ```
7. Open your browser and navigate to `http://localhost:3000`.
8. To test the application, run the following command:
    ```sh
    npm run test
    ```

## How to Use 🚀

1. Enter a valid city;
2. Enter de date of your trip - the start and end date;
3. Click on the "Add" button;

## Technologies Used 🛠️
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- Webpack
- Jest
- Service Workers
- APIs: Geonames, Weatherbit, and Pixabay

## License 📝
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
