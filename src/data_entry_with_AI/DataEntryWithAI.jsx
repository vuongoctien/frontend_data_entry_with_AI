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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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

    // 
    const [don_vi_hanh_chinh, set_don_vi_hanh_chinh] = useState('');
    const [loai_van_ban, set_loai_van_ban] = useState('');
    const [ngay_ban_hanh, set_ngay_ban_hanh] = useState('');
    const [nguoi_ky, set_nguoi_ky] = useState('');
    const [so_va_ky_hieu, set_so_va_ky_hieu] = useState('');
    const [trich_yeu_noi_dung, set_trich_yeu_noi_dung] = useState('');



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
                console.log('response.data', response.data)
                setText(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.text_raw; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_don_vi_hanh_chinh(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.don_vi_hanh_chinh; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_loai_van_ban(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.loai_van_ban; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_ngay_ban_hanh(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.ngay_ban_hanh; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_nguoi_ky(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.nguoi_ky; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_so_va_ky_hieu(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.so_va_ky_hieu; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });
                set_trich_yeu_noi_dung(prev => {
                    const newText = [...prev]; // tạo bản sao mới của mảng
                    newText[i] = response.data.gpt_result.trich_yeu_noi_dung; // cập nhật phần tử i
                    return newText; // trả về mảng mới để React biết cần re-render
                });

            } catch (error) {
                console.error("Lỗi khi gửi file:", error);
                alert("Đã xảy ra lỗi khi xử lý file.");
            }
            setLoading(false);
        }

    }

    const prev = () => {
        const newIndex = Math.max(0, indexSelectedFile - 1);
        set_indexSelectedFile(newIndex);
        chooseFile(arrFile, newIndex, (result) => {
            set_pdfURL(result);
        });
        setTextShow(text[newIndex])
    }

    const next = () => {
        const newIndex = Math.min(arrFile.length - 1, indexSelectedFile + 1);
        set_indexSelectedFile(newIndex);
        chooseFile(arrFile, newIndex, (result) => {
            set_pdfURL(result);
        });
        setTextShow(text[newIndex])
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
                                <li key={index} className='file_to_dom'
                                    onClick={() => {
                                        chooseFile(arrFile, index, (result) => {
                                            set_indexSelectedFile(index);
                                            set_pdfURL(result);
                                        });
                                        setTextShow(text[index])
                                    }}>
                                    {item.name}
                                </li>)
                        })}
                </ul>
            </div>
            <div className='main'>
                <div className='preview'>
                    <div className='prev-next'>
                        <a className="previous" onClick={prev}>&laquo; Prev</a>
                        <a className="next" onClick={next}>Next &raquo;</a>
                    </div>
                    <div className='pdf-container'>
                        {pdfURL && <><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                            <Viewer fileUrl={pdfURL} plugins={[defaultLayoutPluginInstance]} />
                        </Worker></>}
                        {!pdfURL && <>No pdf file selected</>}
                    </div>
                    <div className='prev-next'>
                        <a className="previous" onClick={prev}>&laquo; Prev</a>
                        <a className="next" onClick={next}>Next &raquo;</a>
                    </div>
                </div>
                <div className='entry'>
                    <div className="header">
                        <a className="logo">Vương Ngọc Tiến</a>
                        <div className="header-right">
                            <a>About this website</a>
                        </div>
                    </div>
                    {/* {textShow && (
                        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
                            <h3>Kết quả trích xuất:</h3>
                            <p>{textShow}</p>
                        </div>
                    )} */}
                    {loading && <p>Đã xử lý {text.length} / {arrFile.length} <FontAwesomeIcon icon={faSpinner} spin size="1x" /></p>}
                    <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
                        {don_vi_hanh_chinh && (<p>Đơn vị hành chính: {don_vi_hanh_chinh[indexSelectedFile]}</p>)}

                        {loai_van_ban && (<p>Loại văn bản {loai_van_ban[indexSelectedFile]}</p>)}

                        {ngay_ban_hanh && (<p>Ngày ban hành: {ngay_ban_hanh[indexSelectedFile]}</p>)}

                        {nguoi_ky && (<p>Người ký: {nguoi_ky[indexSelectedFile]}</p>)}

                        {so_va_ky_hieu && (<p>Số và ký hiệu: {so_va_ky_hieu[indexSelectedFile]}</p>)}

                        {trich_yeu_noi_dung && (<p>Trích yếu nội dung: {trich_yeu_noi_dung[indexSelectedFile]}</p>)}

                    </div>
                </div>
            </div>

        </div>
    )
}


export default DataEntryWithAI;
