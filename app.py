
from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# Get the absolute path of the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Join the directory path with the CSV file name
csv_path = os.path.join(script_dir, 'amazon.csv')
df = pd.read_csv(csv_path)

df["about_product"] = df["about_product"].fillna("")
df["review_content"] = df["review_content"].fillna("")
df["content"] = df["about_product"] + " " + df["review_content"]

tfidf = TfidfVectorizer(stop_words="english", max_features=5000)
matrix = tfidf.fit_transform(df["content"])
similarity = cosine_similarity(matrix)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/search")
def search():
    q = request.args.get("q","").lower()
    results = []
    for _, row in df[df["product_name"].str.lower().str.contains(q, na=False)].head(10).iterrows():
        results.append({
            "product_id": row["product_id"],
            "product_name": row["product_name"]
        })
    return jsonify(results)

@app.route("/api/recommend/<product_id>")
def recommend(product_id):
    idx = df.index[df["product_id"] == product_id]
    if len(idx) == 0:
        return jsonify([])

    idx = idx[0]
    sims = list(enumerate(similarity[idx]))
    sims = sorted(sims, key=lambda x: x[1], reverse=True)[1:6]

    recs = []
    for i, score in sims:
        recs.append({
            "product_name": df.iloc[i]["product_name"],
            "category": str(df.iloc[i]["category"]).split("|")[0],
            "score": round(float(score), 4)
        })
    return jsonify(recs)

if __name__ == "__main__":
    app.run(debug=True)
