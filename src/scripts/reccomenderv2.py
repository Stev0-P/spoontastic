import pandas as pd
import numpy as np
import pymongo
import pprint
import matplotlib.pyplot as plt
import seaborn as sns
import json
from surprise import BaselineOnly, CoClustering, SVD, Dataset, Reader, accuracy, dump, KNNBasic
from surprise.model_selection import train_test_split, cross_validate, KFold, GridSearchCV
from bson import ObjectId
import os
from collections import defaultdict
import random
from tabulate import tabulate


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


# --------------------------------

param_grid = {"n_epochs": [5, 20], "n_cltr_u": [
    3, 5], "n_cltr_u": [3, 5]}
gs = GridSearchCV(CoClustering, param_grid, measures=["rmse", "mae"], cv=5)

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
# -------------------------------

trainset, testset = train_test_split(dataset, test_size=0.2)

kf = KFold(n_splits=3)

# Create and train the CoClustering model
algo = CoClustering()

for trainset, testset in kf.split(dataset):

    # train and test algorithm.
    algo.fit(trainset)
    predictions = algo.test(testset)

    # Compute and print Root Mean Squared Error
    accuracy.rmse(predictions)


# Get all unique user and recipe IDs
unique_users = df["creator"].unique().tolist()
unique_recipes = df["recipeID"].unique().tolist()

# Get the top n recommendations for each user


def get_top_n(user_id, all_items, algo, n=12):
    # Get the predicted ratings for all items
    item_ratings = [(item, algo.predict(user_id, item).est)
                    for item in all_items]

    # Sort the items by the predicted ratings in descending order
    sorted_item_ratings = sorted(
        item_ratings, key=lambda x: x[1], reverse=True)

    # Get the top n item IDs
    top_n_items = [item_id for item_id, _ in sorted_item_ratings[:n]]

    return top_n_items


# Generate a dictionary to store the recommendations for each user
output_dict = defaultdict(list)


# Get the top 12 recommendations for each user
for user in unique_users:
    top_n_recs = get_top_n(user, unique_recipes, algo, n=12)
    output_dict[str(user)].extend(top_n_recs)

# Convert the output dictionary to the desired format
output_json = json.dumps(output_dict, default=str, indent=2)
print(output_json)


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


# Train the model using the entire dataset
trainset = dataset.build_full_trainset()
algo.fit(trainset)

# Test the model with the trainset as the testset
testset = trainset.build_testset()
predictions = algo.test(testset)

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
