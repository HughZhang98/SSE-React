import { Button, Tag, Input } from 'antd';
import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ArrowUpOutlined } from '@ant-design/icons';
import './App.css';

function App() {

	const [refContent, setRefContent] = useState('引用信息区域');
	const [status, setStatus] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [eventSource, setEventSource] = useState(null as EventSource | null);
	const [messages, setMessages] = useState<Array<{ role: 'user' | 'sun', content: string }>>([]);
	const [currentSunMessage, setCurrentSunMessage] = useState('');

	const handleContent = () => {
		// eventSource.close();
		if (inputValue) {
			if (eventSource) {
				// 保存当前累积的消息
				if (currentSunMessage) {
					setMessages(prev => [...prev, { role: 'sun', content: currentSunMessage }]);
					setCurrentSunMessage('');
				}
				eventSource.close();
				setEventSource(null);
			}
			// 添加用户消息
			setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
			// 创建新的 SSE 连接
			const newEventSource = new EventSource('http://localhost:3003', { withCredentials: true });
			setEventSource(newEventSource);

			// 清空输入框
			setInputValue('');
			setCurrentSunMessage(''); // 重置当前 Sun 消息

			newEventSource.onopen = () => {
				console.log('SSE connection opened.');
				setStatus('loading');
			};

			newEventSource.addEventListener('message', (event) => {
				console.log('Received data:', event.data);
				setCurrentSunMessage(prev => prev + event.data);
			}, false);

			newEventSource.onerror = (event) => {
				console.error('SSE Error:', event);
				setStatus('loaded');
				if ((event.target as EventSource).readyState === EventSource.CLOSED) {
					console.log('SSE connection closed.');

					// SSE 结束时，将累积的消息添加到对话历史
					if (currentSunMessage) {
						setMessages(prev => [...prev, { role: 'sun', content: currentSunMessage }]);
					}
					newEventSource.close();
					setEventSource(null);
				}
			};
		}
	};

	const handleRefContent = () => {
		setRefContent('');
	};

	return (
		<div>
			<div className="chat-box">
				<div className="chat-title">Sun AI</div>
				<div className="messages-container">
					{messages.map((message, index) => (
						<div key={index} className={`message ${message.role}`}>
							{/* <div className="message-header">User</div> */}
							{/* <div className="message-header">{message.role === 'sun' ? 'Sun' : 'User'}</div> */}
							<div className="message-content">{message.content}</div>
						</div>
					))}
					{/* 显示正在累积的 Sun 消息 */}
					{currentSunMessage && (
						<div className="message sun">
							{/* <div className="message-header">Sun</div> */}
							<div className={`message-content ${status}`}>{currentSunMessage}</div>
						</div>
					)}
				</div>
				<div className="tag-box">
					{[...Array(3)].map((_, i) => (
						<Tag key={i} closeIcon={<CloseOutlined />} onClose={() => console.log(`Tag ${i} closed`)}>快捷提示 {i + 1}</Tag>
					))}
				</div>
				<div>
					<div className='ref-box'>
						<span>
							{refContent}
						</span>
						<Button className="ref-clear" onClick={handleRefContent} color="default" shape="circle" size="small" variant="text" icon={<CloseOutlined />} />
					</div>
				</div>
				<div className="input-box">
					<Input 
						value={inputValue} className={'inputSty'} 
						// disabled={status} 
						onChange={(e) => setInputValue(e.target.value)} 
						onKeyPress={(e) => {if (e.key === 'Enter') handleContent()}} />
					<Button type="primary" disabled={!inputValue} onClick={handleContent} shape="circle" icon={<ArrowUpOutlined />} />
				</div>
			</div>
		</div>
	);
}

export default App;
// document.querySelectorAll('.km-btn.import').forEach((item) => { item.click() })
// setTimeout(() => {
// 	document.querySelectorAll('.dropDown-item').forEach((item => {
// 		if (item.textContent == '导入.md') {
// 			item.click()
// 		}
// 	}))  
// },500)
