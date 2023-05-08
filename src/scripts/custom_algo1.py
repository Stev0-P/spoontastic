import pandas as pd
import numpy as np
from surprise import AlgoBase, Dataset, Reader, accuracy
from surprise.model_selection import train_test_split, KFold, GridSearchCV
import pymongo
from collections import defaultdict
from bson import ObjectId
import json
from tabulate import tabulate


class CustomAlgorithmOne(AlgoBase):
    def __init__(self, k=2, d=12):
        self.k = k
        self.d = d
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

    def estimate(self, u, i):
        if self.trainset.knows_user(u) and self.trainset.knows_item(i):
            user = self.trainset.to_raw_uid(u)
            item = self.trainset.to_raw_iid(i)

            if item in self.predicted_ratings_df.index and user in self.predicted_ratings_df.columns:
                return self.predicted_ratings_df.loc[item, user]
            else:
                return self.trainset.global_mean
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

def precision_recall_at_k(predictions, k=10, threshold=3.5):
    user_est_true = defaultdict(list)
    for uid, _, true_r, est, _ in predictions:
        user_est_true[uid].append((est, true_r))

    precisions = dict()
    recalls = dict()
    for uid, user_ratings in user_est_true.items():
        user_ratings.sort(key=lambda x: x[0], reverse=True)
        n_rel = sum((true_r >= threshold) for (_, true_r) in user_ratings)
        n_rec_k = sum((est >= threshold) for (est, _) in user_ratings[:k])
        n_rel_and_rec_k = sum(((true_r >= threshold) and (est >= threshold))
                              for (est, true_r) in user_ratings[:k])

        precisions[uid] = n_rel_and_rec_k / n_rec_k if n_rec_k != 0 else 1
        recalls[uid] = n_rel_and_rec_k / n_rel if n_rel != 0 else 1

    return precisions, recalls

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


param_grid = {"k": [2, 4], "d": [10, 12]}
gs = GridSearchCV(CustomAlgorithmOne, param_grid,
                  measures=["rmse", "mae"], cv=5)

gs.fit(dataset)

mean_rmse = np.mean(gs.cv_results['mean_test_rmse'])
mean_mae = np.mean(gs.cv_results['mean_test_mae'])

print(f"Mean RMSE: {mean_rmse}")
print(f"Mean MAE: {mean_mae}")

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


model = CustomAlgorithmOne()

# Train the model using the entire dataset
trainset = dataset.build_full_trainset()
model.fit(trainset)

# Test the model with the trainset as the testset
testset = trainset.build_testset()
predictions = model.test(testset)

# Calculate precision and recall at k (e.g., k=10)
precisions, recalls = precision_recall_at_k(predictions, k=10, threshold=3.5)

# Calculate average precision and recall
mean_precision = np.mean(list(precisions.values()))
mean_recall = np.mean(list(recalls.values()))

# Calculate F1 score
f1_score = 2 * (mean_precision * mean_recall) / (mean_precision + mean_recall)

print(f"Mean Precision: {mean_precision}")
print(f"Mean Recall: {mean_recall}")
print(f"F1 Score: {f1_score}")
