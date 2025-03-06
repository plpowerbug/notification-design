# Comment System Documentation

This is a modern comment system built with Next.js, React, and the shadcn/ui component library. It provides a complete solution for managing comments with features like adding, editing, and deleting comments, as well as a notification system.

## Features

- **Comment Management**

- Add new comments
- Edit existing comments
- Delete comments
- View comments from multiple users
- Character count limit for comments



- **User Interface**

- Clean, responsive design
- User avatars
- Formatted timestamps
- Visual distinction between your comments and others'



- **Notification System**

- Real-time notifications for new comments
- Different notification types (info, success, warning)
- Mark notifications as read individually or all at once
- Unread notification counter



- **API Integration**

- Connects to a RESTful API
- Handles authentication via JWT
- Error handling and loading states





## Project Structure

```plaintext
comment-system/
├── components/
│   ├── add-comment-form.tsx    # Form for adding new comments
│   ├── comment-list.tsx        # List of comments with edit/delete functionality
│   └── notification-panel.tsx  # Notification system with popover
├── data/
│   ├── initial-comments.ts     # Sample comment data
│   └── initial-notifications.ts # Sample notification data
├── services/
│   └── api.ts                  # API service functions
├── types.ts                    # TypeScript interfaces
└── comment-page.tsx            # Main page component
```

## API Integration

The system connects to a RESTful API with the following endpoints:

- `GET /comment/application/list/{applicationId}` - Fetch all comments
- `POST /comment/application/add/{applicationId}` - Add a new comment
- `POST /comment/application/update/{commentId}` - Update an existing comment
- `POST /comment/application/delete/{commentId}` - Delete a comment


Authentication is handled via JWT token in the Authorization header.

## Comment Data Structure

```typescript
interface Comment {
  commentId: string
  targetId: string
  targetType: string
  avatarUrl: string
  content: string
  creatorId: string
  creatorFirstName: string
  creatorLastName: string
  creatorMiddleName: string | null
  creatorEmail: string
  updatedAt: string | null
  createdTime: string
}
```

## Notification System

The notification system provides real-time updates for various actions:

- New comments
- Comment likes
- User mentions


Each notification has a type (info, success, warning) with corresponding visual styling.

## Getting Started

1. Clone the repository
2. Install dependencies:

```plaintext
npm install
```


3. Configure your API endpoint and authentication in `services/api.ts`
4. Run the development server:

```plaintext
npm run dev
```




## Configuration

You can configure the following aspects of the system:

- API base URL in `services/api.ts`
- Authentication token in `services/api.ts`
- Maximum comment length in `components/add-comment-form.tsx`


## Customization

The UI is built with shadcn/ui components and Tailwind CSS, making it easy to customize:

- Modify the color scheme by updating Tailwind classes
- Change the avatar provider (currently using DiceBear API)
- Adjust the layout and spacing as needed


## Dependencies

- Next.js
- React
- shadcn/ui components
- Lucide React icons
- Tailwind CSS


## Future Improvements

- Add pagination for comments
- Implement comment replies/threading
- Add rich text formatting
- Implement real-time updates with WebSockets
- Add user authentication flow
- Add comment reactions (like, love, etc.)


## License

MIT
