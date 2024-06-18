import React from 'react';

function RestrictiveContainer({ children }: { children: React.ReactNode }) {
	return <div className="max-w-screen-2xl mx-auto">{children}</div>;
}

export default RestrictiveContainer;
