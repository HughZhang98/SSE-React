import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

	const [message, setMessage] = useState('');
	const [status, setStatus] = useState('');

	useEffect(() => {
		const eventSource = new EventSource('http://localhost:3003', { withCredentials: true });

		eventSource.onopen = () => {
			console.log('SSE connection opened.');
			setStatus('loading');
		};

		eventSource.addEventListener('message', (event) => {
			console.log('Received data:', event.data);
			setMessage(prev => prev + event.data);
		}, false);

		eventSource.onerror = (event) => {
			console.error('SSE Error:', event);
			setStatus('loaded');
			if ((event.target as EventSource).readyState === EventSource.CLOSED) {
				console.log('SSE connection closed.');
			}
		};

		eventSource.close = () => {
			setStatus('loaded');
			console.log('SSE connection closed by server.');
		};

		// 清理函数
		return () => {
			eventSource.close();
		};
	}, []); // 空依赖数组，仅在组件挂载时执行

	return (
		<div>
			<Button type="primary" onClick={() => window.location.reload()}>SSE Example 清空页面</Button>
			<div className={`time-container ${status}`}>
				{message}
			</div>
		</div>
	);
}

export default App;
