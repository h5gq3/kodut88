# Offices data API Documentation

This API provides access to information about offices and countries provided in the dataset.

## Base URL

When run locally, the base URL for all API endpoints is `http://localhost:3000`.

## Endpoints

### get offices in a country

- **URL:** `/api/offices-in/:country`
- **Method:** GET
- **Description:** Retrieve a list of offices in a specific country.
- **Parameters:**
  - `country` (string): The name of the country (case-insensitive).
- **Example:**
  ```bash
  curl -X GET http://localhost:3000/api/offices-in/estonia
  ```
- **Response:**
  - status code: 200 OK
  - data format: JSON
  - example:
  ```json
  [
    {
      "office_name": "Office 1",
      "city": "Tallinn",
      "country": "Estonia",
      "distance": "163.85",
      "local_time": "10/1/2023, 3:31 PM"
    }
  ]
  ```

### remove a country

- **URL:** `/api/remove-country/:country`
- **Method:** DELETE
- **Description:** Remove a country from the database if it has no associated offices.
- **Parameters:**
  - `country` (string): The name of the country to be removed (case-insensitive).
- **Example:**
  ```bash
  curl -X DELETE http://localhost:3000/api/remove-country/Canada
  ```
- **Response:**
  - Status Code: 204 No Content (on successful deletion)
  - Status Code: 400 Bad Request (if offices are associated)
  - Status Code: 404 Not Found (if the country doesn't exist)

**Notes:**

To remove a country, make a DELETE request to the specified endpoint with the name of the country you want to remove.
If the country has associated offices, the server will respond with a "400 Bad Request" status code, indicating that the country cannot be removed until offices are disassociated.
If the specified country doesn't exist in the database, the server will respond with a "404 Not Found" status code.
Successful removal will result in a "204 No Content" status code with an empty response body.

### create an office

- **URL:** `/api/create-office`
- **Method:** POST
- **Description:** Create a new office.
- **Request Body:**
  ```json
  {
    "countryName": "United States",
    "officeName": "New Office",
    "city": "New York",
    "latitude": 40.7128,
    "longitude": -74.006
  }
  ```
- **Example:**

  ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
    "countryName": "United States",
    "officeName": "New Office",
    "city": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060
    }' http://localhost:3000/api/create-office

  ```

- **Response Example:**
  - Status Code: 201 Created
  - Data Format: JSON
  - example:
  ```json
  {
    "message": "Office created successfully."
  }
  ```

### remove an office

- **URL:** `/api/remove-office/:officeName`
- **Method:** DELETE
- **Description:** Delete an office by its unique identifier.
- **Parameters:**
  - `officeName` (string): The name of the office to be deleted.
- **Example:**
  ```bash
  curl -X DELETE http://localhost:3000/api/delete-office/office%201
  ```
- **Response Example:**
  - Status Code: 204 No Content (on successful deletion)
  - Status Code: 404 Not Found (if the office doesn't exist)

**Notes:**

Offices that have been imported from a CSV file cannot be deleted via this API endpoint. Only manually created offices can be deleted using this endpoint.
To delete an office, make a DELETE request to the specified endpoint with the unique officeId parameter.
If the specified office ID exists in the database and is not imported, the server will respond with a "204 No Content" status code, indicating that the office was successfully deleted.
If the specified office ID does not exist in the database or is an imported office, the server will respond with a "404 Not Found" status code or provide an appropriate error message.

### create a country

- **URL:** `/api/create-country`
- **Method:** POST
- **Description:** Create a new country.
- **Request Body:**
  ```json
  {
    "countryName": "Canada",
    "timezone": "GMT-5"
  }
  ```
- **Example:**
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{
    "countryName": "Canada",
    "timezone": "GMT-5"
  }' http://localhost:3000/api/create-country
  ```
- **Response:**
  - Status Code: 201 Created
  - Data Format: JSON
  - Response Example:
    ```json
    {
      "message": "Country created successfully."
    }
    ```

**Notes:**

- To create a new country, make a POST request to the specified endpoint with the following JSON data in the request body:
  - `countryName` (string): The name of the country to be created.
  - `timezone` (string): The timezone associated with the country.
- The server will respond with a "201 Created" status code upon successful creation of the country.
- The response message indicates that the country was created successfully.

### get all countries

- **URL:** `/api/countries`
- **Method:** GET
- **Description:** Retrieve a list of all countries.
- **Example:**
  ```bash
  curl -X GET http://localhost:3000/api/countries
  ```
- **Response:**
  - Status Code: 200 OK
  - Data Format: JSON
  - Response Example:
    ```json
    [
      {
        "country_name": "United States",
        "timezone": "GMT-5"
      },
      {
        "country_name": "Canada",
        "timezone": "GMT-4"
      }
    ]
    ```

**Notes:**

- To retrieve a list of all available countries, make a GET request to the specified endpoint.
- The server will respond with a "200 OK" status code and return a JSON array containing information about each country.
- Each country object includes:
  - `country_name` (string): The name of the country.
  - `timezone` (string): The timezone associated with the country.

### get timezone by country

- **URL:** `/api/timezone/:country`
- **Method:** GET
- **Description:** Retrieve the timezone of a specific country.
- **Parameters:**
  - `country` (string): The name of the country (case-insensitive).
- **Example:**
  ```bash
  curl -X GET http://localhost:3000/api/timezone/Estonia
  ```
- **Response:**
  - Status Code: 200 OK
  - Data Format: JSON
  - Response Example:
    ```json
    {
      "timezone": "GMT-5"
    }
    ```
