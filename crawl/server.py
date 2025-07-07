from flask import Flask, request, jsonify
import subprocess
import json
import os

app = Flask(__name__)

@app.route("/search")
def search():
    keyword = request.args.get("q", "")
    print("[DEBUG] 받은 검색어:", keyword)

    if not keyword:
        return jsonify({"error": "검색어 없음"}), 400

    cmd = f'python crawler.py "{keyword}"'
    print("[DEBUG] 실행할 명령어:", cmd)
    subprocess.run(cmd, shell=True)

    if not os.path.exists("results_googlemaps.jssn"):
        return jsonify({"error": "결과 파일 없음"}), 500

    with open("results_googlemaps.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
