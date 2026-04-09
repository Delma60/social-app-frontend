# API Integration Guide

This directory contains the API client setup using Axios and TanStack Query for data management.

## Files

- **client.ts** - Axios instance with interceptors for authentication and error handling
- **queries.ts** - Custom hooks for API queries and mutations using TanStack Query
- **README.md** - This file

## Setup

### 1. Wrap Your App with QueryProvider

In your root layout component, wrap the app with `QueryProvider`:

```tsx
import { QueryProvider } from '@/libs/query-provider';

export default function RootLayout() {
  return (
    <QueryProvider>
      {/* Your app content */}
    </QueryProvider>
  );
}
```

### 2. Environment Variables

Create a `.env.local` file in the frontend root:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update this to your production API URL.

## Usage Examples

### Fetching Data

```tsx
import { useGetPosts } from '@/libs/api/queries';

export function FeedScreen() {
  const { data: posts, isLoading, error } = useGetPosts();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
```

### Creating Data (Mutations)

```tsx
import { useCreatePost } from '@/libs/api/queries';

export function CreatePostScreen() {
  const createPostMutation = useCreatePost();

  const handleSubmit = async (content: string) => {
    await createPostMutation.mutateAsync({ content });
  }

  return (
    <Button
      title="Post"
      onPress={() => handleSubmit('Hello world')}
      disabled={createPostMutation.isPending}
    />
  );
}
```

### User Authentication

```tsx
import { useGetCurrentUser } from '@/libs/api/queries';

export function ProfileScreen() {
  const { data: user, isLoading } = useGetCurrentUser();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>{user?.name}</Text>
      <Text>@{user?.username}</Text>
    </View>
  );
}
```

### Pagination

```tsx
import { useGetPosts } from '@/libs/api/queries';
import { useState } from 'react';

export function FeedScreen() {
  const [page, setPage] = useState(1);
  const { data: posts } = useGetPosts(page);

  return (
    <>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
      />
      <Button title="Load More" onPress={() => setPage(page + 1)} />
    </>
  );
}
```

## Customizing Axios Interceptors

Edit `client.ts` to add:

- **Authentication tokens**: Add Bearer token in request interceptor
- **Error handling**: Customize error responses
- **Request/response transformation**: Modify data format

Example with auth token:

```tsx
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Available Query Hooks

### User Operations
- `useGetUser(userId)` - Get user profile
- `useGetCurrentUser()` - Get current logged-in user
- `useUpdateUser()` - Update user profile

### Posts
- `useGetPosts(page)` - Get feed posts
- `useGetUserPosts(userId)` - Get user's posts
- `useCreatePost()` - Create new post
- `useDeletePost()` - Delete post

### Comments
- `useGetPostComments(postId)` - Get post comments
- `useCreateComment()` - Add comment to post

### Interactions
- `useLikePost()` - Like a post
- `useUnlikePost()` - Unlike a post
- `useFollowUser()` - Follow a user
- `useUnfollowUser()` - Unfollow a user

## TanStack Query Features

- **Automatic caching** - Responses are cached for 5 minutes by default
- **Automatic refetching** - Data refetches when needed
- **Optimistic updates** - Update UI before API response
- **Background refetching** - Keep data fresh in background
- **Mutation handling** - Built-in loading/error states

## Troubleshooting

### CORS Issues
If you're getting CORS errors, ensure your Laravel backend has CORS configured properly in `config/cors.php`.

### Auth Interceptor Not Working
Make sure the token is set before making requests. Add debugging to the request interceptor.

### Queries Not Refetching
Check that `invalidateQueries()` is being called correctly after mutations.
