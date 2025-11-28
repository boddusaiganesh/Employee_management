import {useState, useRef} from 'react';
import {motion} from 'framer-motion';
import {X, Upload, FileText, AlertCircle, CheckCircle} from 'lucide-react';
import {parseCSV} from '../lib/export';
import {showToast} from '../lib/toast';

interface ImportModalProps {
    onClose: () => void;
    onImport: (data: any[]) => Promise<void>;
    type: 'employees' | 'tasks';
}

const ImportModal = ({onClose, onImport, type}: ImportModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            showToast.error('Please select a CSV file');
            return;
        }

        setFile(selectedFile);

        try {
            const data = await parseCSV(selectedFile);
            setPreview(data.slice(0, 5)); // Show first 5 rows
        } catch (error) {
            showToast.error('Failed to parse CSV file');
            setFile(null);
        }
    };

    const handleImport = async () => {
        if (!file || preview.length === 0) return;

        setLoading(true);
        try {
            const allData = await parseCSV(file);
            await onImport(allData);
            showToast.success(`Successfully imported ${allData.length} ${type}`);
            onClose();
        } catch (error: any) {
            showToast.error(error.message || 'Failed to import data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.95, opacity: 0}}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Import {type === 'employees' ? 'Employees' : 'Tasks'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Upload a CSV file to bulk import data
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600"/>
                    </button>
                </div>

                <div className="p-6">
                    {/* Upload Area */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4"/>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {file ? file.name : 'Choose a CSV file or drag it here'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Supported format: CSV
                        </p>
                    </div>

                    {/* CSV Format Guide */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5"/>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Required CSV Format</h4>
                                <p className="text-sm text-blue-800 mb-2">
                                    {type === 'employees'
                                        ? 'Columns: First Name, Last Name, Email, Phone, Department, Position, Salary, Hire Date, Status'
                                        : 'Columns: Title, Description, Status, Priority, Due Date, Employee ID'}
                                </p>
                                <p className="text-xs text-blue-700">
                                    The first row should contain column headers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    {preview.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <FileText className="w-5 h-5 mr-2"/>
                                Preview (First 5 rows)
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-300">
                                        {Object.keys(preview[0]).map((key) => (
                                            <th key={key}
                                                className="px-4 py-2 text-left font-semibold text-gray-700">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {preview.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-200">
                                            {Object.values(row).map((val: any, j) => (
                                                <td key={j} className="px-4 py-2 text-gray-600">
                                                    {val?.toString() || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-green-600">
                                <CheckCircle className="w-4 h-4 mr-2"/>
                                File looks good! Ready to import.
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            disabled={!file || preview.length === 0 || loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Importing...' : 'Import Data'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImportModal;
