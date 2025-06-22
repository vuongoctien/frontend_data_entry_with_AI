import React, { useState } from 'react'
// Import the main component
import { Viewer } from '@react-pdf-viewer/core'; // install this library
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'; // install this library
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// Worker
import { Worker } from '@react-pdf-viewer/core'; // install this library
// CSS
import './DataEntryWithAI.css'
import axios from 'axios';

export const DataEntryWithAI = () => {
    //preview
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [arrFile, set_arrFile] = useState([])
    const [indexSelectedFile, set_indexSelectedFile] = useState(0)
    const [pdfURL, set_pdfURL] = useState(null)
    const [pdfFile, set_pdfFile] = useState(null)
    const [pdfFileError, set_pdfFileError] = useState('')
    const fileType = ['application/pdf'];

    //orc
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [textShow, setTextShow] = useState('');


    const handleUploadPDF = (e) => {
        // Preview
        const temporary_variable = Array.from(e.target.files); set_arrFile(temporary_variable) // chuyển từ kiểu FileList sang kiểu Array), dùng cho preview
        chooseFile(temporary_variable, 0)

        // ORC
        setFile(e.target.files);

    }

    // hàm chọn file preview
    const chooseFile = (arr, index, callback) => {
        const selectedFile = arr[index];
        if (selectedFile && fileType.includes(selectedFile.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = (e) => {
                set_pdfFile(e.target.result);
                set_pdfFileError('');
                if (callback) callback(e.target.result); // Gọi lại khi xong
            };
        } else {
            set_pdfFile(null);
            set_pdfFileError('Please select valid pdf file');
            if (callback) callback(null);
        }
    };






    const handlePreviewAndORC = async (e) => {
        // Preview
        e.preventDefault();
        if (pdfFile !== null) { set_pdfURL(pdfFile) }
        else { set_pdfURL(null); }

        // ORC
        for (let i = 0; i < file.length; i++) {
            const formData = new FormData();
            formData.append("file", file[i]);
            setLoading(true);
            try {
                const response = await axios.post("http://localhost:8000/upload-pdf", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                setText(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.text; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });

            } catch (error) {
                console.error("Lỗi khi gửi file:", error);
                alert("Đã xảy ra lỗi khi xử lý file.");
            }
            setLoading(false);
            console.log('tyle', text)
        }

    }
    return (
        <div className=''>
            <div className='side-menu'>
                <form onSubmit={handlePreviewAndORC}>
                    <input type="file" multiple required onChange={handleUploadPDF} />
                    {pdfFileError && <div className='error-msg'>{pdfFileError}</div>}
                    <button type="submit" className='btn btn-success'>
                        Upload
                    </button>
                </form>
                <ul>
                    {arrFile && arrFile.length > 0 &&
                        arrFile.map((item, index) => {
                            return (
                                <li className='file_to_dom'
                                    onClick={() => {
                                        chooseFile(arrFile, index, (result) => {
                                            set_indexSelectedFile(index);
                                            set_pdfURL(result);
                                        });
                                        setTextShow(text[index])
                                        console.log('text', text[index])
                                    }}>
                                    {item.name}
                                </li>)
                        })}
                </ul>
            </div>
            <div className='main'>
                <div className='preview'>
                    <div className='prev-next'>
                        <a className="previous" onClick={() => {
                            const newIndex = Math.max(0, indexSelectedFile - 1);
                            set_indexSelectedFile(newIndex);
                            chooseFile(arrFile, newIndex, (result) => {
                                set_pdfURL(result);
                            });
                            setTextShow(text[newIndex])
                            console.log('text', text[newIndex])
                        }}>&laquo; Prev</a>
                        <a className="next" onClick={() => {
                            const newIndex = Math.min(arrFile.length - 1, indexSelectedFile + 1);
                            set_indexSelectedFile(newIndex);
                            chooseFile(arrFile, newIndex, (result) => {
                                set_pdfURL(result);
                            });
                            setTextShow(text[newIndex])
                            console.log('text', text[newIndex])
                        }}>Next &raquo;</a>

                    </div>
                    <div className='pdf-container'>
                        {pdfURL && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                            <Viewer fileUrl={pdfURL} plugins={[defaultLayoutPluginInstance]} />
                        </Worker></>}
                        {!pdfURL && <>No pdf file selected</>}
                    </div>
                </div>
                <div className='entry'>
                    {loading && <p>Đang xử lý...</p>}

                    {textShow && (
                        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
                            <h3>Kết quả trích xuất:</h3>
                            <p>{textShow}</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}


export default DataEntryWithAI;
