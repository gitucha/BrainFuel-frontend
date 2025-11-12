import React, { useState } from "react";
import api from "../lib/api";

export default function AvatarUploader({ currentUrl, onUpdated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    setFile(e.target.files[0]);
  };

  const upload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/me/avatar/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdated?.(data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <img src={currentUrl || "/default-avatar.png"} alt="avatar" className="w-24 h-24 rounded-full" />
      <div className="mt-2">
        <input type="file" accept="image/*" onChange={handle} />
        <button onClick={upload} disabled={!file || loading} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
