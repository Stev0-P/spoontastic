import pandas as pd
import numpy as np
import pymongo
import pprint
import matplotlib.pyplot as plt
import seaborn as sns
import json


# Step 1: Collect data
# Connect To MongoDB DB and extract user ratings into a matrix of recipes and ratings made by users
myclient = pymongo.MongoClient(
    'mongodb://admin:password@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256')

db = myclient.test

collection = db.ratings
collection2 = db.users
collection3 = db.recommended


x = collection.find({}, {"_id": 0, "creator": 1, "rating": 1, "recipeID": 1})


r_data = pd.DataFrame(list(x))

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


# Step 4: Calculate Predicted Ratings
# Calculate predicted ratings for unrated recipes based on similar users
predicted_ratings_df2 = pd.DataFrame(
    index=pivot_df.index, columns=pivot_df.columns)
for i in predicted_ratings_df2.index:
    for j in predicted_ratings_df2.columns:
        if pivot_df.loc[i, j] == 0:
            numerator = 0
            denominator = 0
            for neighbor in neighbors_df2.loc[j]:
                if pivot_df.loc[i, neighbor] != 0:
                    numerator += similarity_df2.loc[j,
                                                    neighbor]*pivot_df.loc[i, neighbor]

                    denominator += similarity_df2.loc[j, neighbor]

            if denominator != 0:
                predicted_ratings_df2.loc[i, j] = numerator/denominator
            else:
                predicted_ratings_df2.loc[i, j] = 0


# Step 5: Recommend items
# Recommend top 2 recipes with highest predicted ratings to each user

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


# define collums if rec df and convert them ti strings, then convert dataframe to dictionary
recommendations_df2.columns = recommendations_df2.columns.astype(str)
rec_dist = recommendations_df2.reset_index().to_dict(orient='records')

# item_example = '6429903461a5315f99330597'

# print(rec_dist[1])
# if user id exists in the collection update recipe else insert the data into collection
for rec_item in recommendations_df2.index:

    item = collection3.find_one({"creator": rec_item})
    if (item):
        print("found")
        item_dist = []
        for i in rec_dist:
            for key in i:
                if rec_item == i[key]:
                    item_dist = i
        collection3.update_one({"creator": rec_item}, {"$set": item_dist})

        # print("succsess")
    # update the reccomended values
    else:
        print("notfound")
        item_dist = []
        for i in rec_dist:
            for key in i:
                if rec_item != i[key]:

                    item_dist = i

        collection3.insert_one(item_dist)

    # add new user reccomended values

# inserted_all = collection3.insert_many(rec_dist)
# print(inserted_all.inserted_ids)
# db.recommended.insert_many(recs_data_dict)


# ----------------------------------------------------------------------------------------------------
