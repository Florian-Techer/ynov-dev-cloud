"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Upload en cours...");
      // TODO: Remplacer par l'URL de votre API
      const response = await fetch("https://doc-api-ft.azurewebsites.net/jobs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Fichier uploadé avec succès !");
        setSelectedFile(null);
        // Réinitialiser l'input
        document.getElementById("file-input").value = "";
      } else {
        setUploadStatus("Erreur lors de l'upload");
      }
    } catch (error) {
      setUploadStatus("Erreur: " + error.message);
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
        </div>
      </main>
    </div>
  );
}
