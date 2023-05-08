import pandas as pd
import numpy as np
from surprise import AlgoBase, Dataset, Reader, accuracy, CoClustering, SVD, dump, Prediction
from surprise.model_selection import train_test_split, KFold, GridSearchCV, PredefinedKFold
import pymongo
from collections import defaultdict
from bson import ObjectId
import json
from tabulate import tabulate
import matplotlib.pyplot as plt
import matplotlib


class CustomAlgorithmContextSimSVD(AlgoBase):
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
                            numerator += context_similarity * \
                                self.sim[u, neighbor] * neighbor_rating
                            denominator += context_similarity * \
                                self.sim[u, neighbor]

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


class CustomAlgorithmContextSim(AlgoBase):
    def __init__(self, user_data, merged_data):
        AlgoBase.__init__(self)
        self.user_data = user_data
        self.merged_data = merged_data

    def fit(self, trainset):
        self.trainset = trainset
        self.sim_options = {'name': 'cosine', 'user_based': True}
        self.sim = self.compute_similarities()
        self.predicted_ratings = self.compute_predicted_ratings()
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
                            numerator += context_similarity * \
                                self.sim[u, neighbor] * neighbor_rating
                            denominator += context_similarity * \
                                self.sim[u, neighbor]

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
            return self.predicted_ratings[i, u]
        else:
            return self.trainset.global_mean


class CustomAlgorithmBase(AlgoBase):
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

df = pd.DataFrame(r_data, columns=["creator", "rating", "recipeID"])


reader = Reader(rating_scale=(0, 5))

data = Dataset.load_from_df(df[["creator", "recipeID", "rating"]], reader)


trainset, testset = train_test_split(data, test_size=0.2)

kf = KFold(n_splits=5)

algo_one = CustomAlgorithmBase()
algo_two = CustomAlgorithmContextSim(user_data, merged_data)
algo_three = CustomAlgorithmContextSimSVD(user_data, merged_data)
algo_four = CoClustering()

# for trainset, testset in kf.split(data):
#    algo_one.fit(trainset)
#    predictions_one = algo_one.test(testset)
#
#    algo_two.fit(trainset)
#    predictions_two = algo_two.test(testset)
#
#    algo_three.fit(trainset)
#    predictions_three = algo_three.test(testset)
#
#    algo_four.fit(trainset)
#    predictions_four = algo_four.test(testset)
#
#    accuracy.rmse(predictions_one)
#    accuracy.rmse(predictions_two)
#    accuracy.rmse(predictions_three)
#    accuracy.rmse(predictions_four)
#
#    dump.dump('./dump_one', predictions_one, algo_one)
#    dump.dump('./dump_two', predictions_two, algo_two)
#    dump.dump('./dump_three', predictions_three, algo_three)
#    dump.dump('./dump_four', predictions_four, algo_four)


# The dumps have been saved and we can now use them whenever we want.

predictions_one, algo_one = dump.load('./dump_one')
predictions_two, algo_two = dump.load('./dump_two')
predictions_three, algo_three = dump.load('./dump_three')
predictions_four, algo_four = dump.load('./dump_four')

df_one = pd.DataFrame(predictions_one, columns=[
                      'uid', 'iid', 'rui', 'est', 'details'])
df_two = pd.DataFrame(predictions_two, columns=[
                      'uid', 'iid', 'rui', 'est', 'details'])
df_three = pd.DataFrame(predictions_three, columns=[
                        'uid', 'iid', 'rui', 'est', 'details'])

df_four = pd.DataFrame(predictions_four, columns=[
    'uid', 'iid', 'rui', 'est', 'details'])


df_one['err'] = abs(df_one.est - df_one.rui)
df_two['err'] = abs(df_two.est - df_two.rui)
df_three['err'] = abs(df_three.est - df_three.rui)
df_four['err'] = abs(df_four.est - df_four.rui)


table1_err = df_one['err'].tolist()
table2_err = df_two['err'].tolist()
table3_err = df_three['err'].tolist()
table4_err = df_four['err'].tolist()

indices = np.arange(len(table1_err))

bar_width = 0.25

