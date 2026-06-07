# Devlog

## Week 1

I defined the project objective, target audience, and core features for Recollect. I researched tech stack options that would best support the project and outlined an initial development plan, including the API structure and database schema.

## Week 2

I drafted the first page designs and set up the Express server. I also researched PostgreSQL, installed it locally, and began planning how the database would support users, library books, contacts, and loans.

## Week 3

I connected the database and set up Google Books API fetching. I added the search route and controller, then worked through where searched book data should belong in the app flow. I initially explored saving searched books to the database, but ran into date-formatting issues with Google Books data and decided not to store search results directly. I also built the main library CRUD routes and set up authentication with bcrypt and JWT, testing the endpoints in Postman.

## Week 4

I began building the frontend UI. I initially tried Material UI, then switched to Tailwind CSS for more control over customization. I created the authentication context and custom auth hook, which was challenging at first but helped me understand how login state could be shared across the app. I also designed the main application pages.

## Week 5

I implemented dynamic routing and collection pages. I worked through fetching collection data from URL parameters, which helped clarify how frontend routes connect to backend endpoints. I also built the book detail fetch flow and fixed an API string issue that was causing errors in Google Books responses. Later in the week, I added the ability to save books to the library and worked through display issues with authors and library book controls.

## Week 6

I implemented edit and delete functionality and focused on making the UI update correctly after saves. I added log out and back button behavior, built book loaning functionality, and added the borrowed books feature with a new database table, routes, controllers, and UI. I also added tests with Jest and Supertest, which introduced new testing patterns for me. Toward the end of the project, I worked through issues caused by null form values. During deployment prep, I realized I should have prepared the database migration process earlier, as it was new to me and took research to resolve. Deployment with Netlify and Render had a few final hurdles, and I got mentor support to resolve the last configuration steps.
