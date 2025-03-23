import os
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory, render_template

app = Flask(__name__)
UPLOAD_DIR = "uploads"
RESULT_DIR = "results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

@app.route("/")
def index():
    return render_template("upload.html")

@app.route("/upload", methods=["POST"])
def upload_vcf():
    file = request.files.get("vcf")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    uid = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{uid}.vcf")
    out_dir = os.path.join(RESULT_DIR, uid)
    os.makedirs(out_dir, exist_ok=True)
    file.save(input_path)

    cmd = [
        "java", "-jar", "build/libs/pharmcat-all.jar",
        "--vcf", input_path,
        "--outdir", out_dir
    ]

    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        return f"<p>PharmCAT failed: {e}</p>", 500

    return f"""
    <h3>PharmCAT Report Ready</h3>
    <p><a href="/report/{uid}" target="_blank">Click here to view your report</a></p>
    """

@app.route("/report/<uid>")
def get_report(uid):
    path = os.path.join(RESULT_DIR, uid, "PharmCAT_Report.html")
    if not os.path.exists(path):
        return jsonify({"error": "Report not found"}), 404
    return send_from_directory(os.path.join(RESULT_DIR, uid), "PharmCAT_Report.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
