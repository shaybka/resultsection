# Quiz Management System

## Overview

The Quiz Management System is a web application designed to manage quizzes, students, and their answers. It allows teachers to create quizzes, students to take quizzes, and provides functionality to update and view quiz results.

## Features

- Create and manage quizzes
- View and update student answers and scores
- Search and filter students
- Responsive design for easy navigation

## Technologies Used

- nextjs
- Tailwind CSS



### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/quiz-management-system.git
    cd quiz-management-system
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### Get Quiz Data

- **URL:** `/api/result/:id`
- **Method:** `GET`
- **Description:** Fetches the quiz data for the given quiz ID.

### Update Student Answers

- **URL:** `/api/update-answers/:student_id`
- **Method:** `PUT`
- **Description:** Updates the answers and score for the given student ID.

## Usage

### Viewing Quizzes

1. Navigate to the home page to see a list of quizzes.
2. Click on a quiz to view its details, including the list of students and their scores.

### Updating Student Answers

1. Click on a student to view their quiz details.
2. Update the correctness of their answers using the dropdowns.
3. Click the "Update" button to save the changes.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
