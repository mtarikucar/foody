import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import FileSaver from 'file-saver';

const ExcelUploadAndProcessComponent = () => {
    const [file, setFile] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const processRow = async (row) => {
        try {
            const response = await axiosPrivate.post('/product', row);
            toast.success(`Ürün başarıyla eklendi: ${row['Ürün Adı']}`);
            console.log('İşlem Başarılı:', response.data);
        } catch (error) {
            toast.error(`Ürün eklenemedi: ${row['Ürün Adı']}. Hata: ${error.response.data.message}`);
            console.error('İşlem Hatası:', error);
        }
    };

    const handleFileUpload = () => {
        if (!file) {
            toast.error('Lütfen bir dosya seçin.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            json.forEach(row => {
                const adaptedRow = {
                    name: row['Ürün Adı'],
                    price: row['Fiyat'],
                    ratings: row['Puanlama'],
                    categoryId: row['Kategori ID'],
                    description: row['Açıklama'],
                    featureIds: row['Özellik ID\'leri'],
                    menuId: row['Menü ID'],
                    images: row['Resim URL\'leri']
                };
                processRow(adaptedRow);
            });
        };
        reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { 'Ürün Adı': '', 'Fiyat': '', 'Puanlama': '', 'Kategori ID': '', 'Açıklama': '', 'Özellik ID\'leri': '', 'Menü ID': '', 'Resim URL\'leri': '' }
        ], { header: ['Ürün Adı', 'Fiyat', 'Puanlama', 'Kategori ID', 'Açıklama', 'Özellik ID\'leri', 'Menü ID', 'Resim URL\'leri'], skipHeader: true });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Şablon");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(data, 'template.xlsx');
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={downloadTemplate}
                className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded w-full"
            >
                Excel Şablonunu İndir
            </button>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                placeholder={"Dosya Seç"}
                className="file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
            <button
                onClick={handleFileUpload}
                className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
            >
                Dosyayı Yükle ve İşle
            </button>
            <ToastContainer/>
        </div>
    );
};

export default ExcelUploadAndProcessComponent;
