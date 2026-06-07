# Future Improvements

## Planned Feature

### Add Friends and View Their Libraries

I planned to add a friends feature so users could connect with each other, view shared library information, and eventually link loans or borrowed books to other Recollect users.

#### Possible File Structure

```txt
client/src/api/friendsApi.js
client/src/pages/FriendsPage.jsx
client/src/pages/FriendLibraryPage.jsx
client/src/components/friends/FriendCard.jsx
client/src/components/friends/FriendRequestButton.jsx
client/src/components/friends/FriendRequestsList.jsx
client/src/components/friends/FriendLibraryHeader.jsx

server/routes/friendsRoutes.js
server/controllers/friendsController.js
server/db/migrations/007_create_friendships.sql
server/__tests__/friendsRoutes.test.js
```

#### High-Level Implementation

The backend would need a `friendships` table to track pending, accepted, and rejected friend requests between users. New friend routes and controllers would handle sending requests, accepting or rejecting requests, listing friends, and fetching a friend's visible library. The frontend would add API helpers, a friends page, friend request UI, and a friend library page that reuses existing book display components where possible. Library queries would need ownership and friendship checks so users can only view libraries shared by accepted friends. Later, loans and borrowed books could optionally link to a friend user instead of only a contact record.

## Other Future Features

- Create custom collections.
- Add search filtering.
- Add loan reminders.
- Request to borrow a book from a friend's library.
