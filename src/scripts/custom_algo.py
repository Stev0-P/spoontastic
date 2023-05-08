import pandas as pd
import numpy as np
from surprise import AlgoBase, Dataset, Reader, accuracy
from surprise.model_selection import train_test_split, KFold, GridSearchCV, cross_validate
import pymongo
from collections import defaultdict
from bson import ObjectId
import json
from tabulate import tabulate


class CustomAlgorithm(AlgoBase):
    def __init__(self, k=2, d=12, n_epochs=10, lr_all=0.005, reg_all=0.4):
        self.k = k
        self.d = d
        self.n_epochs = n_epochs
        self.lr_all = lr_all
        self.reg_all = reg_all
        AlgoBase.__init__(self)

    def fit(self, trainset):
        self.trainset = trainset
        self.user_ids = [trainset.to_raw_uid(
            uid) for uid in trainset.all_users()]
        self.item_ids = [trainset.to_raw_iid(
            iid) for iid in trainset.all_items()]

        # Convert trainset to DataFrame
        ratings = [rating for uid, iids in trainset.ur.items()
                   for (_, rating) in iids]
        users = [trainset.to_raw_uid(uid) for uid,
                 iids in trainset.ur.items() for _ in iids]
        items = [trainset.to_raw_iid(
            iid) for uid, iids in trainset.ur.items() for (iid, _) in iids]
        r_data = pd.DataFrame(
            {'creator': users, 'recipeID': items, 'rating': ratings})

        pivot_df = pd.pivot_table(
            r_data, values='rating', index='recipeID', columns='creator')
        pivot_df = pivot_df.fillna(0)

        # Calculate cosine similarity between each pair of users
        similarity_df = pd.DataFrame(
            index=pivot_df.columns, columns=pivot_df.columns)
        for i in similarity_df.columns:
            for j in similarity_df.columns:
                similarity_df.loc[i, j] = np.dot(
                    pivot_df[i], pivot_df[j]) / (np.linalg.norm(pivot_df[i]) * np.linalg.norm(pivot_df[j]))

        # Select the top k most similar users as neighbors for each user
        self.neighbors_df = pd.DataFrame(
            index=pivot_df.columns, columns=range(1, self.k + 1))
        for i in self.neighbors_df.index:
            neighbor_series = similarity_df.loc[i].sort_values(ascending=False)[
                1:self.k + 1]
            self.neighbors_df.loc[i, :] = neighbor_series.index

        # Calculate predicted ratings for unrated items based on similar users
        self.predicted_ratings_df = pd.DataFrame(
            index=pivot_df.index, columns=pivot_df.columns)
        for i in self.predicted_ratings_df.index:
            for j in self.predicted_ratings_df.columns:
                if pivot_df.loc[i, j] == 0:
                    numerator = 0
                    denominator = 0
                    for neighbor in self.neighbors_df.loc[j]:
                        if pivot_df.loc[i, neighbor] != 0:
                            numerator += similarity_df.loc[j,
                                                           neighbor] * pivot_df.loc[i, neighbor]
                            denominator += similarity_df.loc[j, neighbor]

                    if denominator != 0:
                        self.predicted_ratings_df.loc[i,
                                                      j] = numerator / denominator
                    else:
                        self.predicted_ratings_df.loc[i, j] = 0

        n_users = trainset.n_users
        n_items = trainset.n_items
        self.user_factors = np.random.normal(
            scale=1.0 / self.d, size=(n_users, self.d))
        self.item_factors = np.random.normal(
            scale=1.0 / self.d, size=(n_items, self.d))

        # Perform matrix factorization
        for epoch in range(self.n_epochs):
            for u, i, r in trainset.all_ratings():
                err = r - np.dot(self.user_factors[u], self.item_factors[i])

                # Update user and item factors
                self.user_factors[u] += self.lr_all * \
                    (err * self.item_factors[i] -
                     self.reg_all * self.user_factors[u])
                self.item_factors[i] += self.lr_all * \
                    (err * self.user_factors[u] -
                     self.reg_all * self.item_factors[i])

    def estimate(self, u, i):
        if self.trainset.knows_user(u) and self.trainset.knows_item(i):
            user = self.trainset.to_raw_uid(u)
            item = self.trainset.to_raw_iid(i)

            # Get user-based collaborative filtering estimate
            if item in self.predicted_ratings_df.index and user in self.predicted_ratings_df.columns:
                cf_estimate = self.predicted_ratings_df.loc[item, user]
            else:
                cf_estimate = self.trainset.global_mean

            # Get matrix factorization estimate
            matrix_factorization_estimate = np.dot(
                self.user_factors[u], self.item_factors[i])

            # Combine both estimates (you can use different strategies, e.g., weighted average)
            final_estimate = (cf_estimate + matrix_factorization_estimate) / 2
            return final_estimate
        else:
            return self.trainset.global_mean

    def get_recommendations(self, user, n_recommendations=12):
        if user not in self.predicted_ratings_df.columns:
            return []

        recommended_series = self.predicted_ratings_df.loc[:, user].sort_values(
            ascending=False)[:n_recommendations]
        recommendations = list(recommended_series.index)
        return recommendations


# ------------------------

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

df = pd.DataFrame(r_data, columns=["creator", "rating", "recipeID"])


reader = Reader(rating_scale=(0, 5))

dataset = Dataset.load_from_df(df[["creator", "recipeID", "rating"]], reader)


param_grid = {"n_epochs": [5, 10], "lr_all": [
    0.002, 0.005], "reg_all": [0.4, 0.6]}
gs = GridSearchCV(CustomAlgorithm, param_grid, measures=["rmse", "mae"], cv=3)


gs.fit(dataset)

table = [[] for _ in range(len(gs.cv_results["params"]))]
for i in range(len(gs.cv_results["params"])):
    for key in gs.cv_results.keys():
        table[i].append(gs.cv_results[key][i])

header = gs.cv_results.keys()
print(tabulate(table, header, tablefmt="rst"))

print()

for key, val in gs.cv_results.items():
    print("{:<20}".format("'" + key + "':"), end="")
    if isinstance(val[0], float):
        print([float(f"{f:.2f}") for f in val])
    else:
        print(val)
