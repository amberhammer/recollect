# recollect
## DevLog
### Week 1
- Planned project objective, target audience, and core features
- Researched tech stack options best suited to project needs
- Outlined a development plan, including API design and database schema
### Week 2
- Drafted basic design of pages
- Set up Express server
- Researched and installed PostgreSQL
### Week 3
- Connected database
- Set up Google Books API fetching
- Added search route and controller to fetch from API, had difficulty understanding where in pipeline to save searched books to database
- Upsert searched books to database, ran into issue with date formatting from Google Books to accept to PSQL as a date, decided against saving data as a violation of Google Books Terms and Conditions
- Library CRUD operations and routes, had difficulty working with new database and ensuring correct req were being sent to fulfill table constraints
- Set up user auth with new technology, bcrypt and JWT, and tested with Postman
### Week 4
- Began building UI with Material UI, then switched to Tailwind for more customization
- Created auth context and hook, this was hard to wrap my head around
- Designed main pages of application
### Week 5
- Dynamic routing
- Fetch function for collection pages, had difficulty understanding pulling the url params to fetch correct collection