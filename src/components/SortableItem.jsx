import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} className="sortable-item">
            {/* 드래그 핸들 영역 */}
            <div ref={setActivatorNodeRef} {...listeners} className="drag-handle" style={{ cursor: 'grab'}}>
                <span></span>
            </div>
            {children}
        </li>
    );
};

export default SortableItem;