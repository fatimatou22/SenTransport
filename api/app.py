import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/arrets")
def get_arrets():
    tous = []
    for l in lignes:
        tous.extend(l["listeArrets"])
    return jsonify(list(set(tous)))

@app.route("/stats")
def get_stats():
    total_arrets = sum(l["arrets"] for l in lignes)
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    return jsonify({
        "total_lignes": len(lignes),
        "total_arrets": total_arrets,
        "ligne_plus_arrets": ligne_max["numero"]
    })

@app.route("/lignes/recherche")
def recherche_lignes():
    q = request.args.get("q", "")
    resultats = [
        l for l in lignes
        if q.lower() in l["depart"].lower()
        or q.lower() in l["arrivee"].lower()
    ]
    return jsonify(resultats)

if __name__ == "__main__":
    app.run(debug=True, port=5000)