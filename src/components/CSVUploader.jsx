import Papa from 'papaparse';
import csvSchema from '../assets/CSVItem.json';

const CSVUploader = ({ onDataLoaded, activeTab }) => {
    const schema = csvSchema[activeTab];

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // 스키마의 헤더 목록 (대소문자 구분 없이 비교)
                const expectedHeaders = schema.item.map((fieldDef) =>
                    fieldDef.split(' ')[0].toLowerCase()
                );

                // CSV 파일의 헤더 목록
                const csvHeaders = results.meta.fields.map((header) => header.toLowerCase());

                // 헤더 비교: 길이가 다르거나, 하나라도 일치하지 않으면 alert
                const headersMatch =
                    expectedHeaders.length === csvHeaders.length &&
                    expectedHeaders.every((header) => csvHeaders.includes(header));

                if (!headersMatch) {
                    alert("일치하지 않는 CSV입니다.");
                    return;
                }

                // CSV 파일의 헤더와 스키마를 매칭하여 데이터를 생성
                const parsedRows = results.data.map((item) => {
                    const newRow = {};
                    schema.item.forEach((fieldDef) => {
                        const [fieldName] = fieldDef.split(' ');
                        newRow[fieldName.toLowerCase()] = item[fieldName] || '';
                    });
                    return newRow;
                });
                onDataLoaded(parsedRows);
            },
            error: (error) => {
                console.error('CSV 파싱 에러:', error);
            },
        });
    };

    return (
        <div className="csv-uploader">
            <label htmlFor="csv-upload" className="custom-file-upload">
                CSV 파일 선택
            </label>
            <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default CSVUploader;