import React from 'react';

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
	className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
	rows = 10,
	showHeader = true,
	className = '',
}) => {
	return (
		<div className={`animate-pulse ${className}`}>
			{/* Header/Title Section */}
			{showHeader && (
				<div className="mb-6">
					{/* Main title placeholder */}
					<div className="h-6 bg-gray-200 rounded-md w-48 mx-auto mb-2"></div>
					{/* Subtitle placeholder */}
					<div className="h-4 bg-gray-200 rounded-md w-64 mx-auto"></div>
				</div>
			)}

			{/* Table Header Row */}
			<div className="h-12 bg-gray-200 rounded-md mb-4"></div>

			{/* Table Body Rows */}
			<div className="space-y-3">
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div key={rowIndex} className="grid grid-cols-4 gap-4">
						{/* Column 1 - Shorter width */}
						<div className="h-4 bg-gray-200 rounded-md w-20"></div>
						{/* Column 2 - Medium width */}
						<div className="h-4 bg-gray-200 rounded-md w-32"></div>
						{/* Column 3 - Longer width */}
						<div className="h-4 bg-gray-200 rounded-md w-40"></div>
						{/* Column 4 - Medium width */}
						<div className="h-4 bg-gray-200 rounded-md w-28"></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TableSkeleton;