fig, ax = plt.subplots()
bar1 = ax.bar(indices, table1_err, bar_width, label="Original Implementation")
bar2 = ax.bar(indices + bar_width, table2_err, bar_width,
              label="Original Implementation + Context Similarity ")
bar3 = ax.bar(indices + bar_width + bar_width, table3_err, bar_width,
              label="Original Implementation + Context Similarity + SVD Matrix Factorisation ")
bar4 = ax.bar(indices + bar_width + bar_width + bar_width,
              table4_err, bar_width, label="CoClustering Algorithm")


# Customize the plot
ax.set_xlabel('Row Index')
ax.set_ylabel('Error')
ax.set_title('Error Comparison')
ax.set_xticks(indices + bar_width / 4)
ax.set_xticklabels(indices)
ax.legend()

# Show the plot
plt.show()

data = {'Algorithm': ['CoClustering', 'Original', 'Original + Context Similarity + SVD', 'Original + Context Similarity'],
        'Mean Precision': [0.8785714285714286, 0.55, 1.0, 1.0],
        'Mean Recall': [0.5844155844155844, 0.4255744255744256, 0.03571428571428571, 0.0],
        'F1 Score': [0.7019212478599962, 0.4798525421125391, 0.0689655172413793, 0.0]}

metrics_df = pd.DataFrame(data)
print(metrics_df)

metrics_df.plot(x='Algorithm', y=[
                'Mean Precision', 'Mean Recall', 'F1 Score'], kind='bar', figsize=(12, 6))
plt.title('Performance Metrics for Different Recommender Algorithms')
plt.ylabel('Score')
plt.xticks(rotation=0)
plt.show()

data_precision = {'Model': ['CoClustering', 'Original', 'Original + Context Similarity + SVD', 'Original + Context Similarity'],
                  'Mean Precision': [0.8785714285714286, 0.55, 1.0, 1.0],
                  'Mean RMSE': [2.206, 2.257, 1.972, 2.28],
                  'Mean MSE': [1.867, 2.102, 1.814, 2.008]}


data_precision_df = pd.DataFrame(data_precision)
print(data_precision_df)

data_precision_df.plot(x='Model', y=[
    'Mean Precision', 'Mean RMSE', 'Mean MSE'], kind='bar', figsize=(12, 6))
plt.title('Accuracy Metrics for Different Recommender Algorithms')
plt.ylabel('Score')
plt.xticks(rotation=0)
plt.show()


def df_to_predictions(df):
    predictions = []
    for _, row in df[['uid', 'iid', 'rui', 'est', 'details']].iterrows():
        uid, iid, rui, est, details = row
        pred = Prediction(uid, iid, rui, est, details)
        predictions.append(pred)
    return predictions


# Convert DataFrames to lists of Prediction objects
pred_one = df_to_predictions(df_one)
pred_two = df_to_predictions(df_two)
pred_three = df_to_predictions(df_three)
pred_four = df_to_predictions(df_four)

# Compute MAE and RMSE for each algorithm
mae_one = accuracy.mae(pred_one, verbose=False)
mae_two = accuracy.mae(pred_two, verbose=False)
mae_three = accuracy.mae(pred_three, verbose=False)
mae_four = accuracy.mae(pred_four, verbose=False)

rmse_one = accuracy.rmse(pred_one, verbose=False)
rmse_two = accuracy.rmse(pred_two, verbose=False)
rmse_three = accuracy.rmse(pred_three, verbose=False)
rmse_four = accuracy.rmse(pred_four, verbose=False)

# Add MAE and RMSE to the DataFrame
metrics_df['Mean MAE'] = [mae_one, mae_two, mae_three, mae_four]
metrics_df['Mean RMSE'] = [rmse_one, rmse_two, rmse_three, rmse_four]

# Create a bar plot for Mean Precision, Mean MAE, and Mean RMSE
metrics_df.plot(x='Algorithm', y=[
                'Mean Precision', 'Mean MAE', 'Mean RMSE'], kind='bar', figsize=(12, 6))
plt.title('Performance Metrics for Different Recommender Algorithms')
plt.ylabel('Score')
plt.xticks(rotation=0)
plt.show()

print(metrics_df)
