import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import { useGetPosts, useCreatePost, useLikePost } from "@/libs/api/queries";
import { useState } from "react";

/**
 * Example component showing how to use the API queries
 * This demonstrates fetching data, mutations, and error handling
 */
export function FeedExample() {
  const [page, setPage] = useState(1);
  const { data: posts, isLoading, error } = useGetPosts(page);
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();

  const handleCreatePost = async () => {
    try {
      await createPostMutation.mutateAsync({
        content: "Hello, world!",
        // Add other fields as needed
      });
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePostMutation.mutateAsync(postId);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading posts</Text>
        <Text>{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Create Post"
        onPress={handleCreatePost}
        disabled={createPostMutation.isPending}
      />

      <FlatList
        data={posts?.data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.user?.name}
            </Text>
            <Text>{item.content}</Text>
            <Button
              title={`Like (${item.likes_count})`}
              onPress={() => handleLikePost(item.id)}
              disabled={likePostMutation.isPending}
            />
          </View>
        )}
      />

      <Button title="Load More" onPress={() => setPage(page + 1)} />
    </View>
  );
}

/**
 * Example of using user profile queries
 */
export function ProfileExample() {
  const { data: user, isLoading } = useGetCurrentUser();

  if (isLoading) return <Text>Loading profile...</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
      <Text>@{user?.username}</Text>
      <Text>{user?.bio}</Text>
      <Text>Followers: {user?.followers_count}</Text>
      <Text>Following: {user?.following_count}</Text>
    </View>
  );
}

/**
 * Example of optimistic updates with mutations
 */
export function CommentExample({ postId }: { postId: string }) {
  const { data: comments, isLoading } = useGetPostComments(postId);
  const createCommentMutation = useCreateComment();
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: commentText,
      });
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (isLoading) return <Text>Loading comments...</Text>;

  return (
    <View>
      <FlatList
        data={comments?.data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{ padding: 12, backgroundColor: "#f0f0f0", marginBottom: 8 }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.user?.name}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <input
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Add a comment..."
          disabled={createCommentMutation.isPending}
        />
        <Button
          title="Post"
          onPress={handleAddComment}
          disabled={createCommentMutation.isPending}
        />
      </View>
    </View>
  );
}
