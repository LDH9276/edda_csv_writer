// src/components/CSVExporter.jsx
import Papa from 'papaparse';
import csvSchema from '../assets/CSVItem.json';

const CSVExporter = ({ rows, activeTab }) => {
    const schema = csvSchema[activeTab];

    const handleExportCSV = () => {
        // 스키마 순서대로 각 열의 헤더와 값을 설정
        const csvData = rows.map((row) => {
            const newRow = {};
            schema.item.forEach((fieldDef) => {
                const [fieldName] = fieldDef.split(' ');
                // 스키마에 정의된 필드명을 헤더로 사용하고, 소문자화한 키를 row에서 조회
                newRow[fieldName] = row[fieldName.toLowerCase()] || '';
            });
            return newRow;
        });
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeTab + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return <button onClick={handleExportCSV}>파일 내보내기</button>;
};

export default CSVExporter;