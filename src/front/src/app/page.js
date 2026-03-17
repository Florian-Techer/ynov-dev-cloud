"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [jobInfo, setJobInfo] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("");
      setJobInfo(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Veuillez sélectionner un fichier");
      return;
    }

    const requestBody = {
      file_name: selectedFile.name,
      contentType: selectedFile.type || "application/octet-stream",
    };

    try {
      setUploadStatus("Upload en cours...");
      // TODO: Remplacer par l'URL de votre API
      const response = await fetch("https://doc-api-ft.azurewebsites.net/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setJobInfo({
          jobId: data.jobId,
          status: data.status,
          uploadUrl: data.uploadUrl,
        });
        setUploadStatus("Fichier uploadé avec succès !");
        setSelectedFile(null);
        // Réinitialiser l'input
        document.getElementById("file-input").value = "";
      } else {
        setUploadStatus("Erreur lors de l'upload");
        setJobInfo(null);
      }
    } catch (error) {
      setUploadStatus("Erreur: " + error.message);
      setJobInfo(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Déposer un fichier</h1>
          <p>Sélectionnez un fichier à uploader</p>
        </div>

        <div className={styles.uploadContainer}>
          <div className={styles.fileInputWrapper}>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="file-input" className={styles.fileLabel}>
              <span className={styles.fileLabelText}>
                {selectedFile ? selectedFile.name : "Choisir un fichier"}
              </span>
              <span className={styles.fileLabelButton}>Parcourir</span>
            </label>
          </div>

          {selectedFile && (
            <div className={styles.fileInfo}>
              <p>
                <strong>Fichier sélectionné:</strong> {selectedFile.name}
              </p>
              <p>
                <strong>Taille:</strong> {formatFileSize(selectedFile.size)}
              </p>
              <p>
                <strong>Type:</strong> {selectedFile.type || "Non spécifié"}
              </p>
            </div>
          )}

          <button onClick={handleUpload} className={styles.uploadButton}>
            Uploader le fichier
          </button>

          {uploadStatus && (
            <div
              className={`${styles.status} ${
                uploadStatus.includes("succès")
                  ? styles.statusSuccess
                  : uploadStatus.includes("Erreur")
                  ? styles.statusError
                  : styles.statusInfo
              }`}
            >
              {uploadStatus}
            </div>
          )}

          {jobInfo && (
            <div className={styles.jobInfo}>
              <h3>Informations du job</h3>
              <div className={styles.jobDetails}>
                <p>
                  <strong>Job ID:</strong> <span className={styles.jobId}>{jobInfo.jobId}</span>
                </p>
                <p>
                  <strong>Status:</strong> <span className={styles.jobStatus}>{jobInfo.status}</span>
                </p>
                <p>
                  <strong>Upload URL:</strong>
                </p>
                <a
                  href={jobInfo.uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.uploadUrl}
                >
                  {jobInfo.uploadUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
