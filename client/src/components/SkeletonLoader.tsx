import {motion} from 'framer-motion';

export const SkeletonCard = () => (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
        <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"/>
        <div className="p-6 pt-14">
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"/>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"/>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"/>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"/>
            </div>
        </div>
    </motion.div>
);

export const SkeletonTable = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"/>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"/>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"/>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"/>
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"/>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2"/>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"/>
            </div>
        ))}
    </div>
);

export const SkeletonKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"/>
                </div>
                <div className="p-4 space-y-3">
                    {[...Array(3)].map((_, j) => (
                        <div key={j} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-3"/>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-full mb-2"/>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"/>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
