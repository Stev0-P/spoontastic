import pandas as pd
import numpy as np
from surprise import AlgoBase, Dataset, Reader, accuracy, SVD
from surprise.model_selection import train_test_split, KFold, GridSearchCV, cross_validate
import pymongo
from collections import defaultdict
from bson import ObjectId
import json
from tabulate import tabulate


class CustomAlgorithm(AlgoBase):
    def __init__(self, user_data, merged_data, n_factors=100, n_epochs=20, lr_all=0.005, reg_all=0.02, svd_weight=0.8):
        AlgoBase.__init__(self)
        self.user_data = user_data
        self.merged_data = merged_data
        self.svd = SVD(n_factors=n_factors, n_epochs=n_epochs,
                       lr_all=lr_all, reg_all=reg_all)
        self.svd_weight = svd_weight

    def fit(self, trainset):
        self.trainset = trainset
        self.sim_options = {'name': 'cosine', 'user_based': True}
        self.sim = self.compute_similarities()
        self.predicted_ratings = self.compute_predicted_ratings()
        self.svd.fit(trainset)
        return self

    def compute_predicted_ratings(self):
        user_ids = self.trainset.all_users()
        item_ids = self.trainset.all_items()

        predicted_ratings = np.zeros((len(item_ids), len(user_ids)))
        for i_idx, i in enumerate(item_ids):
            for u_idx, u in enumerate(user_ids):
                if self.trainset.ur[u]:
                    numerator = 0
                    denominator = 0
                    for (_, neighbor_rating) in self.trainset.ur[u]:
                        neighbor = self.trainset.to_raw_uid(neighbor_rating)
                        if self.trainset.ur[neighbor]:
                            context_similarity = self.compute_context_similarity(
                                u, neighbor, i)
                            numerator += context_similarity * self.sim[u, neighbor] * neighbor_rating
                            denominator += context_similarity * self.sim[u, neighbor]

                    if denominator != 0:
                        predicted_ratings[i_idx,
                                          u_idx] = numerator / denominator
                    else:
                        predicted_ratings[i_idx, u_idx] = 0

        return predicted_ratings

    def compute_context_similarity(self, user1, user2, recipe_id):
        user1_data = self.user_data[self.user_data['_id']
                                    == self.trainset.to_raw_uid(user1)]
        user2_data = self.user_data[self.user_data['_id']
                                    == self.trainset.to_raw_uid(user2)]

        if user1_data.empty or user2_data.empty:
            return 0

        diet_similarity = 1 if user1_data.iloc[0]['diet'] == user2_data.iloc[0]['diet'] else 0.5

        desired_recipe_cuisine = self.merged_data[self.merged_data['recipeID'] == self.trainset.to_raw_iid(
            recipe_id)]['cuisine'].iloc[0]

        user1_recipe_cuisine = self.merged_data[self.merged_data['creator'] == self.trainset.to_raw_uid(
            user1)]['cuisine'].iloc[0]
        user2_recipe_cuisine = self.merged_data[self.merged_data['creator'] == self.trainset.to_raw_uid(
            user2)]['cuisine'].iloc[0]

        if desired_recipe_cuisine == user1_recipe_cuisine and desired_recipe_cuisine == user2_recipe_cuisine:
            cuisine_similarity = 1
        elif desired_recipe_cuisine == user1_recipe_cuisine or desired_recipe_cuisine == user2_recipe_cuisine:
            cuisine_similarity = 0.75
        else:
            cuisine_similarity = 0.5

        return diet_similarity * cuisine_similarity

    def estimate(self, u, i):
        if self.trainset.knows_user(u) and self.trainset.knows_item(i):
            custom_estimate = self.predicted_ratings[i, u]
            svd_estimate = self.svd.estimate(u, i)
            return self.svd_weight * svd_estimate + (1 - self.svd_weight) * custom_estimate
        else:
            return self.trainset.global_mean


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
collection4 = db.recipes

x = collection.find({}, {"_id": 0, "creator": 1, "rating": 1, "recipeID": 1})
y = collection2.find({}, {"_id": 1, "diet": 1})
z = collection4.find({}, {"_id": 0, "recipeID": 1, "cuisine": 1})

r_data = pd.DataFrame(list(x))
user_data = pd.DataFrame(list(y))
recipe_data = pd.DataFrame(list(z))

merged_data = pd.merge(r_data, recipe_data, on='recipeID')

# Adapt the DataFrame to be compatible with the Surprise library
ratings_df = r_data.rename(
    columns={'creator': 'uid', 'recipeID': 'iid', 'rating': 'rating'})

# Define a Reader object with the appropriate rating scale
reader = Reader(rating_scale=(1, 5))

# Load the dataset from the DataFrame
data = Dataset.load_from_df(ratings_df[['uid', 'iid', 'rating']], reader)

model = CustomAlgorithm(user_data, merged_data)
cv_results = cross_validate(model, data, measures=[
                            'RMSE', 'MAE'], cv=5, verbose=True)

mean_rmse = np.mean(cv_results['test_rmse'])
mean_mae = np.mean(cv_results['test_mae'])

print(f"Mean RMSE: {mean_rmse}")
print(f"Mean MAE: {mean_mae}")


# Train the model using the entire dataset
trainset = data.build_full_trainset()
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
