// src/App.jsx
import { useState, useEffect } from 'react';
import CSVUploader from './components/CSVUploader';
import CSVExporter from './components/CSVExporter';
import DialogueList from './components/DialogueList';
import { arrayMove } from '@dnd-kit/sortable';
import { DEFAULT_DATA } from './utils/defaultData';
import csvSchema from './assets/CSVlocalize.json';
import './css/App.css';

const App = () => {
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem('csvData');
        return storedData ? JSON.parse(storedData) : DEFAULT_DATA;
    });

    const [activeTab, setActiveTab] = useState('script');

    useEffect(() => {
        localStorage.setItem('csvData', JSON.stringify(data));
    }, [data]);

    const rows = data[activeTab] || [];

    const reassignIds = (rowsArray) =>
        rowsArray.map((row, index) => ({ ...row, id: index + 1 }));

    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setData(prev => ({ ...prev, [activeTab]: newRows }));
    };

    const addRowAfter = (index) => {
        import('./utils/defaultRow').then(({ getDefaultRow }) => {
            const emptyRow = getDefaultRow(activeTab);
            const newRows = [...rows];
            newRows.splice(index + 1, 0, emptyRow);
            setData(prev => ({ ...prev, [activeTab]: reassignIds(newRows) }));
        });
    };

    const deleteRow = (index) => {
        let newRows = [...rows];
        if (rows.length === 1) {
            import('./utils/defaultRow').then(({ getDefaultRow }) => {
                const emptyRow = getDefaultRow(activeTab);
                newRows = [emptyRow];
                setData(prev => ({ ...prev, [activeTab]: reassignIds(newRows) }));
            });
        } else {
            newRows.splice(index, 1);
            setData(prev => ({ ...prev, [activeTab]: reassignIds(newRows) }));
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = Number(active.id);
        const newIndex = Number(over.id);
        const newRows = arrayMove(rows, oldIndex, newIndex);
        setData(prev => ({
            ...prev,
            [activeTab]: reassignIds(newRows)
        }));
    };

    const handleDataLoaded = (parsedRows) => {
        setData(prev => ({ ...prev, [activeTab]: parsedRows }));
    };

    // groupedTabs: category(depth1)와 CSVName(depth2)로 그룹화
    const groupedTabs = Object.entries(csvSchema).reduce((acc, [key, value]) => {
        const category = value.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ key, CSVName: value.CSVName });
        return acc;
    }, {});

    return (
        <div className="App">
            <h1>간단 CSV 편집기</h1>

            {/* 그룹화된 탭 메뉴 */}
            <div className="tab-menu">
                {Object.entries(groupedTabs).map(([category, tabs]) => (
                    <details key={category} className="tab-group">
                        <summary>{category}</summary>
                        <div className="">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={activeTab === tab.key ? 'active' : ''}
                                >
                                    {tab.CSVName}
                                </button>
                            ))}
                        </div>
                    </details>
                ))}
            </div>

            <div className="controls">
                <CSVUploader onDataLoaded={handleDataLoaded} activeTab={activeTab} />
                <CSVExporter rows={rows} activeTab={activeTab} />
            </div>
            
            <div className="control-notice">
                <p>CSV 업로드 전 작업 영역이 맞는지 확인해 주세요.</p>
                <p>업로드 시 기존 작업이 덮어씌워집니다. 반드시 내보내기로 백업 후 작업해주세요.</p>
            </div>


            <div className="title">
                <span>{activeTab}.csv</span>
            </div>

            <DialogueList
                activeTab={activeTab}
                rows={rows}
                updateRow={updateRow}
                addRowAfter={addRowAfter}
                deleteRow={deleteRow}
                handleDragEnd={handleDragEnd}
            />
        </div>
    );
};

export default App;