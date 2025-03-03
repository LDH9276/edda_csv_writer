// src/components/DialogueList.jsx
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import DialogueRow from './DialogueRow';
import csvSchema from '../assets/CSVItem.json';


const DialogueList = ({ rows, updateRow, addRowAfter, deleteRow, handleDragEnd, activeTab }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const [schema, setSchema] = useState(csvSchema[activeTab] || null);

    useEffect(() => {
        setSchema(csvSchema[activeTab]);
    }, [activeTab]);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

            <SortableContext items={rows.map((_, index) => String(index))} strategy={verticalListSortingStrategy}>
                <ul className='csv-item'>
                    {rows.map((row, index) => (
                        <SortableItem key={index} id={String(index)}>
                            <DialogueRow
                                activeTab={activeTab}
                                row={row}
                                index={index}
                                updateRow={updateRow}
                                addRowAfter={addRowAfter}
                                deleteRow={deleteRow}
                            />
                        </SortableItem>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default DialogueList;