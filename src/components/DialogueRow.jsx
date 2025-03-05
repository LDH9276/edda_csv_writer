// src/components/DialogueRow.jsx
import { useEffect, useState } from 'react';
import csvSchema from '../assets/CSVItem.json';
import schemaName from '../assets/CSVlocalize.json';
import schemaToolTip from '../assets/CSVtooltip.json';

const DialogueRow = ({ row, index, updateRow, addRowAfter, deleteRow, activeTab }) => {
    const [schema, setSchema] = useState(csvSchema[activeTab] || null);
    // 각 필드의 hover 상태를 저장 (현재 hover된 필드의 idx)
    const [hoveredField, setHoveredField] = useState(null);

    useEffect(() => {
        setSchema(csvSchema[activeTab]);
    }, [activeTab]);

    return (
        <div className="dialogue-row">
            <div className="dialogue-item">
                {schema.item.map((fieldDef, idx) => {
                    const [fieldName, fieldTypeRaw] = fieldDef.split(' ');
                    const fieldType = fieldTypeRaw.toLowerCase();
                    const key = fieldName.toLowerCase();
                    // CSVlocalize.json과 CSVtooltip.json에서 localized 이름과 tooltip 텍스트를 가져옵니다.
                    const localizedFieldName = (schemaName[activeTab] && schemaName[activeTab].item && schemaName[activeTab].item[idx]) || fieldName;
                    const tooltipText = (schemaToolTip[activeTab] && schemaToolTip[activeTab].description && schemaToolTip[activeTab].description[idx]) || '';

                    let inputElement = null;

                    if (fieldType === 'bool' || fieldType === 'boolean') {
                        inputElement = (
                            <div key={idx}>
                                <div
                                    className="field-label"
                                    onMouseEnter={() => setHoveredField(idx)}
                                    onMouseLeave={() => setHoveredField(null)}
                                >
                                    <span>{localizedFieldName}</span>
                                    <div className={`tooltip ${hoveredField === idx ? 'active' : ''}`}>
                                        <div className="tooltip-box">
                                            {tooltipText}
                                        </div>
                                    </div>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`${key}-${index}`}
                                            value="true"
                                            checked={row[key] === true || row[key] === 'true'}
                                            onChange={() => updateRow(index, key, true)}
                                        />
                                        True
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`${key}-${index}`}
                                            value="false"
                                            checked={row[key] === false || row[key] === 'false'}
                                            onChange={() => updateRow(index, key, false)}
                                        />
                                        False
                                    </label>
                                </div>
                            </div>
                        );
                    } else if (fieldType === 'int' || fieldType === 'float') {
                        inputElement = (
                            <label key={idx}>
                                <div
                                    className="field-label"
                                    onMouseEnter={() => setHoveredField(idx)}
                                    onMouseLeave={() => setHoveredField(null)}
                                >
                                    <span>{localizedFieldName}</span>
                                    <div className={`tooltip ${hoveredField === idx ? 'active' : ''}`}>
                                        <div className="tooltip-box">
                                            {tooltipText}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    placeholder={fieldName}
                                    value={row[key] ?? 0}
                                    onChange={(e) => updateRow(index, key, Number(e.target.value))}
                                    readOnly={fieldName.toLowerCase() === 'id'}
                                />
                            </label>
                        );
                    } else if (fieldName == 'Text'){
                        inputElement = (
                            <label key={idx} className='text'>
                                <div
                                    className="field-label"
                                    onMouseEnter={() => setHoveredField(idx)}
                                    onMouseLeave={() => setHoveredField(null)}
                                >
                                    <span>{localizedFieldName}</span>
                                    <div className={`tooltip ${hoveredField === idx ? 'active' : ''}`}>
                                        <div className="tooltip-box">
                                            {tooltipText}
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    placeholder={fieldName}
                                    value={row[key] ?? ''}
                                    onChange={(e) => updateRow(index, key, e.target.value)}
                                    readOnly={fieldName.toLowerCase() === 'id'}
                                />
                            </label>
                        );
                    } else {
                        inputElement = (
                            <label key={idx}>
                                <div
                                    className="field-label"
                                    onMouseEnter={() => setHoveredField(idx)}
                                    onMouseLeave={() => setHoveredField(null)}
                                >
                                    <span>{localizedFieldName}</span>
                                    <div className={`tooltip ${hoveredField === idx ? 'active' : ''}`}>
                                        <div className="tooltip-box">
                                            {tooltipText}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder={fieldName}
                                    value={row[key] ?? ''}
                                    onChange={(e) => updateRow(index, key, e.target.value)}
                                    readOnly={fieldName.toLowerCase() === 'id'}
                                />
                            </label>
                        );
                    }
                    return inputElement;
                })}
            </div>
            <div className="btn-wrapper">
                <button onClick={() => addRowAfter(index)} className='btn-add'>바로 다음 추가</button>
                <button onClick={() => deleteRow(index)} className='btn-delete'>삭제</button>
            </div>
        </div>
    );
};

export default DialogueRow;