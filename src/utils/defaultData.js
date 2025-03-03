// src/utils/defaultData.js
import csvSchema from '../assets/CSVItem.json';
import { getDefaultRow } from './defaultRow';

export const DEFAULT_DATA = Object.keys(csvSchema).reduce((acc, key) => {
    acc[key] = [getDefaultRow(key)];
    return acc;
}, {});