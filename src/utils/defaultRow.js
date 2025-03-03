// src/utils/defaultRow.js
import csvSchema from '../assets/CSVItem.json';

/**
 * activeTab에 해당하는 기본 행 객체를 생성합니다.
 * 필드 타입에 따라 기본값을 할당합니다.
 */
export const getDefaultRow = (activeTab) => {
    const schema = csvSchema[activeTab];
    if (!schema || !schema.item) return {};
    const defaultRow = {};
    schema.item.forEach(fieldDef => {
        const [fieldName, fieldTypeRaw] = fieldDef.split(' ');
        const fieldType = fieldTypeRaw.toLowerCase();
        const key = fieldName.toLowerCase();

        if (fieldType === 'int' || fieldType === 'float') {
            defaultRow[key] = 0;
        } else if (fieldType === 'bool' || fieldType === 'boolean') {
            defaultRow[key] = false;
        } else {
            defaultRow[key] = '';
        }
    });
    return defaultRow;
};