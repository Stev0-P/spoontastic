import pandas as pd
import numpy as np
import pymongo
import pprint
import matplotlib.pyplot as plt
import seaborn as sns
import json
from surprise import SVD, Dataset, Reader, accuracy, dump
from surprise.model_selection import train_test_split
from bson import ObjectId
import os


# Step 1: Collect data
# Connect To MongoDB DB and extract user ratings into a matrix of recipes and ratings made by users
myclient = pymongo.MongoClient(
    'mongodb://admin:password@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256')

db = myclient.test

collection = db.ratings
collection2 = db.users
collection3 = db.recommended
collection4 = db.recipes


x = collection.find({}, {"_id": 0, "creator": 1, "rating": 1, "recipeID": 1})
y = collection2.find({}, {"_id": 1, "diet": 1})
z = collection4.find({}, {"_id": 0, "recipeID": 1, "cuisine": 1})

r_data = pd.DataFrame(list(x))

user_data = pd.DataFrame(list(y))

recipe_data = pd.DataFrame(list(z))

merged_data = pd.merge(r_data, recipe_data, on='recipeID')


pivot_df = pd.pivot_table(r_data, values='rating',
                          index='recipeID', columns='creator')

pivot_df = pivot_df.fillna(0)


# Step 2: Compute similarity
# Calculate cosine similarity between each pair of users
similarity_df2 = pd.DataFrame(
    index=pivot_df.columns, columns=pivot_df.columns)
for i in similarity_df2.columns:
    for j in similarity_df2.columns:
        similarity_df2.loc[i, j] = np.dot(pivot_df[i], pivot_df[j])/(
            np.linalg.norm(pivot_df[i])*np.linalg.norm(pivot_df[j]))


# Step 3: Identify neighbors
# Select the top 2 most similar users as neighbors for each user
k = 2
neighbors_df2 = pd.DataFrame(index=pivot_df.columns, columns=range(1, k+1))
for i in neighbors_df2.index:
    neighbor_series = similarity_df2.loc[i].sort_values(ascending=False)[1:k+1]
    neighbors_df2.loc[i, :] = neighbor_series.index


def compute_context_similarity(user1, user2, merged_data, user_data,  recipe_id):
    user1_data = user_data[user_data['_id'] == user1]
    user2_data = user_data[user_data['_id'] == user2]

    if user1_data.empty or user2_data.empty:
        return 0

    diet_similarity = 1 if user1_data.iloc[0]['diet'] == user2_data.iloc[0]['diet'] else 0.5

    # Get cuisine for the desired recipe_id
    desired_recipe_cuisine = merged_data[merged_data['recipeID']
                                         == recipe_id]['cuisine'].iloc[0]

    # Get the nearest neighbors' recipe cuisines
    user1_recipe_cuisine = merged_data[merged_data['creator']
                                       == user1]['cuisine'].iloc[0]
    user2_recipe_cuisine = merged_data[merged_data['creator']
                                       == user2]['cuisine'].iloc[0]

    # Compute cuisine similarity
    if desired_recipe_cuisine == user1_recipe_cuisine and desired_recipe_cuisine == user2_recipe_cuisine:
        cuisine_similarity = 1
    elif desired_recipe_cuisine == user1_recipe_cuisine or desired_recipe_cuisine == user2_recipe_cuisine:
        cuisine_similarity = 0.75
    else:
        cuisine_similarity = 0.5

    return diet_similarity * cuisine_similarity

    # * cuisine_similarity


# Step 4: Calculate Predicted Ratings
# Calculate predicted ratings for unrated recipes based on similar users, diets, and cuisines
predicted_ratings_df2 = pd.DataFrame(
    index=pivot_df.index, columns=pivot_df.columns)
for i in predicted_ratings_df2.index:
    for j in predicted_ratings_df2.columns:
        if pivot_df.loc[i, j] == 0:
            numerator = 0
            denominator = 0
            for neighbor in neighbors_df2.loc[j]:
                if pivot_df.loc[i, neighbor] != 0:

                    context_similarity = compute_context_similarity(
                        j, neighbor, merged_data, user_data, i)

                    numerator += context_similarity * \
                        similarity_df2.loc[j, neighbor] * \
                        pivot_df.loc[i, neighbor]
                    denominator += context_similarity * \
                        similarity_df2.loc[j, neighbor]

            if denominator != 0:
                predicted_ratings_df2.loc[i, j] = numerator/denominator
            else:
                predicted_ratings_df2.loc[i, j] = 0


# Step 5: Recommend items
# Recommend top 12 recipes with highest predicted ratings to each user

d = 12
recommendations_df2 = pd.DataFrame(
    index=pivot_df.columns, columns=range(1, d+1))
for i in recommendations_df2.index:
    recommended_series = predicted_ratings_df2.loc[:, i].sort_values(ascending=False)[
        :d]
    recommendations_df2.loc[i, :] = recommended_series.index


print("Ratings Matrix:")
print(pivot_df.to_string())

print("\nSimilarity Matrix:")
print(similarity_df2.to_string())
print("\nNeighbors:")
print(neighbors_df2.to_string())
print("\nPredicted Ratings:")
print(predicted_ratings_df2.to_string())
print("\nRecommendations:")
print(recommendations_df2.to_string())


# define collums of rec df and convert them to strings, then convert dataframe to dictionary
recommendations_df2.columns = recommendations_df2.columns.astype(str)

# rec_dist = recommendations_df2.to_dict('index')


# Next, convert the recipe ids into the required format
rec_dict = recommendations_df2.to_dict(orient='index')
for creator_id, recipe_dict in rec_dict.items():
    # print(creator_id)

    recs = []
    for recipe_id in recipe_dict:
        recs.append(recipe_dict[recipe_id])
    rec_dict[creator_id] = {'recs': recs}


# ----------------------------------------------------------------------------------------------------
for creator_id, recipe_dict in rec_dict.items():

    existing_recipe = collection3.find_one({"creator": creator_id})

    if existing_recipe:
        collection3.update_one({'creator': creator_id}, {
                               '$set': {'recs': recipe_dict['recs']}})

    else:

        collection3.insert_one(
            {'creator': creator_id, 'recs': recipe_dict['recs']})


# ------------------------------------------------------------------------------------------------
