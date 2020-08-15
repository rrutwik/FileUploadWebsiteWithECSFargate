import os
from flask import Flask, redirect, render_template, request
from werkzeug.utils import secure_filename
from uploadToS3 import s3Helper

#Basic File Upload Website
s3helper = s3Helper() 
app = Flask(__name__)

def allowed_file(filename):
    return filename.lower().endswith((".pdf",".txt", ".xml"))

@app.route('/')
def hello_world():
    return render_template("mainPage.html")

@app.route("/", methods=["POST"])
def upload_file():
    if "uploadedFile" not in request.files:
        return "No uploadedFile key in request.files"
    file    = request.files["uploadedFile"]
    if file.filename == "":
        return "Please select a file"
    if file and allowed_file(file.filename):
        file.filename = secure_filename(file.filename)
        output   	  = s3helper.upload_file_to_s3(file, os.environ.get("BUCKETNAME"), file.filename)
        return str(output)
    else:
        return "Invalid File"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081, debug=True)
