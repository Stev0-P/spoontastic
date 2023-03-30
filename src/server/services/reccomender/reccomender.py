import pandas as pd
import numpy as np

# Step 1: Collect data
# Create a ratings matrix with 5 users and 5 recipes
ratings_data = {'user1': [3, 2, 0, 4, 5, 0, 4, 2, 0, 0, 0, 3, 4],
                'user2': [1, 4, 2, 3, 0, 1, 3, 0, 5, 2, 0, 0, 0],
                'user3': [2, 3, 4, 0, 1, 0, 1, 2, 0, 3, 0, 0, 3],
                'user4': [0, 3, 2, 4, 0, 2, 2, 0, 3, 5, 0, 3, 0],
                'user5': [5, 2, 3, 0, 4, 3, 4, 3, 4, 2, 0, 0, 2]}

ratings_df = pd.DataFrame(ratings_data, index=['recipe1', 'recipe2', 'recipe3', 'recipe4', 'recipe5',
                          'recipe6', 'recipe7', 'recipe8', 'recipe9', 'recipe10', 'recipe11', 'recipe12', 'recipe13'])


# Step 2: Compute similarity
# Calculate cosine similarity between each pair of users
similarity_df = pd.DataFrame(
    index=ratings_df.columns, columns=ratings_df.columns)
for i in similarity_df.columns:
    for j in similarity_df.columns:
        similarity_df.loc[i, j] = np.dot(ratings_df[i], ratings_df[j])/(
            np.linalg.norm(ratings_df[i])*np.linalg.norm(ratings_df[j]))

# Step 3: Identify neighbors
# Select the top 2 most similar users as neighbors for each user
k = 2
neighbors_df = pd.DataFrame(index=ratings_df.columns, columns=range(1, k+1))
for i in neighbors_df.index:
    neighbor_series = similarity_df.loc[i].sort_values(ascending=False)[1:k+1]
    neighbors_df.loc[i, :] = neighbor_series.index


predicted_ratings_df = pd.DataFrame(
    index=ratings_df.index, columns=ratings_df.columns)
for i in predicted_ratings_df.index:
    for j in predicted_ratings_df.columns:
        if ratings_df.loc[i, j] == 0:
            numerator = 0
            denominator = 0
            for neighbor in neighbors_df.loc[j]:
                if ratings_df.loc[i, neighbor] != 0:
                    numerator += similarity_df.loc[j,
                                                   neighbor]*ratings_df.loc[i, neighbor]

                    denominator += similarity_df.loc[j, neighbor]

            if denominator != 0:
                predicted_ratings_df.loc[i, j] = numerator/denominator
            else:
                predicted_ratings_df.loc[i, j] = 0

# Step 5: Recommend items
# Recommend top 2 recipes with highest predicted ratings to each user
recommendations_df = pd.DataFrame(
    index=ratings_df.columns, columns=range(1, k+1))
for i in recommendations_df.index:
    recommended_series = predicted_ratings_df.loc[:, i].sort_values(ascending=False)[
        :k]
    recommendations_df.loc[i, :] = recommended_series.index

print("Ratings Matrix:")
print(ratings_df)
print("\nSimilarity Matrix:")
print(similarity_df)
print("\nNeighbors:")
print(neighbors_df)
print("\nPredicted Ratings:")
print(predicted_ratings_df)
print("\nRecommendations:")
print(recommendations_df)
