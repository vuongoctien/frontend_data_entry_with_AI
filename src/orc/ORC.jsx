import React, { useState } from 'react';
import axios from 'axios';

export const ORC = () => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUploadPDF = (e) => {
        setFile(e.target.files[0]);
    };

    const handlePreviewAndORC = async () => {
        if (!file) {
            alert("Vui lòng chọn một file PDF!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/upload-pdf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setText(response.data.text);
        } catch (error) {
            console.error("Lỗi khi gửi file:", error);
            alert("Đã xảy ra lỗi khi xử lý file.");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>Tải PDF và ORC</h2>
            <input type="file" accept=".pdf" onChange={handleUploadPDF} />
            <button onClick={handlePreviewAndORC} style={{ marginTop: '1rem' }}>
                Gửi và nhận text
            </button>

            {loading && <p>Đang xử lý...</p>}

            {text && (
                <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
                    <h3>Kết quả trích xuất:</h3>
                    <p>{text}</p>
                </div>
            )}
        </div>
    );
}

export default ORC;